import { apiCall, v1Headers, v2Headers } from "../../services/api/api";

const BASE_URL = import.meta.env.VITE_BACKEND_GLPI_URL;
const v1_endpoint = BASE_URL + '/v1/Document';
const v2_endpoint = BASE_URL + '/v2.3/Management/Document';  // Endpoint v2 pour les documents

function createDocument(name, id = null , url=null) {
    const doc = { name };
    if (id) doc.id = id;
    if (url) doc.url = url;
    return doc;
}

export async function uploadDocument(file, name) {
    const formData = new FormData();
    
    formData.append("uploadManifest", JSON.stringify({
        input: {
            name: name,
            _filename: ["filename[0]"]  
        }
    }));
    formData.append("filename[0]", file, file.name);

    const response = await fetch(`${BASE_URL}/v1/Document`, {
        method: "POST",
        headers: v1Headers(null),
        body: formData
    });

    const data = await response.json();
    console.log("[uploadDocument] Response:", data);
    const id = data?.id || null;
    return createDocument(name, id);
}

export async function linkDocumentToItem(document_id, itemtype, items_id) {
    const headers = v1Headers('application/json');

    return await apiCall(`${BASE_URL}/v1/Document_Item`, "POST", headers, {
        input: {
            documents_id: document_id,
            itemtype: itemtype,
            items_id: items_id
        }
    });
}

export async function getAllDocs() {
    try {
        const response = await apiCall(v2_endpoint, "GET", v2Headers());
        if (response && response.length > 0) {
            return response.map(docData => createDocument(docData.name, docData.id, v2_endpoint + '/' + docData.id + '/Download'));
        }
        return null;
    } catch(error) {
        throw error;
    }
}