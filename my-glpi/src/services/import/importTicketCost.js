import { saveMultiple } from "../../models/assistance/TicketCost";
import { formatNumber } from "../utils/formatageUtils";

export async function createTicketCost(file, tickets = []) {
    try {
        const costs = getTicketCosts(file, tickets);
        return await saveMultiple(costs);
    } catch (error) {
        console.error("Error importing ticket costs:", error);
        throw error;
    }
}

function getTicketCosts(file, tickets = []) {
    const norm = v => (v && typeof v === 'string') ? v.trim().toLowerCase() : null;

    return file
        .map(row => {
            const num_ticket = row.num_ticket 
            const duration = formatNumber(row.duration_second) 
            const cost_time = formatNumber(row.time_cost) || 0;
            const cost_fixed = formatNumber(row.fixed_cost) || 0;

            // Résoudre le ticket par ref ou id
            const ticketMatch = tickets.find(t =>
                norm(String(t.ref)) === norm(String(num_ticket))
            );

            if (!ticketMatch) {
                console.warn("[DEBUG] Ticket non trouvé pour Num_Ticket:", num_ticket);
                return null;
            }

            console.log("[DEBUG] Cost - Num_Ticket:", num_ticket, "Ticket ID:", ticketMatch.id, "Duration:", duration, "Time Cost:", cost_time, "Fixed Cost:", cost_fixed);

            return {
                tickets_id: ticketMatch.id,
                duration,
                cost_time,
                cost_fixed
            };
        })
        .filter(Boolean);
}