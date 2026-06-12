```js
/**
 * Ajoute un ou plusieurs items à un ticket existant
 * @param {number|string} ticketId - ID du ticket
 * @param {Array} items - Tableau d'objets { itemtype: string, items_id: number }
 */
export async function addItemsToTicket(ticketId, items) {
    if (!items || items.length === 0) return;

    // Préparation du format attendu par l'API GLPI v1
    const body = {
        input: items.map(item => ({
            tickets_id: ticketId,
            // Gestion de votre cas spécifique pour Socket (GLPI namespace)
            itemtype: item.itemtype === "Socket" ? "Glpi\\Socket" : item.itemtype,
            items_id: item.items_id
        }))
    };

    try {
        // Utilisation de votre endpoint v1/Item_Ticket
        // Note: l'API v1 accepte généralement un tableau dans 'input' pour les créations multiples
        const response = await apiCall(
            `${BASE_URL}/v1/Item_Ticket`, 
            "POST", 
            v1Headers('application/json'), 
            body
        );
        
        console.log("Items ajoutés avec succès:", response);
        return response;
    } catch (error) {
        console.error("Erreur lors de l'ajout des items au ticket:", error);
        throw error;
    }
}

/**
 * Supprime une ou plusieurs relations Item <-> Ticket
 * @param {Array<number>} itemTicketIds - Tableau des IDs des relations à supprimer
 */
export async function removeItemsFromTicket(itemTicketIds) {
    if (!itemTicketIds || itemTicketIds.length === 0) return;

    try {
        // Suppression parallèle des relations
        const deletePromises = itemTicketIds.map(id => 
            apiCall(
                `${BASE_URL}/v1/Item_Ticket/${id}`, 
                "DELETE", 
                v1Headers()
            )
        );

        return await Promise.all(deletePromises);
    } catch (error) {
        console.error("Erreur lors de la suppression des items du ticket:", error);
        throw error;
    }
}
```