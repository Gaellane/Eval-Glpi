import { apiCall, v1Headers, v2Headers } from "../../services/api/api";

const BASE_URL = import.meta.env.VITE_BACKEND_GLPI_URL;
const v1_endpoint = BASE_URL + '/v1/TicketCost';
const v2_endpoint = BASE_URL+ '/v2.3/Assistance/Ticket';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// ─── Entity ───────────────────────────────────────────────────────────────────

function createTicketCost(tickets_id, duration, cost_time, cost_fixed, id = null , cost_time_wc = 0) {
    const cost = {
        tickets_id : tickets_id,
        duration : duration,
        cost_time : cost_time,
        cost_fixed : cost_fixed,
    };
    if (id) cost.id = id;
    if(cost_time_wc!=0) cost.cost_time_wc = cost_time_wc;
    return cost;
}

// ─── Save ─────────────────────────────────────────────────────────────────────

export async function save(cost) {
    const body = cost;
    try {
        const response = await apiCall(v2_endpoint+"/"+cost.tickets_id+"/Cost", "POST", v2Headers('application/json'), body );
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
                Number(r.cost_time*r.duration)/3600,
                r.cost_fixed,
                r.id,
                r.cost_time
            )
        )
    } catch(error) {
        throw error;
    }
}

export async function saveSuperCost(ticketId , cost=null ,ouverture =null){
    try {
        let obj = {ticketId : ticketId};
        if(cost && ouverture ==0) obj.superCost= cost;
        if(ouverture &&cost==0) obj.ouverture= ouverture;
        const response =await apiCall(BACKEND_URL+"/api/ticketcosts" , "POST" , {"Content-Type": "application/json"} , obj)
    } catch (error) {
        throw error;
    }
}

export async function deleteSuperCost(ticketId){
    try {
        const response =await apiCall(BACKEND_URL+"/api/ticketcosts/"+ticketId , "DELETE" )
    } catch (error) {
        throw error;
    }
}

