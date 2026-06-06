import JSZip from "jszip";
import { uploadDocument, linkDocumentToItem } from "../../models/documents/Document";

// Extensions images supportées
const IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"];

function getExtension(filename) {
    return filename.split(".").pop().toLowerCase();
}

function getMimeType(ext) {
    const map = {
        jpg: "image/jpeg",
        jpeg: "image/jpeg",
        png: "image/png",
        gif: "image/gif",
        bmp: "image/bmp",
        webp: "image/webp",
        svg: "image/svg+xml"
    };
    return map[ext] || "application/octet-stream";
}

function getAssetNameFromFilename(filename) {
    const parts = filename.split("/").pop(); // enlève dossiers ZIP
    return parts.substring(0, parts.lastIndexOf(".")) || parts;
}

function isImage(filename) {
    return IMAGE_EXTENSIONS.includes(getExtension(filename));
}

export async function importDocuments(zipFile, assets = []) {
    const results = { success: [], errors: [] };

    try {
        const zip = await JSZip.loadAsync(zipFile);

        const imageFiles = Object.values(zip.files).filter(
            f => !f.dir && isImage(f.name)
        );

        console.log(`[importDocuments] ${imageFiles.length} images trouvées dans le ZIP`);

        // Aplatir assets (robuste)
        const flatAssets = (function flatten(as) {
            if (!as) return [];
            if (Array.isArray(as)) {
                const out = [];
                for (const a of as) {
                    if (Array.isArray(a)) out.push(...flatten(a));
                    else if (a && typeof a === "object") out.push(a);
                }
                return out;
            }
            if (typeof as === "object") {
                return Object.values(as).reduce((acc, v) => {
                    if (Array.isArray(v)) acc.push(...v);
                    else if (v && typeof v === "object") acc.push(v);
                    return acc;
                }, []);
            }
            return [];
        })(assets);

        const norm = v => v?.trim().toLowerCase();

        for (const zipEntry of imageFiles) {
            try {
                const assetName = getAssetNameFromFilename(zipEntry.name);

                const matchedAsset = flatAssets.find(
                    a => norm(a.name) === norm(assetName)
                );

                if (!matchedAsset) {
                    console.warn(`[importDocuments] Aucun asset trouvé pour: ${assetName}`);
                    results.errors.push({
                        file: zipEntry.name,
                        reason: `Asset "${assetName}" introuvable`
                    });
                    continue;
                }

                if (!matchedAsset.id) {
                    console.warn(`[importDocuments] Asset "${assetName}" trouvé mais sans ID`);
                    results.errors.push({
                        file: zipEntry.name,
                        reason: `Asset "${assetName}" sans ID`
                    });
                    continue;
                }

                // Blob depuis ZIP
                const blob = await zipEntry.async("blob");
                const ext = getExtension(zipEntry.name);

                const file = new File(
                    [blob],
                    zipEntry.name.split("/").pop(),
                    {
                        type: getMimeType(ext)
                    }
                );

                // Upload document
                const doc = await uploadDocument(file, assetName);

                if (!doc || !doc.id) {
                    results.errors.push({
                        file: zipEntry.name,
                        reason: "Upload échoué (pas d'ID retourné)"
                    });
                    continue;
                }

                // Lien GLPI
                const itemtype =
                    matchedAsset.item_type ||
                    matchedAsset.itemtype ||
                    "Computer";

                await linkDocumentToItem(doc.id, itemtype, matchedAsset.id);

                results.success.push({
                    file: zipEntry.name,
                    asset: assetName,
                    document_id: doc.id
                });

            } catch (entryError) {
                console.error(`[importDocuments] Erreur sur ${zipEntry.name}:`, entryError);
                results.errors.push({
                    file: zipEntry.name,
                    reason: entryError.message
                });
            }
        }

        console.log(
            `[importDocuments] DONE — ${results.success.length} succès, ${results.errors.length} erreurs`
        );

        return results;

    } catch (error) {
        console.error("[importDocuments] Erreur lecture ZIP:", error);
        throw error;
    }
}