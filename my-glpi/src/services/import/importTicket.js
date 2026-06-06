import { saveMultiple } from "../../models/assistance/Ticket";
import { formatDateForGlpi } from "../utils/dateUtils";

// ─── Mappings ────────────────────────────────────────────────────────────────

const STATUS_MAP = {
    "nouveau": 1,
    "new": 1,
    "en cours (assigné)": 2,
    "en cours (assigne)": 2,
    "assigned": 2,
    "en cours (planifié)": 3,
    "en cours (planifie)": 3,
    "planned": 3,
    "en attente": 4,
    "pending": 4,
    "résolu": 5,
    "resolu": 5,
    "resolved": 5,
    "clos": 6,
    "closed": 6
};

const PRIORITY_MAP = {
    "très basse": 1,
    "tres basse": 1,
    "very low": 1,
    "basse": 2,
    "low": 2,
    "moyenne": 3,
    "medium": 3,
    "normal": 3,
    "haute": 4,
    "high": 4,
    "très haute": 5,
    "tres haute": 5,
    "very high": 5,
    "majeure": 6,
    "major": 6
};

const TYPE_MAP = {
    "incident": 1,
    "demande": 2,
    "request": 2
};

// ─── Resolvers ────────────────────────────────────────────────────────────────

function resolveStatus(value) {
    if (!value) return 1;
    if (typeof value === 'number') return value;
    return STATUS_MAP[value.trim().toLowerCase()] ?? 1;
}

function resolvePriority(value) {
    if (!value) return 3;
    if (typeof value === 'number') return value;
    return PRIORITY_MAP[value.trim().toLowerCase()] ?? 3;
}

function resolveType(value) {
    if (!value) return 1;
    if (typeof value === 'number') return value;
    return TYPE_MAP[value.trim().toLowerCase()] ?? 1;
}

// ─── Import ───────────────────────────────────────────────────────────────────

export async function createTicket(file, assets = []) {
    try {
        // flatten assets: may be an object { Computer: [...], Monitor: [...] } or array of arrays
        const flatAssets = (function flatten(as) {
            if (!as) return [];
            if (Array.isArray(as)) {
                const out = [];
                for (const a of as) {
                    if (Array.isArray(a)) out.push(...a);
                    else if (a && typeof a === 'object') out.push(a);
                }
                return out;
            }
            if (typeof as === 'object') {
                return Object.values(as).reduce((acc, v) => acc.concat(Array.isArray(v) ? v : []), []);
            }
            return [];
        })(assets);

        const tickets = getTickets(file, flatAssets);
        return await saveMultiple(tickets);
    } catch (error) {
        console.error("Error importing tickets:", error);
        throw error;
    }
}

function getTickets(file, assets = []) {
    const norm = v => (v && typeof v === 'string') ? v.trim().toLowerCase() : null;

    return file
        .map(row => {
            const ref = row.ref_ticket;
            const name = row.titre;
            const content = row.content || row.description;
            const status = resolveStatus(row.status);
            const priority = resolvePriority(row.priority);
            const type = resolveType(row.type);
            const date = formatDateForGlpi(row.date, row.heure);

            // Résoudre les assets liés par nom
            const itemNames = new Set();
            const real_items = row.items ? String(row.items).replace(/[\[\]"\/]/g, '') : '';
            if (row.items) {
                real_items.split(",").forEach(i => {
                    const trimmed = i.trim();
                    if (trimmed) itemNames.add(trimmed);
                });
            }

            const resolvedItems = [...itemNames]
                .map(itemName => {
                    const match = assets.find(a => norm(a.name) === norm(itemName));
                    //console.log("[DEBUG] Resolving item for ticket - Item Name:", itemName, "Match Found:", match);
                    return match
                        ? { itemtype: match.item_type, items_id: match.id }
                        : null;
                })
                .filter(Boolean);

            //console.log("[DEBUG] Ticket row - Ref:", ref, "Name:", name, "Status:", status, "Priority:", priority, "Type:", type, "Date:", date, "Items:", resolvedItems);

            return {
                ref,
                name,
                content,
                status,
                priority,
                type,
                date,
                items: resolvedItems
            };
        })
        .filter(t => t.name && t.content);
}