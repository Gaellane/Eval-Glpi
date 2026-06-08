import { apiCall, v1Headers } from "../../services/api/api";

const BASE_URL = import.meta.env.VITE_BACKEND_GLPI_URL;

const v1_endpoint = `${BASE_URL}/v1/Manufacturer`;

function createManufacturer(name, id = null) {
    const manufacturer = { name };

    if (id !== null && id !== undefined) {
        manufacturer.id = id;
    }

    return manufacturer;
}

export async function save(manufacturer) {
    const headers = v1Headers('application/json');

    const body = manufacturer;

    try {
        const response = await apiCall(
            v1_endpoint,
            "POST",
            headers,
            body
        );

        return createManufacturer(
            response.name ?? manufacturer.name,
            response.id
        );
    } catch (error) {
        console.error("Error saving manufacturer:", error);
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
        const headers = v1Headers('application/json');
        const body = { input : input};
        const response = await apiCall(url, "POST", headers, body);
        const savedLocations = response.map(location => createManufacturer(location.message.split(":")[1] ?? null, location.id));
        return savedLocations;
        
    } catch (error) {
        console.error("Error saving multiple locations:", error);
        throw error;
    }   
}

