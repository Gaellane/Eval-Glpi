import { deleteTraductionsForAllValues } from "../../models/config/TicketStatus";
import { apiCall } from "../api/api";

const BASE_URL = import.meta.env.VITE_BACKEND_GLPI_URL;
const sessionToken = sessionStorage.getItem("user-token");
const APP_TOKEN = import.meta.env.VITE_BACKEND_GLPI_APP_TOKEN;
const sessionTokenV1 = sessionStorage.getItem("session-token-v1");

// Entités à purger, dans l'ordre de dépendances.
// Règle : supprimer les enfants (assets, liens) avant les parents (dropdowns).
//
// protocol:
//   "v1"  → DELETE /v1/{endpointV1}   (batch par ids)
//   "v2"  → DELETE /v2.3/{endpoint}/{id}  (un par un)
//
const GLPI_ENTITIES = [

    // ── Phase 1 : ITIL ───────────────────────────────────────────────
    { order: 1,  category: "itil",           itemtype: "Ticket",               protocol: "v1", endpointV1: "/Ticket" },
    { order: 2,  category: "administration", itemtype: "User",                 protocol: "v1", endpointV1: "/User",          note: "ids 2..6 protégés" },

    // ── Phase 2 : Assets ─────────────────────────────────────────────
    { order: 7,  category: "asset", itemtype: "Computer",           protocol: "v1", endpointV1: "/Computer" },
    { order: 8,  category: "asset", itemtype: "Monitor",            protocol: "v1", endpointV1: "/Monitor" },
    { order: 9,  category: "asset", itemtype: "NetworkEquipment",   protocol: "v1", endpointV1: "/NetworkEquipment" },
    { order: 10, category: "asset", itemtype: "Printer",            protocol: "v1", endpointV1: "/Printer" },
    { order: 11, category: "asset", itemtype: "Phone",              protocol: "v1", endpointV1: "/Phone" },
    { order: 12, category: "asset", itemtype: "Peripheral",         protocol: "v1", endpointV1: "/Peripheral" },
    { order: 13, category: "asset", itemtype: "Rack",               protocol: "v1", endpointV1: "/Rack" },
    { order: 14, category: "asset", itemtype: "Enclosure",          protocol: "v1", endpointV1: "/Enclosure" },
    { order: 15, category: "asset", itemtype: "PDU",                protocol: "v1", endpointV1: "/PDU" },
    { order: 16, category: "asset", itemtype: "PassiveDCEquipment", protocol: "v1", endpointV1: "/PassiveDCEquipment" },
    { order: 17, category: "asset", itemtype: "Unmanaged",          protocol: "v1", endpointV1: "/Unmanaged" },
    // Nouveaux types (câblage, logiciels, appliances, certificats)
    { order: 18, category: "asset", itemtype: "Cable",              protocol: "v1", endpointV1: "/Cable" },
    { order: 19, category: "asset", itemtype: "Socket",             protocol: "v2", endpointV1: "/Socket" , endpoint: "/Assets/Socket" },
    { order: 20, category: "asset", itemtype: "Appliance",          protocol: "v1", endpointV1: "/Appliance" },
    { order: 21, category: "asset", itemtype: "Software",           protocol: "v1", endpointV1: "/Software" },
    { order: 22, category: "asset", itemtype: "SoftwareLicense",    protocol: "v1", endpointV1: "/SoftwareLicense" },
    { order: 23, category: "asset", itemtype: "Certificate",        protocol: "v1", endpointV1: "/Certificate" },

    { order: 24, category: "asset", itemtype: "Item_Ticket",        protocol: "v1", endpointV1: "/Item_Ticket" },

    // ── Phase 2.6 : Documents (liens d'abord, puis fichiers) ─────────
    { order: 35, category: "document", itemtype: "Document_Item",  protocol: "v1", endpointV1: "/Document_Item", note: "Liens — supprimer avant Document" },
    { order: 36, category: "document", itemtype: "Document",       protocol: "v1", endpointV1: "/Document" },

    // ── Phase 3 : Modèles ────────────────────────────────────────────
    // Supprimer APRÈS tous les assets qui les référencent
    { order: 37, category: "dropdown_model", itemtype: "ComputerModel",         protocol: "v1", endpointV1: "/ComputerModel" },
    { order: 38, category: "dropdown_model", itemtype: "MonitorModel",          protocol: "v1", endpointV1: "/MonitorModel" },
    { order: 39, category: "dropdown_model", itemtype: "NetworkEquipmentModel", protocol: "v1", endpointV1: "/NetworkEquipmentModel" },
    { order: 40, category: "dropdown_model", itemtype: "PrinterModel",          protocol: "v1", endpointV1: "/PrinterModel" },
    { order: 41, category: "dropdown_model", itemtype: "PhoneModel",            protocol: "v1", endpointV1: "/PhoneModel" },
    { order: 42, category: "dropdown_model", itemtype: "PeripheralModel",       protocol: "v1", endpointV1: "/PeripheralModel" },
    { order: 43, category: "dropdown_model", itemtype: "RackModel",             protocol: "v1", endpointV1: "/RackModel" },
    { order: 44, category: "dropdown_model", itemtype: "EnclosureModel",        protocol: "v1", endpointV1: "/EnclosureModel" },
    { order: 45, category: "dropdown_model", itemtype: "PDUModel",              protocol: "v1", endpointV1: "/PDUModel" },
    // { order: 46, category: "dropdown_model", itemtype: "CableModel",            protocol: "v1", endpointV1: "/CableModel" },
    // { order: 47, category: "dropdown_model", itemtype: "SocketModel",           protocol: "v1", endpointV1: "/SocketModel" },
    // { order: 48, category: "dropdown_model", itemtype: "ApplianceModel",        protocol: "v1", endpointV1: "/ApplianceModel" },

    // ── Phase 4 : Dropdowns de référence ────────────────────────────
    // Supprimer EN DERNIER — référencés par presque tous les assets
    { order: 49, category: "dropdown", itemtype: "State",        protocol: "v1", endpointV1: "/State",        note: "État des actifs" },
    { order: 50, category: "dropdown", itemtype: "Manufacturer", protocol: "v1", endpointV1: "/Manufacturer", note: "Constructeurs" },
    { order: 51, category: "dropdown", itemtype: "Location",     protocol: "v1", endpointV1: "/Location",     note: "Lieux — arborescence récursive" },
];

// ── Helpers headers ──────────────────────────────────────────────────────────

function headersV1() {
    return {
        "Session-Token": sessionTokenV1,
        "Content-Type":  "application/json",
    };
}

function headersV2() {
    return {
        "Authorization": `Bearer ${sessionToken}`,
    };
}

// ── Logique de protection (User ids 2..6) ────────────────────────────────────

function isProtected(id, itemtype) {
    const n = Number(id);
    return itemtype === "User" && !Number.isNaN(n) && n >= 2 && n <= 6;
}

// ── Reset via API v1 (batch DELETE) ─────────────────────────────────────────

async function resetEntityV1(entity, onProgress) {
    const url = `${BASE_URL}/v1${entity.endpointV1}`;
    let deleted = 0;

    try {
        while (true) {
            const res = await apiCall(url, "GET", headersV1(), null, { only_id: true });
            const ids = res.map(i => i.id);
            const idsToDelete = ids.filter(id => !isProtected(id, entity.itemtype));

            if (idsToDelete.length === 0) {
                if (ids.length === 0) break;
                console.log(`[${entity.itemtype}] ids restants protégés :`, ids);
                break;
            }

            const payload = { input: idsToDelete.map(id => ({ id })) };
            console.log(`[DEBUG] DELETE ${url}`, payload);
            await apiCall(url, "DELETE", headersV1(), payload, { force_purge: true });

            deleted += idsToDelete.length;
            console.log(`[${entity.itemtype}] purgé ${deleted}...`);
        }

        const message = `${entity.itemtype} — ${deleted} items supprimés`;
        console.log(`[${entity.itemtype}] DONE — ${deleted} items supprimés`);
        onProgress?.({ itemtype: entity.itemtype, category: entity.category, deleted, message });

    } catch (error) {
        console.error(`[${entity.itemtype}] Erreur :`, error);
        onProgress?.({ itemtype: "ERROR", message: `${entity.itemtype}: ${error.message}` });
    }
}

// ── Reset via API v2 (DELETE un par un) ─────────────────────────────────────

async function resetEntityV2(entity, onProgress) {
    const listUrl = `${BASE_URL}/v2.3${entity.endpoint}`;
    let deleted = 0;

    try {
        while (true) {
            const res = await apiCall(listUrl, "GET", headersV2(), null, {});
            const ids = res.map(i => i.id);
            const idsToDelete = ids.filter(id => !isProtected(id, entity.itemtype));

            if (idsToDelete.length === 0) {
                if (ids.length === 0) break;
                console.log(`[${entity.itemtype}] ids restants protégés :`, ids);
                break;
            }

            for (const id of idsToDelete) {
                await apiCall(`${listUrl}/${id}`, "DELETE", headersV2(), null, { force: true });
            }

            deleted += idsToDelete.length;
            console.log(`[${entity.itemtype}] purgé ${deleted}...`);
        }

        const message = `${entity.itemtype} — ${deleted} items supprimés`;
        console.log(`[${entity.itemtype}] DONE — ${deleted} items supprimés`);
        onProgress?.({ itemtype: entity.itemtype, category: entity.category, deleted, message });

    } catch (error) {
        console.error(`[${entity.itemtype}] Erreur :`, error);
        onProgress?.({ itemtype: "ERROR", message: `${entity.itemtype}: ${error.message}` });
    }
}

// ── Dispatch selon protocol ──────────────────────────────────────────────────

function resetEntity(entity, onProgress) {
    if (entity.protocol === "v2") return resetEntityV2(entity, onProgress);
    return resetEntityV1(entity, onProgress);
}

// ── Point d'entrée public ────────────────────────────────────────────────────

async function resetAllEntities(onProgress = null) {
    try {
        for (const entity of GLPI_ENTITIES) {
            console.log(`\n=== Reset ${entity.itemtype} (${entity.category}) ===`);
            localStorage.removeItem("assets");
            localStorage.removeItem("documents");
            await resetEntity(entity, onProgress);
            await deleteTraductionsForAllValues();
        }
    } catch (error) {
        console.error("Erreur fatale lors du reset :", error);
        onProgress?.({ itemtype: "ERROR", message: `Fatal: ${error.message}` });
    }
}

export { resetAllEntities };