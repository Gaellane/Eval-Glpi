import { saveMultiple } from "../../models/dropdowns/Manufacturer";

export async function createManufacturer(file) {
    try {
        const manufacturers = await getManufacturers(file);
        const savedManufacturers = await saveMultiple(manufacturers);
        return savedManufacturers;
    } catch (error) {
        console.error("Error creating manufacturers:", error);
        throw error;
    }
}

async function getManufacturers(file) {
    try {
        const manufacturersInFile = file
            .map(element => element.manufacturer?.trim())
            .filter(manufacturer => manufacturer);

        const uniqueManufacturers = [...new Set(manufacturersInFile)];

        return uniqueManufacturers.map(manufacturer => ({
            name: manufacturer
        }));
    } catch (error) {
        console.error("Error getting manufacturers:", error);
        throw error;
    }
}