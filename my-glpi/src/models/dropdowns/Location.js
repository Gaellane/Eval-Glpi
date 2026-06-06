import { apiCall } from "../../services/api/api";

const BASE_URL = import.meta.env.VITE_BACKEND_GLPI_URL;
const v2_endpoint = `${BASE_URL}/v2.3/Dropdowns/Location`; 
const v1_endpoint = BASE_URL+'/v1/Location';
const v1token = sessionStorage.getItem("session-token-v1");
const v2token = sessionStorage.getItem("user-token");

function createLocation(name, id = null) {
    const location = { name: name };
    if (id) {
        location.id = id;
    }
    return location;
}

export async function save(location) {
    const url = v1_endpoint; 
    const headers = {
        "Session-Token": v1token,
        "Content-Type": "application/json"
    };
    const body = {input : [location]};
    
    try {   
        const response = await apiCall(url, "POST", headers, body);
        return createLocation(response.name, response.id);
    } catch (error) {
        console.error("Error saving location:", error);
        throw error;
    }
}

export async function saveMultiple(locations) {
    try {
        let input = [] ;
        for (const location of locations) {
            input.push(location);
        }
        const url = v1_endpoint;
        const headers = {
            "Session-Token": v1token,
            "Content-Type": "application/json"
        };
        const body = { input : input};
        const response = await apiCall(url, "POST", headers, body);
        const savedLocations = response.map(location => createLocation(location.message.split(":")[1], location.id));
        return savedLocations;
        
    } catch (error) {
        console.error("Error saving multiple locations:", error);
        throw error;
    }   
}

