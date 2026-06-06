# Dictionnaire de Données des Entités GLPI 11 — Cartographie des Liaisons
*API High-Level (v2) — GLPI 11.0.7*

Ce document sert de cartographie technique pour comprendre les dépendances et liaisons de clés entre les objets (entités) de l'API GraphQL/REST de GLPI 11.

---

## 🛠️ MODULE 1 : ASSISTANCE (ITIL)

### 1. Entité : Ticket (`Ticket`)
*Objet central matérialisant un incident technique ou une demande de service.*

**Attributs Purs (Scalaires) :**
- `id` : Identifiant unique du ticket.
- `name` : Titre explicite du ticket.
- `content` : Description longue textuelle (HTML).
- `status` : Code statut (1: Nouveau, 2: En cours, 3: Planifié, 4: En attente, 5: Résolu, 6: Clos).
- `type` : Nature (1: Incident, 2: Demande).
- `urgency` / `impact` / `priority` : Matrice de criticité (Valeurs de 1 à 5).
- `date` : Date d'ouverture du ticket.
- `solvedate` : Date de résolution.
- `closedate` : Date de clôture.
- `time_to_resolve` : SLA — délai contractuel de résolution (datetime).
- `time_to_own` : SLA — délai de prise en charge (datetime).
- `waiting_duration` : Durée cumulée en attente (secondes).
- `solve_delay_stat` : Dépassement ou respect du SLA résolution (secondes, négatif = dans les délais).
- `takeintoaccount_delay_stat` : Délai de prise en charge effectif (secondes).
- `actiontime` : Temps total de travail imputé (secondes).
- `internal_time_to_resolve` : SLA interne de résolution (datetime).
- `internal_time_to_own` : SLA interne de prise en charge (datetime).

**Relations (Où va cette entité ?) :**
- `entities` ➔ Pointeur vers **Entity** (Isolation du département).
- `locations` ➔ Pointeur vers **Location** (Où l'incident a lieu).
- `itilcategories` ➔ Pointeur vers **ItilCategory** (Arbre des catégories d'assistance).
- `users` ➔ Table de liaison polymorphe vers **User** (Permet de lier les demandeurs, observateurs et techniciens — rôle défini par `type` : 1=Demandeur, 2=Affecté, 3=Observateur).
- `groups` ➔ Table de liaison vers **Group** (Groupes techniques affectés ou groupes demandeurs).
- `problems` ➔ Pointeur/Liaison vers **Problem** (Si le ticket découle d'un problème global).
- `changes` ➔ Liaison vers les **Change** impactant ce ticket.
- `items_tickets` ➔ Table d'interconnexion polymorphe vers **n'importe quel élément du Parc** (Ordinateur, Switch, Périphérique, etc.).
- `slms` / `slas` / `olas` ➔ Liaison vers les accords de niveau de service (**SLM / SLA / OLA**).
- `requesttypes` ➔ Pointeur vers **RequestType** (Canal d'entrée : Email, Téléphone, Direct, etc.).
- `tickettasks` ➔ Liste des sous-tâches (**TicketTask**).
- `ticketfollowups` ➔ Suivis/commentaires attachés au ticket (**ITILFollowup**).
- `solutions` ➔ Solution proposée ou validée (**ITILSolution**).
- `validations` ➔ Demandes d'approbation liées (**TicketValidation**).

---

### 2. Entité : Problème (`Problem`)
*Analyse de fond visant à identifier la cause racine de plusieurs incidents répétitifs.*

**Attributs Purs (Scalaires) :**
- `id`, `name`, `content`, `status`, `urgency`, `impact`, `priority`, `date`, `solvedate`, `closedate`.
- `actiontime` : Temps total imputé sur le problème (secondes).

**Relations (Où va cette entité ?) :**
- `entities` ➔ Pointeur vers **Entity**.
- `itilcategories` ➔ Pointeur vers **ItilCategory**.
- `tickets` ➔ Liste inverse pointant vers les **Ticket** rattachés.
- `changes` ➔ Liste pointant vers les **Change** planifiés pour corriger le problème.
- `users` / `groups` ➔ Pointeurs vers les experts/cellules de crise (**User** / **Group**).
- `problemtasks` ➔ Sous-tâches du problème (**ProblemTask**).
- `solutions` ➔ Solution documentée (**ITILSolution**).

---

### 3. Entité : Changement (`Change`)
*Planification de modifications majeures ou risquées sur l'infrastructure (ex : migration de serveurs).*

**Attributs Purs (Scalaires) :**
- `id`, `name`, `content`, `status`.
- `impactcontent` : Description de l'impact attendu (HTML).
- `controlistcontent` : Liste de contrôle de déploiement (HTML).
- `rolloutplancontent` : Plan de déploiement (HTML).
- `backoutplancontent` : Plan de retour arrière (HTML).
- `checklistcontent` : Check-list de vérification (HTML).
- `date` : Date de création.
- `begin_date` / `end_date` : Plage d'exécution planifiée du changement.
- `actiontime` : Temps imputé (secondes).

**Relations (Où va cette entité ?) :**
- `entities` / `locations` ➔ Pointeurs vers **Entity** et **Location**.
- `problems` ➔ Liaison inverse vers les **Problem** ayant déclenché ce besoin de changement.
- `tickets` ➔ Liaison directe vers les **Ticket** impactés par la maintenance.
- `users` / `groups` ➔ Techniciens et équipes affectés au changement.
- `changetasks` ➔ Sous-tâches du changement (**ChangeTask**).

---

### 4. Entité : Tâche (`TicketTask` / `ProblemTask` / `ChangeTask`)
*Sous-action ou action atomique de résolution planifiée ou effectuée par un technicien.*

**Attributs Purs (Scalaires) :**
- `id` : ID de la tâche.
- `content` : Texte résumant l'action technique menée.
- `actiontime` : Temps passé (en secondes) pour accomplir la tâche.
- `state` : État d'avancement (0: Information, 1: À faire, 2: Fait).
- `date` : Date de création de la tâche.
- `begin` / `end` : Plage horaire planifiée (datetime).
- `is_private` : Booléen — tâche interne non visible par le demandeur.

**Relations (Où va cette entité ?) :**
- `tickets` (ou `problems` / `changes`) ➔ Pointeur parent obligatoire.
- `users` ➔ Pointeur vers le **User** (Le technicien ayant réalisé l'action).
- `taskcategories` ➔ Pointeur vers la catégorie de tâche (ex : Déplacement, Remplacement matériel).

---

### 5. Entité : Suivi (`ITILFollowup`)
*Commentaire ou mise à jour de statut ajouté au fil de vie d'un ticket/problème/changement.*

**Attributs Purs (Scalaires) :**
- `id` : Identifiant unique.
- `content` : Corps du message (HTML).
- `date` : Date de création du suivi.
- `is_private` : Booléen — visible uniquement par les techniciens si `true`.
- `requesttypes_id` : Canal de communication utilisé (Email, Téléphone...).

**Relations (Où va cette entité ?) :**
- `items_id` + `itemtype` ➔ Liaison polymorphe vers le **Ticket**, **Problem** ou **Change** parent.
- `users` ➔ Pointeur vers le **User** auteur du suivi.

---

### 6. Entité : Solution (`ITILSolution`)
*Solution documentée apportant la clôture ou la résolution d'un objet ITIL.*

**Attributs Purs (Scalaires) :**
- `id` : Identifiant.
- `content` : Descriptif de la solution appliquée (HTML).
- `date` : Date d'enregistrement.
- `status` : État de validation (1: En attente, 2: Acceptée, 3: Refusée).

**Relations (Où va cette entité ?) :**
- `items_id` + `itemtype` ➔ Liaison polymorphe vers **Ticket**, **Problem** ou **Change**.
- `users` ➔ **User** ayant saisi la solution.
- `solutiontypes` ➔ Pointeur vers la **SolutionType** (Correctif, Palliatif, Définitif...).

---

### 7. Entité : Validation (`TicketValidation` / `ChangeValidation`)
*Demande d'approbation formelle adressée à un valideur.*

**Attributs Purs (Scalaires) :**
- `id` : Identifiant.
- `comment_submission` : Commentaire d'envoi de la demande.
- `comment_validation` : Commentaire de réponse du valideur.
- `status` : (1: En attente, 2: Accordée, 3: Refusée).
- `submission_date` : Date d'envoi de la demande.
- `validation_date` : Date de réponse.

**Relations (Où va cette entité ?) :**
- `tickets` (ou `changes`) ➔ Objet ITIL parent.
- `users_id_validate` ➔ Pointeur vers le **User** valideur.

---

### 8. Entité : Accord de Niveau de Service (`SLA` / `OLA`)
*Définit les délais contractuels (SLA = côté utilisateur, OLA = côté interne) et les escalades.*

**Attributs Purs (Scalaires) :**
- `id`, `name`, `comment`.
- `type` : Cible (1: Temps de résolution, 2: Temps de prise en charge).
- `number_time` + `definition_time` : Durée et unité (heure, jour, etc.).
- `use_ticket_calendar` : Booléen — utilise le calendrier du ticket ou un calendrier dédié.

**Relations (Où va cette entité ?) :**
- `entities` ➔ Périmètre d'application (**Entity**).
- `calendars` ➔ Plages horaires ouvrées (**Calendar**).
- `slalevels` ➔ Liste d'escalades (**SLALevel**).

---

## 🖥️ MODULE 2 : PARC (ASSETS)

### 1. Entité : Ordinateur (`Computer`)
*Représentation physique ou virtuelle de serveurs ou de postes de travail.*

**Attributs Purs (Scalaires) :**
- `id`, `name`, `comment`.
- `serial` : Service Tag constructeur.
- `otherserial` : Code-barres ou numéro d'immobilisation interne.
- `uuid` : Identifiant universel unique (généré par le BIOS/firmware).
- `contact` : Nom libre du contact principal (champ texte non lié à un User).
- `contact_num` : Numéro de téléphone du contact.
- `date_creation` : Date d'ajout dans l'inventaire.
- `date_mod` : Date de dernière modification.
- `is_deleted` : Booléen — objet dans la corbeille.
- `is_dynamic` : Booléen — inventorié automatiquement par un agent (GLPI Agent / FusionInventory).

**Relations (Où va cette entité ?) :**
- `entities` / `locations` ➔ Pointeurs structurels vers **Entity** et **Location**.
- `states` ➔ Pointeur vers **State** (État actuel : En stock, En production, Réformé...).
- `users` / `groups` ➔ Pointeurs vers le **User** (propriétaire/utilisateur principal) et le **Group** responsable.
- `manufacturers` ➔ Pointeur vers **Manufacturer** (ex : Dell, Lenovo).
- `computermodels` / `computertypes` ➔ Tables de référence du modèle et du type (ex : Latitude 5440 / Portable).
- `operatingsystems` ➔ Liaison vers le système d'exploitation (**OperatingSystem** via `items_operatingsystems`).
- `items_deviceprocessors` ➔ Instances de processeurs installés (**DeviceProcessor**).
- `items_devicememories` ➔ Instances de barrettes RAM (**DeviceMemory**).
- `items_deviceharddrive` / `items_devicestorage` ➔ Instances de disques durs (**DeviceHardDrive** / **DeviceStorage**).
- `items_devicenetworkcards` ➔ Cartes réseau installées (**DeviceNetworkCard**).
- `networkports` ➔ Ports réseau logiques associés (**NetworkPort**).
- `softwareversions` ➔ Logiciels installés détectés par l'agent (**SoftwareVersion** via `items_softwareversions`).
- `infocom` ➔ Informations financières et contractuelles (**Infocom**).
- `tickets` ➔ Tickets d'incidents ouverts sur cet actif (liaison polymorphe `items_tickets`).

---

### 2. Entité : Matériel Réseau (`NetworkEquipment`)
*Switches, routeurs, bornes Wi-Fi, pare-feux.*

**Attributs Purs (Scalaires) :**
- `id`, `name`, `serial`, `otherserial`, `comment`.
- `ram` : Mémoire cache embarquée (en Mo).
- `contact`, `contact_num` : Contact principal de l'équipement.
- `date_creation`, `date_mod`, `is_deleted`, `is_dynamic`.

**Relations (Où va cette entité ?) :**
- `locations` / `states` / `manufacturers` / `entities` ➔ Idem Computer.
- `networkequipmentmodels` / `networkequipmenttypes` ➔ Référentiel typologique.
- `networkports` ➔ Liste de sous-composants vers **NetworkPort** (Modélise chaque prise RJ45/SFP avec son adresse MAC et son VLAN).
- `infocom` ➔ Informations financières (**Infocom**).

---

### 3. Entité : Imprimante (`Printer`)
*Imprimante réseau ou locale.*

**Attributs Purs (Scalaires) :**
- `id`, `name`, `serial`, `otherserial`, `comment`.
- `have_ethernet` / `have_wifi` : Booléens — connectivité réseau disponible.
- `have_usb` : Booléen — connecteur USB présent.
- `init_pages_counter` : Compteur de pages initial à l'ajout dans GLPI.
- `last_pages_counter` : Dernier compteur relevé.
- `date_creation`, `date_mod`.

**Relations (Où va cette entité ?) :**
- `locations` / `entities` / `states` / `manufacturers` ➔ Traçabilité.
- `printermodels` / `printertypes` ➔ Référentiel modèle et type.
- `networkports` ➔ Ports réseau si imprimante réseau.
- `computers` ➔ Liaison polymorphe vers l'**Ordinateur** hôte si imprimante locale.
- `infocom` ➔ Informations financières (**Infocom**).

---

### 4. Entité : Écran (`Monitor`)
*Écran d'affichage de bureau ou de salle serveur.*

**Attributs Purs (Scalaires) :**
- `id`, `name`, `serial`, `otherserial`, `comment`.
- `size` : Taille de la dalle (en pouces, ex : 27).
- `have_hdmi` / `have_displayport` / `have_vga` / `have_pivot` : Booléens des connectiques.
- `date_creation`, `date_mod`.

**Relations (Où va cette entité ?) :**
- `locations` / `entities` / `states` / `manufacturers` ➔ Traçabilité.
- `monitormodels` / `monitortypes` ➔ Référentiel modèle et type.
- `computers` ➔ Liaison polymorphe vers l'**Ordinateur** auquel il est rattaché.

---

### 5. Entité : Périphérique (`Peripheral`)
*Tout périphérique USB ou externe ne rentrant pas dans les catégories précédentes (webcam, scanner, hub, etc.).*

**Attributs Purs (Scalaires) :**
- `id`, `name`, `serial`, `otherserial`, `comment`.
- `date_creation`, `date_mod`.

**Relations (Où va cette entité ?) :**
- `locations` / `entities` / `states` / `manufacturers` ➔ Traçabilité.
- `peripheralmodels` / `peripheraltypes` ➔ Référentiel modèle et type.
- `computers` ➔ Liaison polymorphe vers l'**Ordinateur** hôte.

---

### 6. Entité : Téléphone (`Phone`)
*Téléphone fixe IP ou mobile.*

**Attributs Purs (Scalaires) :**
- `id`, `name`, `serial`, `otherserial`, `comment`.
- `have_headset` : Booléen — casque fourni.
- `have_hp` : Booléen — haut-parleur intégré.
- `date_creation`, `date_mod`.

**Relations (Où va cette entité ?) :**
- `locations` / `entities` / `states` / `manufacturers` ➔ Traçabilité.
- `phonemodels` / `phonetypes` ➔ Référentiel modèle et type.
- `users` ➔ Utilisateur assigné (**User**).
- `lines` ➔ Ligne téléphonique associée (**Line**).

---

### 7. Entité : Baie / Rack (`Rack`)
*Conteneur physique présent dans les centres de données.*

**Attributs Purs (Scalaires) :**
- `id`, `name`, `comment`.
- `number_units` : Hauteur de la baie en U (ex : 42U).
- `bgcolor` : Couleur d'affichage dans le plan de salle (code hexadécimal).
- `width` / `depth` / `height` : Dimensions physiques de la baie (en mm).
- `max_power` : Puissance maximale admissible (en watts).
- `measured_power` : Puissance mesurée réelle (en watts).
- `max_weight` : Poids maximal supporté (en kg).

**Relations (Où va cette entité ?) :**
- `locations` ➔ Pointeur vers **Location** (généralement une salle serveur).
- `dcrooms` ➔ Pointeur vers la Salle Machine (**DCRoom**).
- `racktypes` / `rackmodels` ➔ Référentiel type et modèle de baie.
- `manufacturers` ➔ Constructeur du rack (**Manufacturer**).
- `items` ➔ Liste imbriquée contenant tous les **Computer**, **NetworkEquipment**, **PDU**, **Enclosure** insérés dans la baie, indexés par leur position d'U.

---

### 8. Entité : Châssis / Enclosure (`Enclosure`)
*Châssis de serveurs lames (Blade) inséré dans un Rack et accueillant des sous-serveurs.*

**Attributs Purs (Scalaires) :**
- `id`, `name`, `comment`.
- `number_models` : Nombre d'emplacements/slots disponibles.
- `orientation` : Sens d'insertion (0: Normal, 1: Inversé).

**Relations (Où va cette entité ?) :**
- `racks` ➔ Pointeur vers son **Rack** hôte.
- `locations` / `entities` / `states` ➔ Traçabilité.
- `enclosuremodels` ➔ Modèle de châssis (**EnclosureModel**).
- `computers` ➔ Serveurs lames logés dans les slots du châssis (**Computer**).

---

### 9. Entité : PDU (`PDU`)
*Unité de distribution électrique (Power Distribution Unit) installée dans un rack.*

**Attributs Purs (Scalaires) :**
- `id`, `name`, `comment`.
- `max_power` : Puissance maximale distribuée (en watts).
- `date_creation`, `date_mod`.

**Relations (Où va cette entité ?) :**
- `locations` / `entities` / `states` ➔ Traçabilité.
- `pdumodels` / `pdutypes` ➔ Référentiel modèle et type.
- `manufacturers` ➔ Fabricant (**Manufacturer**).
- `racks` ➔ Rack hôte (**Rack**).
- `plugs` ➔ Prises électriques et branchements (`PDU_Plug`).

---

### 10. Entité : Salle Informatique (`DCRoom`)
*Salle physique d'un datacenter contenant les racks.*

**Attributs Purs (Scalaires) :**
- `id`, `name`, `comment`.
- `vis_cols` / `vis_rows` : Dimensions de la grille de visualisation du plan de salle.
- `blueprint` : Chemin vers l'image de fond du plan (fichier uploadé).

**Relations (Où va cette entité ?) :**
- `locations` ➔ Localisation géographique (**Location**).
- `entities` ➔ Entité organisationnelle (**Entity**).
- `racks` ➔ Liste des racks présents dans la salle (**Rack**).

---

### 11. Entité : Ligne Téléphonique (`Line`)
*Ligne téléphonique (fixe ou mobile) associée à un téléphone.*

**Attributs Purs (Scalaires) :**
- `id`, `name`, `comment`.
- `caller_id_name` / `caller_id_num` : Identification de l'appelant (CLID).
- `have_internet` : Booléen — ligne couplée à un accès internet (ex : xDSL).

**Relations (Où va cette entité ?) :**
- `entities` / `locations` ➔ Traçabilité organisationnelle.
- `linetypes` ➔ Type de ligne (RTC, VoIP, GSM...).
- `lineoperators` ➔ Opérateur téléphonique (**LineOperator**).
- `phones` ➔ Téléphone associé (**Phone**).

---

## 📦 MODULE 3 : INVENTAIRE (LOGICIEL ET COMPOSANTS)

### 1. Entité : Logiciel (`Software`)
*Définition abstraite d'une brique logicielle au catalogue.*

**Attributs Purs (Scalaires) :**
- `id`, `name`, `comment`.
- `is_update` : Booléen — s'agit-il d'un patch ou d'une mise à jour d'un logiciel parent ?
- `date_creation`, `date_mod`.

**Relations (Où va cette entité ?) :**
- `manufacturers` ➔ Pointeur vers **Manufacturer** (éditeur : Adobe, Microsoft...).
- `entities` ➔ Entité organisationnelle de rattachement (**Entity**).
- `softwarecategories` ➔ Catégorie du logiciel (**SoftwareCategory**).
- `softwareversions` ➔ Liste d'entités enfants vers **SoftwareVersion**.

---

### 2. Entité : Version de Logiciel (`SoftwareVersion`)
*L'occurrence concrète d'une version de build ou de release.*

**Attributs Purs (Scalaires) :**
- `id` : Identifiant.
- `name` : Numéro de version affiché (ex : "24.0", "v11.0.7").
- `release` : Numéro de build complet ou identifiant éditeur.
- `arch` : Architecture cible (x86, x64, ARM...).
- `state` : État de la version (ex : Supportée, EOL...).
- `date_creation`, `date_mod`.

**Relations (Où va cette entité ?) :**
- `softwares` ➔ Pointeur parent obligatoire vers **Software**.
- `operatingsystems` ➔ OS cible de cette version (**OperatingSystem**).
- `items_softwareversions` ➔ Table pivot qui pointe vers les **Computer** (ou appareils) où cette version est installée.

---

### 3. Entité : Licence Logicielle (`SoftwareLicense`)
*Droit de propriété et clés d'activation rattachés au catalogue de logiciels.*

**Attributs Purs (Scalaires) :**
- `id`, `name`.
- `serial` : Clé de licence / CD-Key textuelle.
- `number` : Nombre de postes maximum autorisés par cette licence.
- `expire` : Date d'expiration de la licence.
- `buy` : Date d'achat.
- `comment`.

**Relations (Où va cette entité ?) :**
- `softwares` ➔ Logiciel concerné (**Software**).
- `softwareversions` ➔ Version spécifique couverte, si applicable (**SoftwareVersion**).
- `softwarelicensetypes` ➔ Type de licence (OEM, Volume, SaaS...).
- `entities` ➔ Entité organisationnelle (**Entity**).
- `users` / `computers` ➔ Allocation nominative pour le calcul de conformité.
- `suppliers` ➔ Fournisseur de la licence (**Supplier** via `infocom`).

---

### 4. Entité : Composants Catalogue (`DeviceProcessor` / `DeviceMemory` / `DeviceHardDrive` / `DeviceNetworkCard` / `DeviceGraphicCard` / `DevicePowerSupply` / `DeviceDrive` / `DeviceControl` / `DeviceCamera` / `DeviceSoundCard` / `DeviceBattery` / `DeviceFirmware`)
*Caractéristiques matérielles pures définies dans le catalogue commun.*

**Attributs Purs (Scalaires) — exemples :**
- `id` : Identifiant.
- `designation` : Modèle précis (ex : "Intel Xeon Gold 6330", "Samsung 32GB DDR5").
- `frequency` (CPU) : Fréquence en MHz.
- `nbcores` / `nbthreads` (CPU) : Nombre de cœurs et de threads.
- `frequence` (RAM) : Fréquence en MHz.
- `size` (RAM) : Capacité en Mo.
- `capacity` (HDD) : Capacité en Mo.
- `rpm` (HDD) : Vitesse de rotation.
- `interface` (HDD/NIC) : Type d'interface (SATA, NVMe, PCIe...).
- `bandwidth` (NIC) : Débit en Mbps.
- `capacity_default` (batterie) : Capacité en mWh.
- `comment`.

**Relations (Où va cette entité ?) :**
- `manufacturers` ➔ Fabricant/fondeur (**Manufacturer**).
- *Note d'architecture :* Ces entités catalogues n'ont pas de lien direct vers les actifs. Ce sont des tables de jointure (`Item_DeviceProcessor`, `Item_DeviceMemory`, etc.) portant `computers_id` et `deviceprocessors_id` qui matérialisent l'installation physique.

---

### 5. Entité : Système d'Exploitation (`OperatingSystem`)
*Référentiel des systèmes d'exploitation du catalogue.*

**Attributs Purs (Scalaires) :**
- `id`, `name`, `comment`.

**Relations (Où va cette entité ?) :**
- `operatingsystemversions` ➔ Versions de l'OS (ex : 22H2) (**OperatingSystemVersion**).
- `operatingsystemservicepacks` ➔ Service Packs et mises à jour majeures.
- `operatingsystemarchitectures` ➔ Architecture (x64, ARM64...).
- `operatingsystemkernels` ➔ Version du noyau (**OperatingSystemKernel**).
- `items_operatingsystems` ➔ Table pivot vers les **Computer** sur lesquels cet OS est installé.

---

## 📋 MODULE 4 : GESTION (MANAGEMENT)

### 1. Entité : Contrat (`Contract`)
*Accord commercial liant GLPI à un fournisseur externe pour la maintenance ou la fourniture de services.*

**Attributs Purs (Scalaires) :**
- `id`, `name`, `comment`.
- `num` : Numéro de référence interne du contrat.
- `begin_date` : Date de début de validité.
- `duration` : Durée du contrat (en mois).
- `renewal` : Durée de reconduction tacite (en mois, 0 = pas de reconduction).
- `notice` : Délai de préavis de résiliation (en mois).
- `accounting_number` : Numéro comptable / code d'imputation.
- `cost` : Valeur financière totale du contrat.
- `periodicity` : Périodicité de facturation (en mois).
- `billing` : Granularité de facturation (en mois).

**Relations (Où va cette entité ?) :**
- `entities` ➔ Entité organisationnelle (**Entity**).
- `contracttypes` ➔ Nature du contrat (Maintenance, Prestation, Hébergement...).
- `suppliers` ➔ Fournisseur titulaire du contrat (**Supplier** via `contracts_suppliers`).
- `users` ➔ Gestionnaire interne du contrat (**User**).
- `items` ➔ Actifs couverts par ce contrat (liaison polymorphe via `contracts_items`).
- `contractcosts` ➔ Lignes de coût associées (**ContractCost**).

---

### 2. Entité : Contact (`Contact`)
*Interlocuteur externe (commercial, support éditeur, prestataire) lié à un fournisseur.*

**Attributs Purs (Scalaires) :**
- `id`, `name`, `firstname`, `comment`.
- `phone` / `phone2` / `mobile` : Numéros de téléphone.
- `fax` : Numéro de fax.
- `email` : Adresse email principale.
- `address` / `postcode` / `town` / `state` / `country` : Adresse postale.
- `registration_number` : Matricule ou identifiant interne.

**Relations (Où va cette entité ?) :**
- `entities` ➔ Entité organisationnelle (**Entity**).
- `contacttypes` ➔ Rôle du contact (Commercial, Technique, Direction...).
- `suppliers` ➔ Fournisseur auquel ce contact est rattaché (**Supplier** via `contacts_suppliers`).

---

### 3. Entité : Document (`Document`)
*Fichier joint (PDF, image, texte) attaché à n'importe quel objet de GLPI.*

**Attributs Purs (Scalaires) :**
- `id`, `name`, `comment`.
- `filename` : Nom du fichier original.
- `filepath` : Chemin de stockage sur le serveur GLPI.
- `mime` : Type MIME du fichier (ex : `application/pdf`).
- `sha1sum` : Empreinte SHA-1 du fichier pour détecter les doublons.
- `date_creation`, `date_mod`.
- `link` : URL externe optionnelle à la place d'un fichier hébergé.

**Relations (Où va cette entité ?) :**
- `entities` ➔ Entité organisationnelle (**Entity**).
- `documentcategories` ➔ Catégorie du document (**DocumentCategory**).
- `users` ➔ Auteur ayant versé le document (**User**).
- `items` ➔ Liaison polymorphe (via `documents_items`) vers **tout objet GLPI** auquel il est attaché.

---

### 4. Entité : Budget (`Budget`)
*Enveloppe financière utilisée pour le suivi des dépenses d'achat d'actifs.*

**Attributs Purs (Scalaires) :**
- `id`, `name`, `comment`.
- `value` : Montant total alloué au budget.
- `begin_date` / `end_date` : Période de validité du budget.

**Relations (Où va cette entité ?) :**
- `entities` ➔ Entité organisationnelle (**Entity**).
- `budgettypes` ➔ Type de budget (**BudgetType**).
- `infocom` ➔ Liaison inverse — tous les actifs imputés à ce budget via leur fiche **Infocom**.

---

### 5. Entité : Information Financière (`Infocom`)
*Fiche financière et administrative attachée à chaque actif du parc.*

**Attributs Purs (Scalaires) :**
- `id` : Identifiant.
- `buy_date` : Date d'achat.
- `use_date` : Date de mise en service.
- `warranty_date` : Date de début de garantie.
- `warranty_duration` : Durée de garantie (en mois).
- `warranty_info` : Informations textuelles sur la garantie.
- `warranty_value` : Valeur financière de la garantie.
- `value` : Valeur d'achat HT.
- `sink_time` / `sink_type` / `sink_coeff` : Paramètres d'amortissement (durée, mode, coefficient).
- `alert` : Seuil d'alerte avant expiration (en jours).
- `order_number` : Numéro de bon de commande.
- `delivery_number` : Numéro de bon de livraison.
- `immo_number` : Numéro d'immobilisation comptable.
- `order_date` / `delivery_date` / `inventory_date` / `decommission_date` : Dates du cycle de vie financier.

**Relations (Où va cette entité ?) :**
- `items_id` + `itemtype` ➔ Liaison polymorphe vers l'actif du parc (**Computer**, **NetworkEquipment**, etc.).
- `suppliers` ➔ Fournisseur d'achat (**Supplier**).
- `budgets` ➔ Budget d'imputation (**Budget**).
- `contracts` ➔ Contrat de garantie ou de maintenance lié (**Contract**).

---

### 6. Entité : Base de Connaissances (`KnowbaseItem`)
*Article de FAQ ou de documentation technique partageable.*

**Attributs Purs (Scalaires) :**
- `id`, `name`, `comment`.
- `answer` : Corps complet de l'article (HTML).
- `is_faq` : Booléen — visible dans l'interface FAQ publique des utilisateurs finaux.
- `date_creation` / `date_mod`.
- `view` : Compteur de vues (entier).
- `rating` : Note moyenne de l'article (sur 5).

**Relations (Où va cette entité ?) :**
- `entities` ➔ Visibilité restreinte à une **Entity** ou globale.
- `users` ➔ Auteur de l'article (**User**).
- `knowbaseitemcategories` ➔ Catégorie dans l'arbre de la base de connaissances (**KnowbaseItemCategory**).
- `knowbaseitems_items` ➔ Liaison polymorphe vers les tickets, problèmes et actifs liés.
- `knowbaseitems_revisions` ➔ Historique des révisions (**KnowbaseItem_Revision**).
- `knowbaseitems_comments` ➔ Commentaires des lecteurs (**KnowbaseItem_Comment**).

---

## 🗂️ MODULE 5 : PROJETS

### 1. Entité : Projet (`Project`)
*Plan de projet structurant un ensemble de tâches et d'équipes.*

**Attributs Purs (Scalaires) :**
- `id`, `name`, `comment`, `content`.
- `code` : Code court d'identification du projet.
- `priority` : Priorité (1 à 6).
- `percent_done` : Taux d'avancement (0–100).
- `date` : Date de début prévue.
- `date_mod` : Date de dernière modification.
- `plan_start_date` / `plan_end_date` : Dates planifiées.
- `real_start_date` / `real_end_date` : Dates réelles.
- `show_on_global_view` : Booléen — affiché dans le tableau de bord global.

**Relations (Où va cette entité ?) :**
- `entities` ➔ Entité organisationnelle (**Entity**).
- `users` / `groups` ➔ Chef de projet et équipes (**User** / **Group**).
- `projectstates` ➔ État du projet (En cours, Suspendu, Terminé...).
- `projecttypes` ➔ Nature du projet (**ProjectType**).
- `projecttasks` ➔ Liste de tâches du projet (**ProjectTask**).
- `projects` ➔ Pointeur récursif vers un projet parent (sous-projet).
- `items` ➔ Actifs ou objets ITIL liés au projet (liaison polymorphe).

---

### 2. Entité : Tâche de Projet (`ProjectTask`)
*Tâche individuelle ou jalon au sein d'un projet.*

**Attributs Purs (Scalaires) :**
- `id`, `name`, `comment`, `content`.
- `percent_done` : Taux d'avancement (0–100).
- `plan_start_date` / `plan_end_date` : Dates planifiées.
- `real_start_date` / `real_end_date` : Dates réelles.
- `planned_duration` : Durée planifiée (en secondes).
- `effective_duration` : Durée réelle effectuée (en secondes).
- `is_milestone` : Booléen — il s'agit d'un jalon (sans durée).

**Relations (Où va cette entité ?) :**
- `projects` ➔ Projet parent (**Project**).
- `projecttasks` ➔ Pointeur récursif vers une tâche parente (sous-tâche).
- `projecttaskteams` ➔ Équipe affectée (**User** / **Group**).
- `projecttasktypes` ➔ Type de tâche (**ProjectTaskType**).

---

## 🌍 SOCLE TRANSVERSAL (CONFIGURATION ET GOUVERNANCE)

### 1. Entité : Utilisateur (`User`)

**Attributs Purs :**
- `id` : Identifiant unique interne.
- `name` : Identifiant de connexion (login).
- `realname` : Nom de famille.
- `firstname` : Prénom.
- `email` : Adresse email principale (stockée dans `useremails`).
- `phone` / `phone2` / `mobile` : Coordonnées téléphoniques.
- `registration_number` : Matricule RH ou numéro interne.
- `comment` : Remarques libres.
- `language` : Langue de l'interface pour cet utilisateur (ex : `fr_FR`).
- `is_active` : Booléen — compte activé.
- `password_last_update` : Date du dernier changement de mot de passe.
- `date_creation`, `date_mod`.
- `last_login` : Horodatage de la dernière connexion.

**Relations :**
- `entities` ➔ Entité d'affectation par défaut (**Entity**).
- `groups` ➔ Liaison N:N vers ses groupes d'appartenance (**Group**).
- `profiles` ➔ Profils de droits attribués par entité (**Profile** via `profiles_users`).
- `locations` ➔ Localisation principale (**Location**).
- `useremails` ➔ Liste de toutes les adresses email de l'utilisateur (**UserEmail**).

---

### 2. Entité : Groupe (`Group`)
*Équipe fonctionnelle ou technique regroupant des utilisateurs.*

**Attributs Purs :**
- `id`, `name`, `comment`.
- `is_requester` : Booléen — le groupe peut être demandeur sur des tickets.
- `is_assign` : Booléen — le groupe peut être assigné à des tickets.
- `is_notify` : Booléen — le groupe reçoit des notifications.
- `is_itemgroup` : Booléen — le groupe peut être propriétaire d'actifs.
- `is_usergroup` : Booléen — il s'agit d'un groupe d'utilisateurs ITIL.
- `is_manager` : Booléen — groupe de chefs de projet.
- `date_creation`, `date_mod`.

**Relations :**
- `entities` ➔ Entité de rattachement (**Entity**).
- `groups` ➔ Pointeur récursif vers un groupe parent (hiérarchie).
- `users` ➔ Membres du groupe (**User** via `groups_users`).

---

### 3. Entité : Lieu (`Location`)

**Attributs Purs :**
- `id`, `name`, `comment`.
- `address` : Adresse postale.
- `postcode` / `town` / `state` / `country` : Éléments géographiques.
- `building` : Nom ou identifiant du bâtiment.
- `room` : Numéro ou nom de la pièce.
- `latitude` / `longitude` / `altitude` : Coordonnées GPS.

**Relations :**
- `locations` ➔ Pointeur récursif sur lui-même (`locations_id` parent) — structure arborescente `Pays > Ville > Site > Bâtiment > Bureau 302`.
- `entities` ➔ Entité d'appartenance (**Entity**).

---

### 4. Entité Organisationnelle (`Entity`)
*Cloisonnement strict des données de la base GLPI (multi-tenancy).*

**Attributs Purs :**
- `id`, `name`, `comment`.
- `address` / `postcode` / `town` / `state` / `country` : Coordonnées de l'entité.
- `website` : Site web de l'entité.
- `phonenumber` / `fax` / `email` : Coordonnées de contact.
- `registration_number` : SIRET ou identifiant officiel.
- `ldap_dn` : DN LDAP pour la synchronisation annuaire.
- `tag` : Tag unique utilisé par l'agent d'inventaire pour identifier l'entité.
- `completename` : Chemin complet dans l'arborescence (ex : `Siège > France > DSI`), calculé automatiquement.

**Relations :**
- `entities` ➔ Pointeur récursif de hiérarchie parent/enfant.
- `profiles` ➔ Profils de droits actifs dans cette entité (**Profile**).

---

### 5. Entité : Fournisseur (`Supplier`)
*Tiers externes gérant les contrats, les achats et le support matériel.*

**Attributs Purs :**
- `id`, `name`, `comment`.
- `phone` / `fax` : Coordonnées.
- `email` : Email principal.
- `address` / `postcode` / `town` / `state` / `country` : Adresse postale.
- `website` : URL du site web.
- `registration_number` : SIRET ou identifiant légal.

**Relations :**
- `entities` ➔ Entité organisationnelle (**Entity**).
- `suppliertypes` ➔ Nature du fournisseur (Éditeur, Intégrateur, FAI...).
- `contracts` ➔ Contrats en cours avec ce fournisseur (**Contract** via `contracts_suppliers`).
- `contacts` ➔ Contacts humains rattachés (**Contact** via `contacts_suppliers`).
- `infocom` ➔ Actifs achetés auprès de ce fournisseur (**Infocom** — liaison inverse).

---

### 6. Entité : Profil (`Profile`)
*Ensemble de droits et permissions accordés à un utilisateur dans une entité donnée.*

**Attributs Purs :**
- `id`, `name`, `comment`.
- `interface` : Interface visible (helpdesk = utilisateur final, central = technicien).
- `is_default` : Booléen — profil attribué par défaut aux nouveaux utilisateurs.
- `helpdesk_hardware` / `helpdesk_item_type` : Restrictions de l'interface helpdesk.
- `date_mod`.

**Relations :**
- `users` ➔ Utilisateurs ayant ce profil (**User** via `profiles_users`).
- `entities` ➔ Entités dans lesquelles ce profil est actif.

---

### 7. Entité : Calendrier (`Calendar`)
*Définit les plages horaires ouvrées utilisées pour le calcul des SLA et des plannings.*

**Attributs Purs :**
- `id`, `name`, `comment`.
- `date_mod`.

**Relations :**
- `entities` ➔ Entité d'appartenance (**Entity**).
- `calendarsegments` ➔ Tranches horaires journalières (**CalendarSegment** : jour de semaine, heure de début, heure de fin).
- `holidays` ➔ Jours fériés ou fermetures exceptionnelles (**Holiday**).
- `slas` / `olas` ➔ SLA/OLA utilisant ce calendrier.

---

### 8. Entité : Port Réseau (`NetworkPort`)
*Interface réseau logique (physique ou virtuelle) attachée à un équipement.*

**Attributs Purs :**
- `id`, `name`, `comment`.
- `mac` : Adresse MAC (notation XX:XX:XX:XX:XX:XX).
- `instantiation_type` : Type d'instanciation physique (Ethernet, WiFi, Agrégat, LocalLoop...).
- `logical_number` : Numéro de port logique (index SNMP).
- `ip` : Adresse IP principale (via `networknames`).
- `speed` : Débit du port (en bps).

**Relations :**
- `items_id` + `itemtype` ➔ Liaison polymorphe vers l'équipement hôte (**Computer**, **NetworkEquipment**, **Printer**...).
- `networknames` ➔ Nom réseau et adresses IP associées (**NetworkName**).
- `vlans` ➔ VLAN(s) assigné(s) à ce port (**Vlan** via `networkports_vlans`).
- `networkports` ➔ Lien vers le port distant auquel ce port est connecté (câblage logique).

---

### 9. Entité : Adresse IP / Nom Réseau (`NetworkName`)
*Nom DNS et adresses IP associés à un port réseau.*

**Attributs Purs :**
- `id`, `name` : Nom DNS (FQDN ou nom court).
- `comment`.

**Relations :**
- `networkports` ➔ Port réseau parent (**NetworkPort**).
- `ipaddresses` ➔ Adresses IP attachées (**IPAddress**).
- `fqdns` ➔ Domaine DNS (**FQDN**).

---

### 10. Entité : VLAN (`Vlan`)
*Réseau local virtuel défini sur l'infrastructure de switching.*

**Attributs Purs :**
- `id`, `name`, `comment`.
- `tag` : Identifiant VLAN IEEE 802.1Q (1–4094).

**Relations :**
- `entities` ➔ Entité organisationnelle (**Entity**).
- `networkports` ➔ Ports réseau sur lesquels ce VLAN est actif (**NetworkPort** via `networkports_vlans`).

---

### 11. Entité : Règle (`Rule`)
*Règle métier automatisant des actions ou des affectations (ex : règle d'assignation de ticket).*

**Attributs Purs :**
- `id`, `name`, `comment`.
- `sub_type` : Sous-classe PHP de la règle (ex : `RuleTicket`, `RuleImportAsset`...).
- `ranking` : Ordre d'évaluation des règles (entier, croissant).
- `is_active` : Booléen — règle activée.
- `match` : Logique d'évaluation des critères (`AND` ou `OR`).
- `condition` : Déclencheur (0: Toujours, 1: À la création, 2: À la mise à jour...).

**Relations :**
- `entities` ➔ Périmètre de la règle (**Entity**).
- `rulecriteria` ➔ Critères de déclenchement (**RuleCriteria** : champ, opérateur, valeur).
- `ruleactions` ➔ Actions exécutées si les critères sont satisfaits (**RuleAction** : champ, valeur à affecter).

---

### 12. Entité : Catégorie ITIL (`ItilCategory`)
*Arbre de classification des tickets, problèmes et changements.*

**Attributs Purs :**
- `id`, `name`, `comment`.
- `is_incident` : Booléen — utilisable pour les incidents.
- `is_request` : Booléen — utilisable pour les demandes.
- `is_problem` : Booléen — utilisable pour les problèmes.
- `is_change` : Booléen — utilisable pour les changements.
- `code` : Code court d'intégration externe.

**Relations :**
- `entities` ➔ Entité organisationnelle (**Entity**).
- `itilcategories` ➔ Pointeur récursif vers la catégorie parente.
- `users` ➔ Technicien affecté par défaut (**User**).
- `groups` ➔ Groupe affecté par défaut (**Group**).

---

### 13. Entité : État (`State`)
*Référentiel des états de cycle de vie des actifs du parc.*

**Attributs Purs :**
- `id`, `name`, `comment`.
- `is_visible_computer` / `is_visible_networkequipment` / `is_visible_printer` / `is_visible_monitor` / `is_visible_peripheral` / `is_visible_phone` : Booléens — cet état est proposé pour ce type d'actif.

**Relations :**
- `entities` ➔ Entité organisationnelle (**Entity**).
- `states` ➔ Pointeur récursif vers l'état parent.

---

### 14. Entité : Constructeur / Éditeur (`Manufacturer`)
*Référentiel des fabricants matériels et éditeurs logiciels.*

**Attributs Purs :**
- `id`, `name`, `comment`.

**Relations :**
- *Liaison inverse depuis* **Computer**, **NetworkEquipment**, **Software**, **DeviceProcessor**, etc.

---

*Document généré sur la base de GLPI 11.0.7 — API High-Level v2*
*Dernière mise à jour : Juin 2026*
