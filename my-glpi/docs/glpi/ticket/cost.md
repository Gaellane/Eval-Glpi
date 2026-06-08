D’après les sources et nos analyses précédentes, les **règles métiers** relatives aux coûts des tickets (**Ticket Cost**) dans GLPI s'articulent autour des principes suivants :

### 1. Multiplicité des entrées de coûts
Il est possible d'associer **plusieurs lignes de coûts à un même ticket**. Cette règle permet de ventiler précisément les dépenses, par exemple en séparant le coût d'achat d'un matériel (coût fixe) du coût de la main-d'œuvre (coût lié au temps).

### 2. Typologie des coûts
Les coûts sont catégorisés en trois modes de calcul selon les colonnes de votre fichier CSV :
*   **Le Coût Fixe Pur (`Fixed_Cost`)** : S'applique sans notion de temps passé (la durée est alors de 0). Il correspond généralement à l'achat d'un composant, d'une licence ou d'un forfait d'intervention standard.
*   **Le Coût lié au Temps (`Time_Cost` & `Duration_second`)** : Calculé sur la base d'une intervention humaine chronométrée en secondes. 
*   **Le Coût Mixte** : Une même ligne de coût peut cumuler un montant lié au temps passé et un montant fixe additionnel.

### 3. Logique de calcul du taux horaire
Le coût lié au temps est proportionnel à la durée d'intervention. Par exemple, si une intervention de **600 secondes** (10 minutes) génère un coût de **8,7**, le système ou le script de calcul applique un taux horaire défini (environ 52,2 pour une heure complète de 3600 secondes).

### 4. Dépendance et Liaison
*   **Ordre d'importation** : Un coût ne peut pas exister seul. Il doit obligatoirement être rattaché à un **ticket déjà existant** dans la base de données. 
*   **Identifiant technique** : La liaison s'effectue via l'ID interne généré par GLPI lors de la création du ticket (correspondant à votre colonne `Num_Ticket`).
*   **Endpoint API V2** : L'ajout financier se fait sur l'endpoint spécifique : `POST /Assistance/Ticket/{id}/Cost`.

### 5. Attributs financiers étendus
Bien que votre CSV se concentre sur les montants, la structure technique de GLPI permet d'affiner ces règles métier en précisant :
*   Le **nom** et le **commentaire** de la dépense.
*   Les dates de début et de fin de l'intervention.
*   Le **budget** sur lequel la dépense est imputée.
*   L'**entité** administrative responsable du coût.