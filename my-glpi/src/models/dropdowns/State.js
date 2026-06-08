
import { apiCall, v1Headers, v2Headers } from "../../services/api/api";

const BASE_URL = import.meta.env.VITE_BACKEND_GLPI_URL;
const v2_endpoint = BASE_URL+'/v2.3/Dropdowns/State';
const v1_endpoint = BASE_URL+'/v1/State';


function createAssetState(name, id = null) {
    const state = { name: name };
    if (id) {
        state.id = id;
    }
    return state;
}

export async function save(state) {
    const url = v1_endpoint;
    // const headers = {
    //     "Content-Type": "application/json",
    //     "Authorization": "Bearer " + v2token
    // };

    const headers = v1Headers('application/json');
    const body = { input : [state]};
    try {   
        const response = await apiCall(url, "POST", headers, body);
        return createAssetState(state.name, response.id);
    } catch (error) {
        console.error("Error saving state:", error);
        throw error;
    }
}

export async function saveMultiple(states) {
    try {
        let input = [] ;
        for (const state of states) {
            input.push(state);
        }
        const url = v1_endpoint;
        const headers = v1Headers('application/json');
        const body = { input : input};
        const response = await apiCall(url, "POST", headers, body);
        console.log(response);
        const savedStates = response.map(state => createAssetState(state.message.split(":")[1] ?? null, state.id));
        return savedStates;
        
    } catch (error) {
        console.error("Error saving multiple states:", error);
        throw error;
    }   
}
