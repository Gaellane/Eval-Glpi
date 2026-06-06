import { apiCall } from "../../services/api/api";

const BASE_URL = import.meta.env.VITE_BACKEND_GLPI_URL;
const v2_endpoint = BASE_URL + '/v2.3/Assistance/Ticket';
const v1_endpoint = BASE_URL + '/v1/Ticket';
const v1token = sessionStorage.getItem("session-token-v1");
const v2token = sessionStorage.getItem("user-token");

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
        const headers = {
            "Session-Token": v1token,
            "Content-Type": "application/json"
        };

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

        const response = await apiCall(v1_endpoint, "POST", headers, body);
        const created = Array.isArray(response) ? response[0] : response;
        const id = created && (created.id || created.ID || created.Id) ? (created.id || created.ID || created.Id) : null;

        if (id && ticket.items?.length > 0) {
            const itemsBody = {
                input: ticket.items.map(item => ({
                    tickets_id: id,
                    itemtype: item.itemtype,
                    items_id: item.items_id
                }))
            };

            await apiCall(`${BASE_URL}/v1/Item_Ticket`, "POST", headers, itemsBody);
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
