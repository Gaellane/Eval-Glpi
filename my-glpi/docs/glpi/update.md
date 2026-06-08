# GLPI API v2 — Mettre à jour un ticket

## Authentification

Obtenir un token OAuth2 avant toute requête :

```http
POST /api.php/token
Content-Type: application/json

{
  "grant_type": "password",
  "client_id": "VOTRE_CLIENT_ID",
  "client_secret": "VOTRE_CLIENT_SECRET",
  "username": "admin",
  "password": "motdepasse",
  "scope": "api"
}
```

Réponse :
```json
{
  "access_token": "eyJ0eXAiOiJKV1Q...",
  "expires_in": 3600
}
```

---

## Mettre à jour un ticket — `PATCH`

L'API v2 utilise la méthode **PATCH** (et non PUT) pour les mises à jour.

```
PATCH /api.php/v2/Assistance/Ticket/{id}
```

### Headers requis

```http
Authorization: Bearer {access_token}
Content-Type: application/json
```

> Vous pouvez aussi ajouter `GLPI-Profile` et `GLPI-Entity` si nécessaire :
> ```http
> GLPI-Profile: 4
> GLPI-Entity: 0
> ```

---

## Exemples de mise à jour

### Changer le statut

```http
PATCH /api.php/v2/Assistance/Ticket/42
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "status": 4
}
```

Valeurs de statut :

| Valeur | Label |
|--------|-------|
| `1` | Nouveau |
| `2` | En cours (assigné) |
| `3` | En cours (planifié) |
| `4` | En attente |
| `5` | Résolu |
| `6` | Clos |
| `10` | Approbation *(GLPI 11+)* |

---

### Changer la priorité

```http
PATCH /api.php/v2/Assistance/Ticket/42
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "priority": 5
}
```

Valeurs de priorité : `1` Très basse · `2` Basse · `3` Moyenne · `4` Haute · `5` Très haute · `6` Majeure

---

### Mettre à jour plusieurs champs à la fois

```http
PATCH /api.php/v2/Assistance/Ticket/42
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "name": "Nouveau titre du ticket",
  "content": "Description mise à jour.",
  "status": 2,
  "priority": 4,
  "itilcategories_id": 7
}
```

---

### Changer la catégorie et le type

```http
PATCH /api.php/v2/Assistance/Ticket/42
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "type": 2,
  "itilcategories_id": 12
}
```

Valeurs de type : `1` Incident · `2` Demande

---

## Réponse attendue

```json
{
  "id": 42,
  "name": "Nouveau titre du ticket",
  "status": 2,
  "priority": 4,
  ...
}
```

Code HTTP retourné : **`200 OK`**

---

## Exemple cURL complet

```bash
# 1. Obtenir le token
TOKEN=$(curl -s -X POST "https://glpi.example.com/api.php/token" \
  -H "Content-Type: application/json" \
  -d '{
    "grant_type": "password",
    "client_id": "CLIENT_ID",
    "client_secret": "CLIENT_SECRET",
    "username": "admin",
    "password": "motdepasse",
    "scope": "api"
  }' | jq -r '.access_token')

# 2. Mettre à jour le ticket 42
curl -X PATCH "https://glpi.example.com/api.php/v2/Assistance/Ticket/42" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": 5,
    "priority": 3
  }'
```

---

## Exemple JavaScript (fetch)

```js
async function updateTicket(ticketId, data, accessToken) {
  const response = await fetch(`/api.php/v2/Assistance/Ticket/${ticketId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.title ?? 'Erreur API');
  }

  return response.json();
}

// Usage
await updateTicket(42, { status: 5, priority: 3 }, accessToken);
```

---

## Exemple Python (requests)

```python
import requests

def update_ticket(ticket_id: int, data: dict, access_token: str):
    url = f"https://glpi.example.com/api.php/v2/Assistance/Ticket/{ticket_id}"
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json",
    }
    response = requests.patch(url, json=data, headers=headers)
    response.raise_for_status()
    return response.json()

# Usage
update_ticket(42, {"status": 5, "priority": 3}, access_token)
```

---

## Erreurs fréquentes

| Code | Status | Cause |
|------|--------|-------|
| `401` | `ERROR_NOT_LOGGED_IN` | Token manquant ou expiré |
| `403` | `ERROR_RIGHT_MISSING` | Droits insuffisants sur le ticket |
| `404` | `ERROR_ITEM_NOT_FOUND` | Ticket introuvable |
| `422` | `ERROR_VALIDATION` | Valeur de champ invalide |

---

## Documentation Swagger

La liste complète des champs modifiables est disponible sur votre instance :

```
https://votre-glpi.com/api.php/doc
```