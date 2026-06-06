import { saveMultiple } from "../../models/dropdowns/Location";


export async function createLocation(file) {
    try{
        const locations = await getLocation(file);
        const savedLocations = await saveMultiple(locations);
        return savedLocations;

    } catch (error) {
        console.error("Error getting location:", error);
        throw error;
    }
}


async function getLocation(file) { 
    try{
        
        const locationInFile = file.map(element => element.location.trim());
        const locations = [...new Set(locationInFile)];
        const locationsCreated = locations.map(loc => {
            return {
                name : loc ,
                is_recursive: true,
            }

        });
        return locationsCreated;
    } catch (error) {
        console.error("Error creating location:", error);
        throw error;
    }
}