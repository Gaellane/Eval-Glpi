```js
/**
 * Clone un asset ou un ticket n fois avec incrémentation du nom (ex: "PC (1)")
 * @param {Object} originalItem - L'objet source
 * @param {number} count - Nombre de copies
 */
export async function clone(originalItem, count = 1) {
    const results = [];
    
    // On retire l'ID pour forcer la création d'un nouvel objet
    const template = { ...originalItem };
    delete template.id;
    
    // Stockage du nom de base pour garder l'original propre
    const baseName = originalItem.name;

    for (let i = 1; i <= count; i++) {
        // Applique le format "Nom (n)"
        template.name = `${baseName} (${i})`;
        
        try {
            // Utilise votre fonction save existante qui gère tout le workflow
            const created = await save(template);
            results.push(created);
        } catch (error) {
            console.error(`Erreur lors de la création de la copie n°${i}:`, error);
            // On peut choisir d'arrêter ou de continuer selon le besoin
            throw error;
        }
    }
    
    return results;
}
```