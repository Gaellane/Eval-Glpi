import JSZip from "jszip";
import { uploadDocument, linkDocumentToItem } from "../../models/documents/Document";

// Extensions images supportées
const IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"];

function getExtension(filename) {
    return filename.split(".").pop().toLowerCase();
}

function getAssetNameFromFilename(filename) {
    // "PC-ADM-001.jpg" → "PC-ADM-001"
    const parts = filename.split("/").pop(); // ignorer les dossiers
    return parts.substring(0, parts.lastIndexOf(".")) || parts;
}

function isImage(filename) {
    return IMAGE_EXTENSIONS.includes(getExtension(filename));
}

export async function importDocuments(zipFile, assets = []) {
    const results = { success: [], errors: [] };

    try {
        const zip = await JSZip.loadAsync(zipFile);
        const imageFiles = Object.values(zip.files).filter(f => !f.dir && isImage(f.name));

        console.log(`[importDocuments] ${imageFiles.length} images trouvées dans le ZIP`);

        for (const zipEntry of imageFiles) {
            try {
                const assetName = getAssetNameFromFilename(zipEntry.name);

                // Trouver l'asset correspondant par nom
                const norm = v => v?.trim().toLowerCase();
                const flatAssets = (function flatten(as) {
                    if (!as) return [];
                    if (Array.isArray(as)) {
                        const out = [];
                        for (const a of as) {
                            if (Array.isArray(a)) out.push(...a);
                            else if (a && typeof a === 'object') out.push(a);
                        }
                        return out;
                    }
                    if (typeof as === 'object') {
                        return Object.values(as).reduce((acc, v) => acc.concat(Array.isArray(v) ? v : []), []);
                    }
                    return [];
                })(assets);
                const matchedAsset = flatAssets.find(a => norm(a.name) === norm(assetName));

                if (!matchedAsset) {
                    console.warn(`[importDocuments] Aucun asset trouvé pour: ${assetName}`);
                    results.errors.push({ file: zipEntry.name, reason: `Asset "${assetName}" introuvable` });
                    continue;
                }

                if (!matchedAsset.id) {
                    console.warn(`[importDocuments] Asset "${assetName}" trouvé mais sans ID`);
                    results.errors.push({ file: zipEntry.name, reason: `Asset "${assetName}" sans ID` });
                    continue;
                }

                // Extraire le blob depuis le ZIP
                const blob = await zipEntry.async("blob");
                const file = new File([blob], zipEntry.name.split("/").pop(), {
                    type: `image/${getExtension(zipEntry.name)}`
                });


                // Upload du document
                const doc = await uploadDocument(file, `${assetName} - ${file.name}`);

                if (!doc.id) {
                    results.errors.push({ file: zipEntry.name, reason: "Upload échoué, pas d'ID retourné" });
                    continue;
                }

                // Lier au bon type d'asset
                const itemtype = matchedAsset.item_type || matchedAsset.itemtype || "Computer";
                await linkDocumentToItem(doc.id, itemtype, matchedAsset.id);

                results.success.push({ file: zipEntry.name, asset: assetName, document_id: doc.id });

            } catch (entryError) {
                console.error(`[importDocuments] Erreur sur ${zipEntry.name}:`, entryError);
                results.errors.push({ file: zipEntry.name, reason: entryError.message });
            }
        }

        console.log(`[importDocuments] DONE — ${results.success.length} succès, ${results.errors.length} erreurs`);
        return results;

    } catch (error) {
        console.error("[importDocuments] Erreur lecture ZIP:", error);
        throw error;
    }
}