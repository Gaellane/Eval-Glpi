```js

import { apiCall, v1Headers } from "../../services/api/api";
const BASE_URL = import.meta.env.VITE_BACKEND_GLPI_URL;

/**
 * Création d'un nouveau problème
 * @param {string} name - Titre du problème
 * @param {string} content - Description
 */
export async function createProblem(name, content) {
    const body = {
        input: {
            name: name,
            content: content,
            status: 1 // 1 = Nouveau
        }
    };
    // Note: Utiliser v1 ou v2 selon votre installation. /Problem est standard.
    return await apiCall(`${BASE_URL}/v1/Problem`, "POST", v1Headers('application/json'), body);
}

/**
 * Lier un ticket à un problème existant
 * @param {number|string} ticketId 
 * @param {number|string} problemId 
 */
export async function linkTicketToProblem(ticketId, problemId) {
    const body = {
        input: {
            problems_id: problemId,
            tickets_id: ticketId
        }
    };
    return await apiCall(`${BASE_URL}/v1/Problem_Ticket`, "POST", v1Headers('application/json'), body);
}


/////////

import { createProblem, linkTicketToProblem } from "../../models/assistance/Problem";

// Dans votre composant TicketDetail...
const handleCreateAndLinkProblem = async () => {
    try {
        // 1. Créer le problème
        const newProblem = await createProblem(
            `Problème lié au ticket #${ticket.id}`, 
            `Création automatique via ticket ${ticket.name}`
        );
        
        const problemId = newProblem.id;

        // 2. Lier le ticket au problème nouvellement créé
        await linkTicketToProblem(ticket.id, problemId);
        
        alert(`Problème #${problemId} créé et lié avec succès !`);
    } catch (err) {
        console.error("Erreur lors de la liaison :", err);
        alert("Impossible de créer ou lier le problème.");
    }
};

```