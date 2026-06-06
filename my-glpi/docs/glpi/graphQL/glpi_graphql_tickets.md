# 🎫 GLPI GraphQL — Module Tickets

> **Endpoint :** `POST http://localhost:8081/api.php/GraphQL`
> **Header :** `Authorization: Bearer VOTRE_TOKEN`
> **Header :** `Content-Type: application/json`

---

## 1. Lister tous les tickets

```json
{
  "query": "query { Ticket { id name date status { id name } priority { id name } } }"
}
```

---

## 2. Lister les tickets avec tous les champs utiles

```json
{
  "query": "query { Ticket { id name content date date_mod date_creation closedate solvedate status { id name } priority { id name } urgency { id name } impact { id name } type { id name } } }"
}
```

---

## 3. Filtrer les tickets ouverts (status == 1)

```json
{
  "query": "query { Ticket(filter: \"status==1\") { id name date priority { name } status { name } } }"
}
```

---

## 4. Filtrer par priorité haute (priority == 4 ou 5)

```json
{
  "query": "query { Ticket(filter: \"priority=in=(4,5)\") { id name priority { name } status { name } date } }"
}
```

---

## 5. Rechercher un ticket par nom (insensible à la casse)

```json
{
  "query": "query { Ticket(filter: \"name=ilike=réseau\") { id name status { name } date } }"
}
```

---

## 6. Tickets avec pagination (limit + offset)

```json
{
  "query": "query { Ticket(limit: 10, offset: 0) { id name status { name } priority { name } } }"
}
```

---

## 7. Tickets récents — triés par date de création

```json
{
  "query": "query { Ticket(limit: 20, sort: \"date_creation\", order: \"DESC\") { id name date_creation status { name } priority { name } } }"
}
```

---

## 8. Ticket par ID spécifique

```json
{
  "query": "query { Ticket(filter: \"id==42\") { id name content date status { name } priority { name } urgency { name } type { name } } }"
}
```

---

## 9. Tickets non résolus avec demandeur

```json
{
  "query": "query { Ticket(filter: \"status=out=(5,6)\") { id name date status { name } priority { name } } }"
}
```

> **Statuts GLPI :**
> - `1` = Nouveau
> - `2` = En cours (attribué)
> - `3` = En cours (planifié)
> - `4` = En attente
> - `5` = Résolu
> - `6` = Clos

---

## 10. Introspection — voir tous les champs disponibles du type Ticket

```json
{
  "query": "query { __type(name: \"Ticket\") { name fields { name description type { name kind ofType { name kind } } } } }"
}
```

---

## Référence des priorités

| ID | Libellé |
|----|---------|
| 1  | Très basse |
| 2  | Basse |
| 3  | Moyenne |
| 4  | Haute |
| 5  | Très haute |
| 6  | Majeure |
