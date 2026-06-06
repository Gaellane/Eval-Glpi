import { saveMultiple } from "../../models/dropdowns/Model";

export async function createModel(file) {
    try {
        const allModels = await getModel(file); 
        const savedByType = {};
        for (const [itemType, models] of Object.entries(allModels)) {
            // console.log(" [DEBUG] Saving models for item type:", itemType, "Models:", models);
            savedByType[itemType] = await saveMultiple(models, itemType);
        }
        return savedByType;
    } catch (error) {
        console.error("Error getting model:", error);
        throw error;
    }
}

async function getModel(file) {
    try {
        const pairs = file
            .map(row => {
                const item_type = row.item_type.trim();
                const name =row.model.trim();
                return { item_type, name };
            })
            .filter(p => p.item_type && p.name);

        const grouped = pairs.reduce((acc, { item_type, name }) => {
            if (!acc[item_type]) acc[item_type] = new Set();
            acc[item_type].add(name);
            return acc;
        }, {});

        const result = {};
        for (const [item_type, namesSet] of Object.entries(grouped)) {
            result[item_type] = Array.from(namesSet).map(name => ({ name, item_type }));
        }

        return result;
    } catch (error) {
        console.error("Error creating model list:", error);
        throw error;
    }
}