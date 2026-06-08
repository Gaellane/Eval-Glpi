import { apiCall, v1Headers, v2Headers } from "../../services/api/api";

const BASE_URL = import.meta.env.VITE_BACKEND_GLPI_URL;
const v1_endpoint = BASE_URL + '/v1/';
const v2_endpoint = BASE_URL + '/v2.3/Assets/';

// Sources: schéma SQL GLPI 11 (glpi-empty.sql) + classes PHP src/
// Colonnes vérifiées pour chaque table :
//   model          → champ *models_id dans la table (null = pas de table *Model)
//   hasContact     → présence du champ `contact` dans la table
//   hasManufacturer→ présence du champ `manufacturers_id` dans la table
//   hasState       → présence du champ `states_id` dans la table
const ASSET_FIELDS = {
    // ── Assets physiques standard ────────────────────────────────────────────
    Computer:           { model: "computermodels_id",           hasContact: true,  hasManufacturer: true,  hasState: true  },
    Monitor:            { model: "monitormodels_id",            hasContact: true,  hasManufacturer: true,  hasState: true  },
    NetworkEquipment:   { model: "networkequipmentmodels_id",   hasContact: true,  hasManufacturer: true,  hasState: true  },
    Printer:            { model: "printermodels_id",            hasContact: true,  hasManufacturer: true,  hasState: true  },
    Phone:              { model: "phonemodels_id",              hasContact: true,  hasManufacturer: true,  hasState: true  },
    Peripheral:         { model: "peripheralmodels_id",         hasContact: true,  hasManufacturer: true,  hasState: true  },
    // ── Datacenter ───────────────────────────────────────────────────────────
    Rack:               { model: "rackmodels_id",               hasContact: false, hasManufacturer: true,  hasState: true  },
    Enclosure:          { model: "enclosuremodels_id",          hasContact: false, hasManufacturer: true,  hasState: true  },
    PDU:                { model: "pdumodels_id",                hasContact: false, hasManufacturer: true,  hasState: true  },
    PassiveDCEquipment: { model: null,                          hasContact: false, hasManufacturer: true,  hasState: true  },
    // ── Câblage (glpi_cables / glpi_sockets) : pas de manufacturer ni state ─
    Cable:              { model: "cablemodels_id",              hasContact: false, hasManufacturer: false, hasState: false },
    Socket:             { model: "socketmodels_id",             hasContact: false, hasManufacturer: false, hasState: false },
    // ── Logiciels / Licences ─────────────────────────────────────────────────
    // glpi_softwares : pas de model, pas de manufacturer, pas de state, pas de contact
    Software:           { model: null,                          hasContact: false, hasManufacturer: false, hasState: false },
    // glpi_softwarelicenses : sous-entité de Software, a contact mais pas manufacturer/state/model propre
    SoftwareLicense:    { model: null,                          hasContact: true,  hasManufacturer: false, hasState: false },
    // ── Applicatifs (glpi_appliances) ────────────────────────────────────────
    Appliance:          { model: "appliancemodels_id",          hasContact: true,  hasManufacturer: true,  hasState: true  },
    // ── Certificats (glpi_certificates) : pas de model, manufacturer ni state
    Certificate:        { model: null,                          hasContact: false, hasManufacturer: false, hasState: false },
    // ── Unmanaged ────────────────────────────────────────────────────────────
    Unmanaged:          { model: null,                          hasContact: false, hasManufacturer: true,  hasState: false },
};

export function createAsset(item_type, name, contact, otherserial, state, location, model, manufacturer, id = null , image = null , user = null) {
    const asset = { item_type, name, contact, otherserial, is_recursive: true, state, location, model, manufacturer };
    if (id) asset.id = id;
    if (image) asset.image = image;
    if (user) asset.user = user;
    return asset;
}

function buildBody(asset, item_type) {
    const fields = ASSET_FIELDS[item_type] || {};

    const body = {
        name:         asset.name,
        is_recursive: true,
        otherserial:  asset.otherserial || null,
    };

    if (fields.hasState) {
        body.status = asset.state?.id || asset.state || null;
    }

    if (fields.hasManufacturer) {
        body.manufacturer = {id : asset.manufacturer?.id || asset.manufacturer || null};
    }

    // locations_id est présent sur tous les types qui ont un formulaire de localisation
    body.locations = {id : asset.location?.id || asset.location || null};

    if (fields.model) {
        body.model= {id : asset.model?.id || asset.model || null}; 
    }

    if (fields.hasContact) {
        body.contact = asset.contact || null;
    }

    body.user = { id : asset.user?.id || asset.user || null };

    return body;
}

export async function save(asset) {
    const item_type = asset.item_type || asset.itemType || asset.itemtype;

    if (!item_type) throw new Error('item_type is required for save');

    const url = v2_endpoint +item_type;

    try {
        const response = await apiCall(url, "POST", v2Headers('application/json'), buildBody(asset, item_type) );
        const id = response?.id || response?.ID || response?.Id || null;
        return createAsset(item_type, asset.name, asset.contact, asset.otherserial, asset.state, asset.location, asset.model, asset.manufacturer, id , null , asset.user);
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
    if (!documents || documents.length === 0) return null;
    return documents.find(doc => doc.name.trim().toLowerCase().includes(asset_name.trim().toLowerCase()));
}

async function getAllByType(type , documents) {
    try {
        const url = v2_endpoint + type;
        const response = await apiCall(url, "GET", v2Headers());

        return response.map(r => {
            const img = getImage(r.name, documents);
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
                img,
                r.user || null

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