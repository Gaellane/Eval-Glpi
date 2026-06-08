
# Endpoints v2 (référencés dans le projet)

> Liste des endpoints GLPI v2 (principalement `v2.3` dans le code) trouvés dans ce dépôt, avec méthode HTTP, usage et fichier(s) où ils sont référencés.

> Remarque : le code du projet utilise souvent `BASE_URL + '/v2.3/...'` pour les appels modernisés, tandis que la documentation GLPI générique montre parfois la forme `/api.php/v2/...`. De plus, certaines opérations de création restent implémentées via l'API v1 dans le projet (ex. création de ticket, upload de document).

## Authentication

- POST `{BASE_URL}/v2.3/token`
	- Usage : obtention d'un `access_token` (grant_type password) et `refresh_token` — également utilisé pour rafraîchir le token.
	- Fichiers : `src/services/login/login.js`, `src/services/api/api.js`.
	- Exemple : POST JSON { grant_type: "password", client_id, client_secret, username, password, scope }

## Tickets (Assistance)

- GET `{BASE_URL}/v2.3/Assistance/Ticket`
	- Usage : lister/récupérer les tickets via l'API v2 (lecture). Le projet lit les tickets en v2.
	- Fichier : `src/models/assistance/Ticket.js`.
	- Exemple : GET avec header `Authorization: Bearer <access_token>`

> Note : la création d'un ticket dans le projet utilise encore l'API v1 (`{BASE_URL}/v1/Ticket`) — voir `src/models/assistance/Ticket.js`.

## Assets (par type)

- GET `{BASE_URL}/v2.3/Assets/{Type}`
	- Types utilisés : `Computer`, `Monitor`, `NetworkEquipment`, `Printer`, `Phone`, `Peripheral`, `Rack`, `Enclosure`, `PDU`, `PassiveDCEquipment`, `Unmanaged`.
	- Usage : récupération des assets par type (inventaire). Le modèle utilise `v2_endpoint + type`.
	- Fichier(s) : `src/models/assets/Asset.js`, références dans `src/services/reset/reset.js`.
	- Exemple : `GET {BASE_URL}/v2.3/Assets/Computer` avec `Authorization: Bearer <token>`

## Documents / téléchargement

- GET `{BASE_URL}/v2.3/Management/Document`
- GET `{BASE_URL}/v2.3/Management/Document/{id}/Download`
	- Usage : lister documents et obtenir l'URL de téléchargement (v2). Le projet utilise la route `Management/Document` pour le listing et construit le lien de téléchargement.
	- Fichier : `src/models/documents/Document.js`.
	- Remarque : l'upload des fichiers dans le projet est fait via l'API v1 (`{BASE_URL}/v1/Document`).

## Dropdowns / Config

- GET `{BASE_URL}/v2.3/Dropdowns/`
- GET `{BASE_URL}/v2.3/Dropdowns/State`
- GET `{BASE_URL}/v2.3/Dropdowns/Location`
- GET `{BASE_URL}/v2.3/Dropdowns/{Model}` (ex. `ComputerModel`, `MonitorModel`, `NetworkEquipmentModel`, `PrinterModel`, `PhoneModel`, `PeripheralModel`)
	- Usage : récupérer listes de références (états, lieux, modèles...).
	- Fichiers : `src/models/dropdowns/Model.js`, `src/models/dropdowns/State.js`, `src/models/dropdowns/Location.js`, et références dans `src/services/reset/reset.js`.

## Pattern utilisé par le script de purge / reset

- GET `{BASE_URL}/v2.3${entity.endpoint}` — récupération des éléments (list)
- DELETE `{BASE_URL}/v2.3${entity.endpoint}/{id}` — suppression d'un élément
	- Usage : `src/services/reset/reset.js` parcourt la liste `GLPI_ENTITIES_V2` et effectue des GET puis des DELETE pour purger les ressources.
	- Exemple générique :

```text
GET  {BASE_URL}/v2.3/Assets/Computer
DELETE {BASE_URL}/v2.3/Assets/Computer/{id}
```

## Autres références / formats trouvés

- Dans la documentation embarquée on trouve des exemples au format `/api.php/v2/...` (ex. `/api.php/v2/Ticket`) — selon la configuration GLPI, `BASE_URL` peut pointer sur `/api.php` ou sur la racine exposant `/v2`.
- Le projet mélange `v2.3` (code) et appels v1 pour certaines opérations d'écriture (ex. `/v1/Item_Ticket`, `/v1/Document`). Vérifiez l'usage (lecture vs écriture) avant de migrer entièrement vers v2.

## Récapitulatif rapide (endpoints principaux)

- POST `{BASE_URL}/v2.3/token` — auth / refresh
- GET  `{BASE_URL}/v2.3/Assistance/Ticket` — lister tickets
- GET  `{BASE_URL}/v2.3/Assets/{Type}` — lister assets par type (Computer, Monitor, ...)
- GET  `{BASE_URL}/v2.3/Management/Document`
- GET  `{BASE_URL}/v2.3/Management/Document/{id}/Download`
- GET  `{BASE_URL}/v2.3/Dropdowns/{...}` (State, Location, Models...)
- Generic: GET `{BASE_URL}/v2.3${entity.endpoint}` / DELETE `{BASE_URL}/v2.3${entity.endpoint}/{id}` (purge)

---

Si vous voulez, je peux :
- ajouter des exemples `curl` prêts à l'emploi pour chaque endpoint ;
- compléter la liste avec toutes les routes exactes extraites de `GLPI_ENTITIES_V2` (table complète) ;
- ou générer un tableau Markdown listant méthodes, headers requis et fichiers consommateurs.

