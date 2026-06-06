# Dictionnaire de Données des Entités GLPI 11 — Cartographie des Liaisons

Ce document sert de cartographie technique pour comprendre les dépendances et liaisons de clés entre les objets (entités) de l'API GraphQL/REST de GLPI 11.

---

## 🛠️ MODULE 1 : ASSISTANCE (ITIL)

### 1. Entité : Ticket (`Ticket`)
*Objet central matérialisant un incident technique ou une demande de service.*

* **Attributs Purs (Scalaires) :**
  * `id` : Identifiant unique du ticket.
  * `name` : Titre explicite du ticket.
  * `content` : Description longue textuelle (HTML).
  * `status` : Code statut (1: Nouveau, 2: En cours, 3: Planifié, 4: En attente, 5: Résolu, 6: Clos).
  * `type` : Nature (1: Incident, 2: Demande).
  * `urgency` / `impact` / `priority` : Matrice de criticité (Valeurs de 1 à 5).
  * `date` / `solvedate` / `closedate` : Repères temporels du cycle de vie.
* **Relations (Où va cette entité ?) :**
  * `entities` ➔ Pointeur vers **Entity** (Isolation du département).
  * `locations` ➔ Pointeur vers **Location** (Où l'incident a lieu).
  * `itilcategories` ➔ Pointeur vers **ItilCategory** (Arbre des catégories d'assistance).
  * `users` ➔ Table de liaison polymorphe vers **User** (Permet de lier les demandeurs, observateurs et techniciens).
  * `groups` ➔ Table de liaison vers **Group** (Groupes techniques affectés ou groupes demandeurs).
  * `problems` ➔ Pointeur/Liaison vers **Problem** (Si le ticket découle d'un problème global).
  * `items_tickets` ➔ Table d'interconnexion polymorphe vers **n'importe quel élément du Parc** (Ordinateur, Switch, Périphérique, etc.).

### 2. Entité : Problème (`Problem`)
*Analyse de fond visant à identifier la cause racine de plusieurs incidents répétitifs.*

* **Attributs Purs (Scalaires) :**
  * `id`, `name`, `content`, `status`, `urgency`, `impact`, `priority`, `date`, `solvedate`, `closedate`.
* **Relations (Où va cette entité ?) :**
  * `entities` ➔ Pointeur vers **Entity**.
  * `itilcategories` ➔ Pointeur vers **ItilCategory**.
  * `tickets` ➔ Liste inverse pointant vers les **Ticket** rattachés.
  * `changes` ➔ Liste pointant vers les **Change** planifiés pour corriger le problème.
  * `users` / `groups` ➔ Pointeurs vers les experts/cellules de crise (**User** / **Group**).

### 3. Entité : Changement (`Change`)
*Planification de modifications majeures ou risquées sur l'infrastructure (ex: migration de serveurs).*

* **Attributs Purs (Scalaires) :**
  * `id`, `name`, `content`, `status`, `validity` (état d'approbation), `date`.
* **Relations (Où va cette entité ?) :**
  * `entities` / `locations` ➔ Pointeurs vers **Entity** et **Location**.
  * `problems` ➔ Liaison inverse vers les **Problem** ayant déclenché ce besoin de changement.
  * `tickets` ➔ Liaison directe vers les **Ticket** impactés par la maintenance.

### 4. Entité : Tâche (`TicketTask` / `ProblemTask`)
*Sous-action ou action atomique de résolution planifiée ou effectuée par un technicien.*

* **Attributs Purs (Scalaires) :**
  * `id` : ID de la tâche.
  * `content` : Texte résumant l'action technique menée.
  * `actiontime` : Temps passé (en secondes) pour accomplir la tâche.
  * `state` : État d'avancement (1: À faire, 2: Fait).
* **Relations (Où va cette entité ?) :**
  * `tickets` (ou `problems`) ➔ Pointeur parent obligatoire vers le **Ticket** ou **Problem** auquel elle est rattachée.
  * `users` ➔ Pointeur vers le **User** (Le technicien ayant réalisé l'action).
  * `taskcategories` ➔ Pointeur vers la catégorie de tâche (ex: Déplacement, Remplacement matériel).

---

## 🖥️ MODULE 2 : PARC (ASSETS)

### 1. Entité : Ordinateur (`Computer`)
*Représentation physique ou virtuelle de serveurs ou de postes de travail.*

* **Attributs Purs (Scalaires) :**
  * `id`, `name`, `serial` (Service Tag constructeur), `otherserial` (code barre d'immobilisation interne), `uuid`, `comment`.
* **Relations (Où va cette entité ?) :**
  * `entities` / `locations` ➔ Pointeurs structurels vers **Entity** et **Location**.
  * `states` ➔ Pointeur vers **State** (État actuel : En stock, En production, Réformé).
  * `users` / `groups` ➔ Pointeurs vers le **User** (propriétaire/utilisateur principal) et le **Group** responsable de la machine.
  * `manufacturers` ➔ Pointeur vers **Manufacturer** (ex: Dell, Lenovo).
  * `computermodels` / `computertypes` ➔ Tables de types (ex: Latitude 5440 / Portable).
  * `items_device*` ➔ Liaisons d'instances vers le module **Inventaire** (Processeurs, RAM, Disques durs installés).
  * `items_operatingsystems` ➔ Liaison vers le système d'exploitation (**OperatingSystem**).

### 2. Entité : Matériel Réseau (`NetworkEquipment`)
*Switches, routeurs, bornes Wi-Fi, pare-feux.*

* **Attributs Purs (Scalaires) :**
  * `id`, `name`, `serial`, `otherserial`, `ram` (mémoire cache embarquée), `comment`.
* **Relations (Où va cette entité ?) :**
  * `locations` / `states` / `manufacturers` ➔ Idem Computer.
  * `networkequipmentmodels` / `networkequipmenttypes` ➔ Configuration typologique du réseau.
  * `networkports` ➔ Liste de sous-composants vers **NetworkPort** (Modélise chaque prise RJ45/SFP avec son adresse MAC et son VLAN).

### 3. Entité : Imprimante (`Printer`) & Écran (`Monitor`)
*Périphériques d'affichage et d'impression d'infrastructure ou de bureau.*

* **Attributs Purs (Scalaires) :**
  * `id`, `name`, `serial`, `size` (pour les écrans), `have_ethernet` (pour les imprimantes).
* **Relations (Où va cette entité ?) :**
  * `locations` / `entities` / `states` ➔ Traçabilité d'emplacement et d'état.
  * `computers` (via liaisons polymorphes) ➔ Permet de lier l'Écran ou l'Imprimante locale directement à l'**Ordinateur** hôte auquel il est rattaché.

### 4. Entité : Baie / Rack (`Rack`)
*Conteneur physique présent dans les centres de données.*

* **Attributs Purs (Scalaires) :**
  * `id`, `name`, `number_units` (Hauteur de la baie en U, ex: 42).
* **Relations (Où va cette entité ?) :**
  * `locations` ➔ Pointeur vers **Location** (généralement restreint à une salle serveur).
  * `dcrooms` ➔ Pointeur vers la Salle Machine (Datacenter Room).
  * `items` ➔ Liste imbriquée contenant tous les **Computer** (serveurs rackables), **NetworkEquipment** ou **PDU** insérés à l'intérieur de la baie, indexés par leur position d'U de départ.

### 5. Entité : Châssis / Enclosure (`Enclosure`)
*Châssis de serveurs lames (Blade) inséré dans un Rack et accueillant des sous-serveurs.*

* **Attributs Purs (Scalaires) :**
  * `id`, `name`, `number_models` (Nombre d'emplacements/slots disponibles).
* **Relations (Où va cette entité ?) :**
  * `racks` ➔ Pointeur vers son **Rack** hôte.
  * `computers` ➔ Permet de lier les serveurs lames (sous-ordinateurs) logés à l'intérieur des slots du châssis.

---

## 📦 MODULE 3 : INVENTAIRE (LOGICIEL ET COMPOSANTS)

### 1. Entité : Logiciel (`Software`)
*Définition abstraite d'une brique logicielle au catalogue.*

* **Attributs Purs (Scalaires) :**
  * `id`, `name`, `comment`, `is_update` (Booléen : s'agit-il d'un patch ?).
* **Relations (Où va cette entité ?) :**
  * `manufacturers` ➔ Pointeur vers **Manufacturer** (qui sert ici d'Éditeur, ex: Adobe, Microsoft).
  * `softwarecategories` ➔ Pointeur de rangement.
  * `softwareversions` ➔ Liste d'entités enfants vers **SoftwareVersion** (les déclinaisons physiques).

### 2. Entité : Version de Logiciel (`SoftwareVersion`)
*L'occurrence concrète d'une version de build ou de release.*

* **Attributs Purs (Scalaires) :**
  * `id`, `name` (ex: "24.0", "v11.0.7"), `release` (numéro de build complet).
* **Relations (Où va cette entité ?) :**
  * `softwares` ➔ Pointeur parent obligatoire vers l'entité **Software**.
  * `items_softwareversions` ➔ Table pivot qui pointe vers l'**Ordinateur** (ou appareil du parc) sur lequel l'agent GLPI a détecté l'installation de cette version spécifique.

### 3. Entité : Licence Logicielle (`SoftwareLicense`)
*Droit de propriété et clés d'activation rattachés au catalogue de logiciels.*

* **Attributs Purs (Scalaires) :**
  * `id`, `name`, `serial` (La clé de licence/CD-Key textuelle), `number` (Nombre de postes maximum autorisés), `expiration_date`.
* **Relations (Où va cette entité ?) :**
  * `softwares` ➔ Pointeur d'association vers le **Software** concerné.
  * `softwarelicensetypes` ➔ Type de licence (ex: OEM, Volume, SaaS).
  * `users` / `computers` ➔ Allocation nominative de la licence à un individu ou à un poste du parc pour le calcul de conformité.

### 4. Entité : Composants Unitaire Catalogue (`DeviceProcessor` / `DeviceMemory` / `DeviceHardDrive`)
*Les caractéristiques matérielles pures définies par défaut.*

* **Attributs Purs (Scalaires) :**
  * `id`, `designator` (Modèle précis, ex: "Intel Xeon Gold 6330"), `frequency` (pour CPU), `size` (pour RAM), `capacity` (pour les disques).
* **Relations (Où va cette entité ?) :**
  * `manufacturers` ➔ Pointeur vers le fondeur/constructeur de la pièce (**Manufacturer**).
  * *Note d'architecture :* Ces entités ne contiennent aucun lien direct vers le parc. Ce sont les entités du parc (comme **Computer**) qui créent des tables de jointures (`Item_DeviceProcessor`) contenant `computers_id` et `deviceprocessors_id` pour "consommer" ce composant.

---

## 🌍 SOCLE TRANSVERSAL (CONFIGURATION ET GOUVERNANCE)

Ces entités n'appartiennent à aucun module métier mais reçoivent toutes les liaisons pour structurer la base.

### 1. Entité : Utilisateur (`User`)
* **Attributs Purs :** `id`, `name` (identifiant de connexion/login), `realname` (nom de famille), `firstname`, `email`, `phone`, `is_active`.
* **Relations :** * `entities` ➔ Pointeur vers son **Entity** d'affectation par défaut.
  * `groups` ➔ Liaison N:N vers ses différents **Group** d'appartenance métiers.

### 2. Entité : Lieu (`Location`)
* **Attributs Purs :** `id`, `name` (Nom de la pièce/bureau), `address`, `building`, `room`.
* **Relations :**
  * `locations` ➔ Pointeur récursif vers lui-même (`locations_id` parent) permettant de créer des structures de type `Pays > Ville > Site > Bâtiment > Bureau 302`.

### 3. Entité : Entité Organisationnelle (`Entity`)
*Cloisonnement strict des données de la base GLPI (Multi-tenancy).*

* **Attributs Purs :** `id`, `name`, `address`, `website`, `phonenumber`.
* **Relations :**
  * `entities` ➔ Pointeur récursif de hiérarchie parent/enfant (ex: `Siège Social > Filiale France > Direction Technique`).

### 4. Entité : Fournisseur (`Supplier`)
*Tiers externes gérant les contrats, les achats et le support matériel.*

* **Attributs Purs :** `id`, `name`, `phone`, `fax`, `email`, `address`.
* **Relations :**
  * `infocomprovisions` ➔ Point d'entrée vers les informations financières de GLPI. Il se lie aux objets du **Parc** pour indiquer auprès de quel fournisseur l'équipement a été acheté et sous quel contrat de maintenance.