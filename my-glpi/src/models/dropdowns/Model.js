import { apiCall, v1Headers, v2Headers } from "../../services/api/api";

const BASE_URL = import.meta.env.VITE_BACKEND_GLPI_URL;
const v2_endpoint = BASE_URL + '/v2.3/Dropdowns/';
const v1_endpoint = BASE_URL + '/v1/';

// Types dont GLPI 11 n'expose PAS de table *Model (pas de ComputerModelModel, etc.)
// Pour ces types, la notion de "model" n'existe pas côté API.
const TYPES_WITHOUT_MODEL = new Set([
    "PassiveDCEquipment",
    "Unmanaged",
    "Cable",
    "Socket",
    "Appliance",
    "Software",
    "SoftwareLicense",
    "Certificate",
]);

export function createModel(item_type, name, id = null) {
    const model = { item_type, name };
    if (id) model.id = id;
    return model;
}

// Extrait l'id retourné par GLPI, qu'il soit scalaire, objet ou tableau
function extractId(response) {
    if (!response) return null;
    if (Array.isArray(response)) return response[0]?.id ?? response[0]?.ID ?? response[0]?.Id ?? null;
    return response.id ?? response.ID ?? response.Id ?? null;
}

export async function save(model) {
    if (TYPES_WITHOUT_MODEL.has(model.item_type)) {
        console.warn(`[modelService] Le type "${model.item_type}" n'a pas de modèle — ignoré.`);
        return null;
    }

    const url = v1_endpoint + model.item_type + "Model";
    const headers = v1Headers('application/json');
    // GLPI attend exactement { input: [{ name }] } — pas les autres champs du modèle interne
    const body = { input: [{ name: model.name }] };

    try {
        const response = await apiCall(url, "POST", headers, body);
        const id = extractId(response);
        return createModel(model.item_type, model.name, id);
    } catch (error) {
        console.error("Error saving model:", error);
        throw error;
    }
}

export async function saveMultiple(models) {
    if (!models || models.length === 0) return [];

    const item_type = models[0].item_type;

    if (TYPES_WITHOUT_MODEL.has(item_type)) {
        console.warn(`[modelService] Le type "${item_type}" n'a pas de modèle — ignoré.`);
        return [];
    }

    const url = v1_endpoint + item_type + "Model";
    const headers = v1Headers('application/json');

    // On n'envoie que { name } pour chaque modèle — pas les champs internes (item_type, id…)
    const input = models.map(m => ({ name: m.name }));
    const body = { input };

    try {
        const response = await apiCall(url, "POST", headers, body);
        const created = Array.isArray(response) ? response : (response ? [response] : []);

        return created.map((r, idx) => {
            // GLPI peut renvoyer { id, message } ou { id, name } selon la version
            const name = r.name
                || input[idx]?.name
                // fallback si GLPI renvoie un message du style "Element 'X' already exists."
                || extractNameFromMessage(r.message)
                || null;

            const id = r.id ?? r.ID ?? r.Id ?? null;
            return createModel(item_type, name, id);
        });
    } catch (error) {
        console.error("Error saving multiple models:", error);
        throw error;
    }
}

// Extrait un nom depuis un message GLPI type "Element 'MyModel' already exists."
function extractNameFromMessage(message) {
    if (!message) return null;
    const match = message.match(/'([^']+)'/);
    return match ? match[1] : null;
}