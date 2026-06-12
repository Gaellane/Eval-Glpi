
import { apiCall, v1Headers, v2Headers } from "../../services/api/api";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;
const endpoint = BASE_URL+"/api/status";


function createTicketStatus(name , value , color,id = null) {
    const state = { name: name, value: value, color: color };
    if (id) {
        state.id = id;
    }
    return state;
}

export async function save(state) {
    try {   
        const response = await apiCall(endpoint, "POST", null, state);
        return createTicketStatus(state.name, state.value, state.color, response.id);
    } catch (error) {
        console.error("Error saving state:", error);
        throw error;
    }
}

export async function getAllTicketStatus() {
    try {
        const response = await apiCall(endpoint , "GET");
        return response.map(r => 
            createTicketStatus(r.name , r.value , r.color , r.id)
        )
    } catch(error) {
        throw error;
    }
}

export async function getTraductionsByValue(value) {
    try {
        const response = await apiCall(`${endpoint}/traductions/${value}` , "GET");
        return response; 
    } catch(error) {
        console.error("Error fetching traductions:", error);
        throw error;
    }
}

export async function getAllTraductionsByLangue(langueId) {
    try {
        const response = await apiCall(`${endpoint}/${langueId}` , "GET");
        console.log("status traduit",response);
        return response; 
    } catch(error) {
        throw error;
    }
}

export async function update(value , color ,traductions) {
    try {
        const response = await apiCall(`${endpoint}/traductions/update/${value}` , "POST", {"Content-Type" : 'application/json'}, { color, traductions } , {} , true);
        console.log("Response from updateTraductions:", response);  
    } catch(error) {
        console.error("Error updating traductions:", error);
        throw error;
    }
}

export async function deleteTraductions(value) {
    try {
        const response = await apiCall(`${endpoint}/traductions/delete/${value}` , "DELETE");
        console.log("Response from deleteTraductions:", response);  
    } catch(error) {
        console.error("Error deleting traductions:", error);
        throw error;
    }
}

export async function deleteTraductionsForAllValues() {
    try {
        const allStatuses = await getAllTicketStatus();
        for (const status of allStatuses) {
            await deleteTraductions(status.value);
        }
        console.log("All traductions deleted successfully.");
    } catch (error) {
        console.error("Error deleting traductions for all values:", error);
        throw error;
    }
}
