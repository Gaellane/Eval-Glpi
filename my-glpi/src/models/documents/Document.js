import { apiCall } from "../../services/api/api";

const BASE_URL = import.meta.env.VITE_BACKEND_GLPI_URL;

function createDocument(name, id = null) {
    const doc = { name };
    if (id) doc.id = id;
    return doc;
}

export async function uploadDocument(file, name) {
    const formData = new FormData();
    
    formData.append("uploadManifest", JSON.stringify({
        input: {
            name: name,
            _filename: ["filename[0]"]  // ✅ nom du champ, pas le nom du fichier
        }
    }));
    formData.append("filename[0]", file, file.name);

    const response = await fetch(`${BASE_URL}/v1/Document`, {
        method: "POST",
        headers: {
            "Session-Token": sessionStorage.getItem("session-token-v1")
        },
        body: formData
    });

    const data = await response.json();
    console.log("[uploadDocument] Response:", data);
    const id = data?.id || null;
    return createDocument(name, id);
}

export async function linkDocumentToItem(document_id, itemtype, items_id) {
    const headers = {
        "Session-Token": sessionStorage.getItem("session-token-v1"),
        "Content-Type": "application/json"
    };

    return await apiCall(`${BASE_URL}/v1/Document_Item`, "POST", headers, {
        input: {
            documents_id: document_id,
            itemtype: itemtype,
            items_id: items_id
        }
    });
}