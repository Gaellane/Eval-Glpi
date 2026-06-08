import { apiCall, v1Headers, v2Headers } from "../../services/api/api";

const BASE_URL = import.meta.env.VITE_BACKEND_GLPI_URL;
const v2_endpoint = BASE_URL + '/v2.3/Assistance/Ticket';
const v1_endpoint = BASE_URL + '/v1/Ticket';



export const PRIORITY_MAPPING = {
    1: "Très basse",
    2: "Basse",
    3: "Moyenne",
    4: "Haute",
    5: "Très haute",
    6: "Majeure"
};

export const TYPE_MAPPING = {
    1: "Incident",
    2: "Demande"
};

export const STATUS_MAPPING = {
  1: "Nouveau",
  2: "En cours (Assigné)",
  3: "En cours (Planifié)",
  4: "En attente",
  5: "Résolu",
  6: "Clos",
  10: "Approbation"
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

        // create ticket (v1 expects input as an array)
        const body = {
            input: [
                {
                    name: ticket.name,
                    content: ticket.content,
                    status: ticket.status,
                    priority: ticket.priority,
                    date: ticket.date,
                    type: ticket.type
                }
            ]
        };

        const response = await apiCall(v1_endpoint, "POST", headers, body );
        const created = Array.isArray(response) ? response[0] : response;
        const id = created && (created.id || created.ID || created.Id) ? (created.id || created.ID || created.Id) : null;
        if (id && ticket.items?.length > 0) {
            const itemsBody = {
                input: ticket.items.map(item => ({
                    tickets_id: id,
                    itemtype: item.itemtype === "Socket" ? "Glpi\\Socket" : item.itemtype, 
                    items_id: item.items_id
                }))
            };

            const itemsBodyUniques = [ ... new Set(itemsBody.input) ];
            await apiCall(`${BASE_URL}/v1/Item_Ticket`, "POST", v1Headers('application/json'), { input: itemsBodyUniques } );
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
        const response = await apiCall(v2_endpoint, "GET", v2Headers());
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

export async function updateStatus(ticketId , status) {
    try {
        const response = await apiCall(`${v2_endpoint}/${ticketId}` , "PATCH" , v2Headers('application/json') , { "status" :  status });
        console.log(" [DEBUG] updateStatus - API response:", response);
        return createTicket(response.ref ?? `#${response.id}`, response.name, response.content, { id : status  , name : STATUS_MAPPING[status]}, response.priority, response.date, response.type, [], response.id);
    } catch (error) {
        console.error("Error updating ticket status:", error);
        throw error;
    }
}


