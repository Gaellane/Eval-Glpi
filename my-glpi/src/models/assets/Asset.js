import { apiCall } from "../../services/api/api";

const BASE_URL = import.meta.env.VITE_BACKEND_GLPI_URL;
const v1_endpoint = BASE_URL + '/v1/';
const v2_endpoint = BASE_URL + '/v2.3/Assets/';
const v1token = sessionStorage.getItem("session-token-v1");
const v2token = sessionStorage.getItem("user-token");

const ASSET_FIELDS = {
    Computer:           { model: "computermodels_id",           hasContact: true  },
    Monitor:            { model: "monitormodels_id",            hasContact: true  },
    NetworkEquipment:   { model: "networkequipmentmodels_id",   hasContact: true  },
    Printer:            { model: "printermodels_id",            hasContact: true  },
    Phone:              { model: "phonemodels_id",              hasContact: true  },
    Peripheral:         { model: "peripheralmodels_id",         hasContact: true  },
    Rack:               { model: "rackmodels_id",               hasContact: false },
    Enclosure:          { model: "enclosuremodels_id",          hasContact: false },
    PDU:                { model: "pdumodels_id",                hasContact: false },
    PassiveDCEquipment: { model: null,                          hasContact: false },
    Unmanaged:          { model: null,                          hasContact: false },
};

export function createAsset(item_type, name, contact, otherserial, state, location, model, manufacturer, id = null , image) {
    const asset = { item_type, name, contact, otherserial, is_recursive: true, state, location, model, manufacturer };
    if (id) asset.id = id;
    if (image) asset.image = image;
    return asset;
}

function buildBody(asset, item_type) {
    const fields = ASSET_FIELDS[item_type] || {};

    const body = {
        name:             asset.name,
        is_recursive:     true,
        states_id:        asset.state?.id || asset.state || null,
        locations_id:     asset.location?.id || asset.location || null,
        manufacturers_id: asset.manufacturer?.id || asset.manufacturer || null,
        otherserial:      asset.otherserial || null,
    };

    if (fields.model) {
        body[fields.model] = asset.model?.id || asset.model || null;
    }

    if (fields.hasContact) {
        body.contact = asset.contact || null;
    }

    return { input: body };
}

export async function save(asset) {
    const item_type = asset.item_type || asset.itemType || asset.itemtype;

    if (!item_type) throw new Error('item_type is required for save');

    const url = v1_endpoint + item_type;
    const headers = {
        "Session-Token": v1token,
        "Content-Type": "application/json"
    };

    try {
        const response = await apiCall(url, "POST", headers, buildBody(asset, item_type));
        const id = response?.id || response?.ID || response?.Id || null;
        return createAsset(item_type, asset.name, asset.contact, asset.otherserial, asset.state, asset.location, asset.model, asset.manufacturer, id);
    } catch (error) {
        console.error("Error saving asset:", error);
        throw error;
    }
}

export async function saveMultiple(assets) {
    try {
        const results = [];
        for (const a of assets) {
            results.push(await save(a));
        }
        return results;
    } catch (error) {
        console.error("Error saving multiple assets:", error);
        throw error;
    }
}


function getImage(asset_name , documents) {
    console.log(` [DEBUG] Searching for image - Asset Name: "${asset_name}" - Documents Available: ` , documents);   
    if (!documents || documents.length === 0) return null;
    return documents.find(doc => doc.name.trim().toLowerCase().includes(asset_name.trim().toLowerCase()));
}

async function getAllByType(type , documents) {
    try {
        const url = v2_endpoint + type;
        const headers = {
            "Authorization": `Bearer ${v2token}`
        };
        const response = await apiCall(url, "GET", headers);

        return response.map(r => {
            const img = getImage(r.name, documents);
            console.log(` [DEBUG] Asset: ${r.name} - Image found: ${img}`);
            return createAsset(
                type,
                r.name,
                r.contact || null,
                r.otherserial,
                r.status,
                r.location || null,
                r.model || null,
                r.manufacturer || null,
                r.id,
                img
            );
        });
    } catch (error) {
        console.error(`Error fetching all ${type}:`, error);
        throw error;
    }
}

export async function getAllAssets(documents) {
    const retour = {};
    for (const type of Object.keys(ASSET_FIELDS)) {
        const items = await getAllByType(type , documents);
        retour[type] = items;
    }
    return retour;
}