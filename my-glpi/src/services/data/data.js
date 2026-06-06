import { getAllAssets } from "../../models/assets/Asset";
import { getAllDocs } from "../../models/documents/Document";

export async function chargerDataStorage() {
    const docs = await getAllDocs();
    const assets = await getAllAssets(docs);
    localStorage.setItem("assets", JSON.stringify(assets));
    localStorage.setItem("documents", JSON.stringify(docs));
    return { assets, documents: docs };
}