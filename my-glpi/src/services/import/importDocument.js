import JSZip from "jszip";
import { uploadDocument, linkDocumentToItem } from "../../models/documents/Document";

// ── Détection par signature binaire ──────────────────────────────────────────

const IMAGE_SIGNATURES = [
  { ext: 'jpg',  mime: 'image/jpeg', parts: [{ offset: 0, bytes: [0xff, 0xd8, 0xff] }] },
  { ext: 'png',  mime: 'image/png',  parts: [{ offset: 0, bytes: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] }] },
  { ext: 'gif',  mime: 'image/gif',  parts: [{ offset: 0, bytes: [0x47, 0x49, 0x46, 0x38] }] },
  { ext: 'bmp',  mime: 'image/bmp',  parts: [{ offset: 0, bytes: [0x42, 0x4d] }] },
  { ext: 'webp', mime: 'image/webp', parts: [{ offset: 0, bytes: [0x52, 0x49, 0x46, 0x46] }, { offset: 8, bytes: [0x57, 0x45, 0x42, 0x50] }] },
  { ext: 'tif',  mime: 'image/tiff', parts: [{ offset: 0, bytes: [0x49, 0x49, 0x2a, 0x00] }] },
  { ext: 'tif',  mime: 'image/tiff', parts: [{ offset: 0, bytes: [0x4d, 0x4d, 0x00, 0x2a] }] },
  { ext: 'ico',  mime: 'image/x-icon', parts: [{ offset: 0, bytes: [0x00, 0x00, 0x01, 0x00] }] },
  { ext: 'heic', mime: 'image/heic', parts: [{ offset: 4, bytes: [0x66, 0x74, 0x79, 0x70] }, { offset: 8, bytes: [0x68, 0x65, 0x69] }] },
  { ext: 'avif', mime: 'image/avif', parts: [{ offset: 4, bytes: [0x66, 0x74, 0x79, 0x70] }, { offset: 8, bytes: [0x61, 0x76, 0x69, 0x66] }] },
  { ext: 'psd',  mime: 'image/vnd.adobe.photoshop', parts: [{ offset: 0, bytes: [0x38, 0x42, 0x50, 0x53] }] },
];

function matchesPart(bytes, part) {
  return part.bytes.every((b, i) => bytes[part.offset + i] === b);
}

function matchesSignature(bytes, sig) {
  return sig.parts.every(part => matchesPart(bytes, part));
}

function detectImageType(bytes) {
  const hit = IMAGE_SIGNATURES.find(sig => matchesSignature(bytes, sig));
  return hit ? { ext: hit.ext, mime: hit.mime } : null;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function getBasename(filename) {
  const name = filename.split("/").pop();
  return name.substring(0, name.lastIndexOf(".")) || name;
}

// ── Import principal ──────────────────────────────────────────────────────────

export async function importDocuments(zipFile, assets = []) {
  const results = { success: [], errors: [] };

  try {
    const zip = await JSZip.loadAsync(zipFile);

    // Pré-filtrage léger par extension (évite de lire les binaires inutilement)
    const KNOWN_EXTS = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "tif", "tiff", "ico", "heic", "avif", "psd", "svg"];
    const candidateFiles = Object.values(zip.files).filter(f => {
      if (f.dir) return false;
      const ext = f.name.split(".").pop().toLowerCase();
      return KNOWN_EXTS.includes(ext);
    });

    console.log(`[importDocuments] ${candidateFiles.length} fichiers candidats dans le ZIP`);

    // Aplatir assets (robuste)
    const flatAssets = (function flatten(as) {
      if (!as) return [];
      if (Array.isArray(as)) {
        return as.flatMap(a => Array.isArray(a) ? flatten(a) : (a && typeof a === "object" ? [a] : []));
      }
      if (typeof as === "object") {
        return Object.values(as).flatMap(v =>
          Array.isArray(v) ? v : (v && typeof v === "object" ? [v] : [])
        );
      }
      return [];
    })(assets);

    const norm = v => v?.trim().toLowerCase();

    for (const zipEntry of candidateFiles) {
      try {
        const assetName = getBasename(zipEntry.name);

        const matchedAsset = flatAssets.find(a => norm(a.name) === norm(assetName));

        if (!matchedAsset) {
          console.warn(`[importDocuments] Aucun asset trouvé pour : ${assetName}`);
          results.errors.push({ file: zipEntry.name, reason: `Asset "${assetName}" introuvable` });
          continue;
        }

        if (!matchedAsset.id) {
          console.warn(`[importDocuments] Asset "${assetName}" sans ID`);
          results.errors.push({ file: zipEntry.name, reason: `Asset "${assetName}" sans ID` });
          continue;
        }

        // Lire les octets bruts pour détection + construction du Blob
        const arrayBuffer = await zipEntry.async("arraybuffer");
        const bytes = new Uint8Array(arrayBuffer);

        // Détection par magic bytes (prioritaire sur l'extension)
        const detected = detectImageType(bytes);

        if (!detected) {
          console.warn(`[importDocuments] Signature inconnue pour : ${zipEntry.name}`);
          results.errors.push({ file: zipEntry.name, reason: "Type d'image non reconnu (signature binaire invalide)" });
          continue;
        }

        console.log(`[importDocuments] ${zipEntry.name} → ${detected.mime} (détecté par signature)`);

        const filename = `${assetName}.${detected.ext}`;
        const file = new File([arrayBuffer], filename, { type: detected.mime });

        // Upload document
        const doc = await uploadDocument(file, assetName);

        if (!doc?.id) {
          results.errors.push({ file: zipEntry.name, reason: "Upload échoué (pas d'ID retourné)" });
          continue;
        }

        // Lien GLPI
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