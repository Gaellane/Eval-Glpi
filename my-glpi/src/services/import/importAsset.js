import { saveMultiple } from "../../models/assets/Asset";

export async function createAsset(file, states = [], locations = [], models = {}, manufacturers = [] , users = []) {
    try {
        const allAssets = await getAssets(file, states, locations, models, manufacturers, users);
        const savedByType = {};
        for (const [itemType, assets] of Object.entries(allAssets)) {
            savedByType[itemType] = await saveMultiple(assets);
        }
        return savedByType;
    } catch (error) {
        console.error("Error creating assets:", error);
        throw error;
    }
}

async function getAssets(file, states = [], locations = [], models = {}, manufacturers = [] , users = []) {
    try {

        const assets = file
            .map(row => {
                const item_type =row.item_type;
                const name = row.name;
                const contact = row.user;
                const otherserial = row.inventory_number;
                const stateName = row.status;
                const locationName = row.location;
                const modelName = row.model;
                const manufacturerName = row.manufacturer;
                const userName = row.user;

                const norm = v => (v && typeof v === 'string') ? v.trim().toLowerCase() : null;
                const stateNameNorm = norm(stateName);
                const locationNameNorm = norm(locationName);
                const manufacturerNameNorm = norm(manufacturerName);
                const modelNameNorm = norm(modelName);
                const userNameNorm = norm(userName);
                
                const findByName = (list, needle) => {
                    if (!Array.isArray(list) || !needle) return null;
                    return list.find(item => {
                        const candidate = item && (item.name || item.Name || item.label || item.Label);
                        return candidate && norm(candidate) === needle;
                    }) || null;
                };

                const stateMatch = findByName(states, stateNameNorm);
                const locationMatch = findByName(locations, locationNameNorm);
                const manufacturerMatch = findByName(manufacturers, manufacturerNameNorm);
                const modelsForType = models[item_type];
                const modelMatch = findByName(modelsForType, modelNameNorm);
                const userMatch = users.find(u => norm(u.username) === userNameNorm || norm(u.realname) === userNameNorm) || null;

                //console.log(" [DEBUG] Asset mapping - Item Type:", item_type, "Name:", name, "Contact:", contact, "Other Serial:", otherserial, "State:", stateName, "Location:", locationName, "Model:", modelName, "Manufacturer:", manufacturerName);

                return {
                    item_type,
                    name,
                    contact,
                    otherserial,
                    state: stateMatch ,
                    location: locationMatch ,
                    model: modelMatch ,
                    manufacturer: manufacturerMatch, 
                    user: userMatch
                };
            })
            .filter(a => a.item_type && a.name);


        const grouped = assets.reduce((acc, asset) => {
            if (!acc[asset.item_type]) acc[asset.item_type] = [];
            acc[asset.item_type].push(asset);
            return acc;
        }, {});

        return grouped;
    } catch (error) {
        console.error("Error getting assets:", error);
        throw error;
    }
}
