import { apiCall, v1Headers, v2Headers } from "../../services/api/api";
import { getAllByTicket } from "./TicketCost";

const BASE_URL = import.meta.env.VITE_BACKEND_GLPI_URL;
const v2_endpoint = BASE_URL + '/v2.3/Assistance/Ticket';
const v1_endpoint = BASE_URL + '/v1/Ticket';



export const PRIORITY_MAPPING = {
    1: "Very low",
    2: "Low",
    3: "Medium",
    4: "High",
    5: "Very high",
    6: "Major"
};

export const TYPE_MAPPING = {
    1: "Incident",
    2: "Request"
};

export const STATUS_MAPPING = {
  1: "New",
  2: "In progress",
 // 3: "In progress (planned)",
  6: "Closed"
};


export function createTicket(ref, name, content, status, priority, date, type, items = [], id = null) {
    const ticket = {
        ref: ref,
        name: name,
        content: content,
        status: status,
        priority: priority,
        date: date,
        type: type,
        items: items
    };
    if (id !== null && id !== undefined) ticket.id = id;
    return ticket;
}

export async function save(ticket) {
    try {
        const headers = v1Headers('application/json');

        const status = ticket.status;

        const body = {
            input: [
                {
                    name: ticket.name,
                    content: ticket.content,
                    status: 1,
                    priority: ticket.priority,
                    date: ticket.date,
                    type: ticket.type,
                    externalid : ticket.ref
                }
            ]
        };


        const response = await apiCall(v1_endpoint, "POST", headers, body );
        const created = Array.isArray(response) ? response[0] : response;
        const id = created && (created.id || created.ID || created.Id) ? (created.id || created.ID || created.Id) : null;

        if (id && ticket.items?.length > 0) {
            const itemsBody = {
                input: ticket.items.map(item => ({
                    tickets_id : id,
                    itemtype: item.itemtype === "Socket" ? "Glpi\\Socket" : item.itemtype, 
                    items_id: item.items_id
                }))
            };
            if(itemsBody && itemsBody.input && itemsBody.input.length > 0) {
                const itemsBodyUniques = [ ... new Set(itemsBody.input) ];
                console.log("Saving items for ticket ID", ticket.ref , id, "with body:", itemsBodyUniques);
                await apiCall(`${BASE_URL}/v1/Item_Ticket`, "POST", v1Headers('application/json'), { input: itemsBodyUniques } , {} , true );
            }
        }

        if(status!=1) {
            await updateStatus(id, status, ticket.content);
        }

        return createTicket(ticket.ref, created?.name || ticket.name, created?.content || ticket.content, created?.status || ticket.status, created?.priority || ticket.priority, created?.date || ticket.date, created?.type || ticket.type, created?.items || ticket.items, id);
    } catch (error) {
        console.error("Error saving ticket:", error);
        throw error;
    }
}

export async function saveMultiple(tickets) {
    try {
        const results = [];
        for (const t of tickets) {
            const toSave = t && typeof t === 'object' ? t : { name: t };
            results.push(await save(toSave));
        }
        return results;
    } catch (error) {
        console.error("Error saving multiple tickets:", error);
        throw error;
    }
}


export async function getItemsByTicket(ticketId) {
    try {
        const response = await apiCall(`${BASE_URL}/v1/Ticket/${ticketId}/Item_Ticket`, "GET", v1Headers());
        return response.map(item => ({
            itemtype: item.itemtype,
            items_id: item.items_id,
            tickets_id: item.tickets_id
        })).filter(item => item.tickets_id === ticketId
        )
    } catch(error) {
        throw error;
    }
}


export async function getAll() {
    try {
        const response = await apiCall(v2_endpoint, "GET", v2Headers() ,{} ,  {limit : 1000} );
        return response.map(t => createTicket(t.ref, t.name, t.content, t.status, t.priority, t.date, t.type, [], t.id));
    } catch (error) {
        console.error("Error fetching tickets:", error);
        throw error;
    }
}

export async function getTicketById(ticketId) {
    try {
        const response = await apiCall(`${v2_endpoint}/${ticketId}` ,"GET", v2Headers());
        return createTicket(response.ref ?? `#${response.id}`, response.name, response.content, response.status, response.priority, response.date, response.type, [], response.id);
    } catch (error) {
        console.error("Error fetching tickets:", error);
        throw error;
    }
}

export async function updateStatus(ticketId , status , content = null) {
    try {
        const input = { status: status };
        if (content !== null) {
            const itil_followup = {
                itemtype: "Ticket",
                items_id: ticketId,
                content,
                is_private: 0
            };
            await apiCall(`${BASE_URL}/v1/ITILFollowup`, "POST", v1Headers('application/json'), { input: itil_followup } );
        }        
        const response = await apiCall(`${v1_endpoint}/${ticketId}` , "PATCH" , v1Headers('application/json') , { input : input } );
        return createTicket(response.ref ?? `#${response.id}`, response.name, response.content, { id : status  , name : STATUS_MAPPING[status]}, response.priority, response.date, response.type, [], response.id);
    } catch (error) {
        console.error("Error updating ticket status:", error);
        throw error;
    }
}




export async function getAllByStatus() {
    try {
        const allTickets = await getAll();
        const grouped = {};
        allTickets.forEach(ticket => {
            const status = ticket.status;
            if (!grouped[status]) {
                grouped[status] = [];
            }
            grouped[status].push(ticket);
        });
        return grouped;

    } catch (error) {
        console.error("Error fetching tickets by status:", error);
        throw error;
    }
}

export async function getTotalCosts(tickets) {
    try {
        let totalDuration = 0;
        let totalCostTime = 0;
        let totalCostFixed = 0;
        let totalCostTimeWC = 0;
        for (const ticket of tickets) {
            const items = await getAllByTicket(ticket.id);
            items.forEach(item => {
                totalDuration += item.duration || 0;
                totalCostTime += item.cost_time || 0;
                totalCostFixed += item.cost_fixed || 0;
                totalCostTimeWC += item.cost_time_wc || 0;
            });
        }
        return { totalDuration, totalCostTime, totalCostFixed  , totalCostTimeWC};
    } catch (error) {
        console.error("Error calculating total costs:", error);
        throw error;
    }
}