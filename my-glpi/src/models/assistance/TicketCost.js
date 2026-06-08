import { apiCall, v1Headers, v2Headers } from "../../services/api/api";

const BASE_URL = import.meta.env.VITE_BACKEND_GLPI_URL;
const v1_endpoint = BASE_URL + '/v1/TicketCost';
const v2_endpoint = BASE_URL+ '/v2.3/Assistance/Ticket';

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
    const body = cost;
    try {
        const response = await apiCall(v2_endpoint+"/"+cost.tickets_id+"/Cost", "POST", v2Headers('application/json'), body , {} , true);
        const id = response?.id || null;
        return createTicketCost(cost.tickets_id, cost.duration, cost.cost_time, cost.cost_fixed, id);
    } catch (error) {
        console.error("Error saving ticket cost:", error);
        throw error;
    }
}

export async function saveMultiple(costs) {
    try {
        const retour = [];
        for(const c of costs) {
            const saved = await save(c);
            retour.push(saved);
        }
        return retour;
    } catch (error) {
        console.error("Error saving multiple ticket costs:", error);
        throw error;
    }
}

export async function getAllByTicket(ticketId) {
    try {
        const url = v2_endpoint+"/"+ticketId+"/Cost";
        const response = await apiCall(url , "GET" , v2Headers());
        return response.map(r =>
            createTicketCost(
                ticketId,
                r.duration,
                r.cost_time,
                r.cost_fixed,
                r.id
            )
        )
    } catch(error) {
        throw error;
    }
}