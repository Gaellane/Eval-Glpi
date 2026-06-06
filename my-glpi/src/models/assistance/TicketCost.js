import { apiCall } from "../../services/api/api";

const BASE_URL = import.meta.env.VITE_BACKEND_GLPI_URL;
const v1_endpoint = BASE_URL + '/v1/TicketCost';
const v1token = sessionStorage.getItem("session-token-v1");

const headers = {
    "Session-Token": v1token,
    "Content-Type": "application/json"
};

// ─── Entity ───────────────────────────────────────────────────────────────────

function createTicketCost(tickets_id, duration, cost_time, cost_fixed, id = null) {
    const cost = {
        tickets_id : tickets_id,
        duration : duration,
        cost_time : cost_time,
        cost_fixed : cost_fixed
    };
    if (id) cost.id = id;
    return cost;
}

// ─── Save ─────────────────────────────────────────────────────────────────────

export async function save(cost) {
    const body = { input: cost };
    try {
        const response = await apiCall(v1_endpoint, "POST", headers, body);
        const id = response?.id || null;
        return createTicketCost(cost.tickets_id, cost.duration, cost.cost_time, cost.cost_fixed, id);
    } catch (error) {
        console.error("Error saving ticket cost:", error);
        throw error;
    }
}

export async function saveMultiple(costs) {
    try {
        const body = { input: costs };
        console.log(" [DEBUG] Saving multiple ticket costs - Payload:", body);
        const response = await apiCall(v1_endpoint, "POST", headers, body);
        const saved = Array.isArray(response) ? response : [response];
        return saved.map((r, i) =>
            createTicketCost(
                costs[i].tickets_id,
                costs[i].duration,
                costs[i].cost_time,
                costs[i].cost_fixed,
                r?.id || null
            )
        );
    } catch (error) {
        console.error("Error saving multiple ticket costs:", error);
        throw error;
    }
}