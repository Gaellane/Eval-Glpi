
import { apiCall, v1Headers, v2Headers } from "../../services/api/api";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;
const endpoint = BASE_URL+"/api/langues";


function createLangue(name, code ,id = null) {
    const state = { name: name, code: code };
    if (id) {
        state.id = id;
    }
    return state;
}


export async function getAllLangues() {
    try {
        const response = await apiCall(endpoint , "GET");
        return response.map(r => 
            createLangue(r.name , r.code , r.id)
        )
    } catch(error) {
        throw error;
    }
}
