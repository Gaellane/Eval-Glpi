import { apiCall } from "../../services/api/api";

const BASE_URL = import.meta.env.VITE_BACKEND_GLPI_URL;
const v2_endpoint = BASE_URL+'/v2.3/Dropdowns/';
const v1_endpoint = BASE_URL+'/v1/';
const v1token = sessionStorage.getItem("session-token-v1");
const v2token = sessionStorage.getItem("user-token");




export function createModel(item_type , name , id = null ) {
    const model = { item_type : item_type , name:name} ;
    if(id) {
        model.id=id;
    }
    return model;
}



export async function save(model) {
    const url = v1_endpoint+model.item_type+"Model";
    // const headers = {
    //     "Content-Type": "application/json",
    //     "Authorization": "Bearer " + v2token
    // };

    const headers = {
        "Session-Token": v1token,
        "Content-Type": "application/json"
    };
    const body = { input : [{name : model.name}]};
    try {   
        const response = await apiCall(url, "POST", headers, body);
        return createModel(model.item_type, model.name, response.id);
    } catch (error) {
        console.error("Error saving state:", error);
        throw error;
    }
}


export async function saveMultiple(models ) {
    try {
        let input = [] ;
        for (const model of models) {
            input.push(model);
        }
        const item_type = models.length > 0 ? models[0].item_type : null;
        const url = v1_endpoint+item_type+"Model";
        const headers = {
            "Session-Token": v1token,
            "Content-Type": "application/json"
        };
        const body = { input : input};
        const response = await apiCall(url, "POST", headers, body);
        // console.log(" [DEBUG] Model response:", response);
        const created = Array.isArray(response) ? response : (response ? [response] : []);
        const savedModels = created.map((m, idx) => {
            const name = m.name || input[idx]?.name || (m.message && m.message.split(":")[1] && m.message.split(":")[1].trim()) || null;
            const id = m.id || m.ID || m.Id || null;
            return createModel(item_type, name, id);
        });
        return savedModels;
        
    } catch (error) {
        console.error("Error saving multiple models:", error);
        throw error;
    }   
}