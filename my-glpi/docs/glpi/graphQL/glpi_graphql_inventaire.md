# 📦 GLPI GraphQL — Module Inventaire

> **Endpoint :** `POST http://localhost:8081/api.php/GraphQL`
> **Header :** `Authorization: Bearer VOTRE_TOKEN`
> **Header :** `Content-Type: application/json`

---

## 🏢 ENTITÉS (Entity)

### 1. Lister toutes les entités

```json
{
  "query": "query { Entity { id name comment } }"
}
```

### 2. Rechercher une entité par nom

```json
{
  "query": "query { Entity(filter: \"name=ilike=siege\") { id name comment } }"
}
```

---

## 📍 LOCALISATIONS (Location)

### 3. Lister toutes les localisations

```json
{
  "query": "query { Location { id name comment } }"
}
```

### 4. Rechercher une localisation

```json
{
  "query": "query { Location(filter: \"name=ilike=bureau\") { id name comment } }"
}
```

---

## 👤 UTILISATEURS (User)

### 5. Lister tous les utilisateurs

```json
{
  "query": "query { User { id name firstname realname } }"
}
```

### 6. Utilisateurs avec email

```json
{
  "query": "query { User { id name firstname realname emails { email } } }"
}
```

### 7. Rechercher un utilisateur par nom

```json
{
  "query": "query { User(filter: \"name=ilike=dupont\") { id name firstname realname emails { email } } }"
}
```

### 8. Utilisateurs actifs (non supprimés)

```json
{
  "query": "query { User(filter: \"is_deleted==0\") { id name firstname realname } }"
}
```

---

## 👥 GROUPES (Group)

### 9. Lister tous les groupes

```json
{
  "query": "query { Group { id name comment } }"
}
```

### 10. Rechercher un groupe

```json
{
  "query": "query { Group(filter: \"name=ilike=support\") { id name comment } }"
}
```

---

## 🏷️ FOURNISSEURS (Supplier)

### 11. Lister tous les fournisseurs

```json
{
  "query": "query { Supplier { id name comment } }"
}
```

### 12. Rechercher un fournisseur

```json
{
  "query": "query { Supplier(filter: \"name=ilike=dell\") { id name comment } }"
}
```

---

## 📂 CATÉGORIES ITIL (ITILCategory)

### 13. Lister toutes les catégories ITIL

```json
{
  "query": "query { ITILCategory { id name comment } }"
}
```

---

## 🔄 ÉTATS (State)

### 14. Lister tous les états d'inventaire

```json
{
  "query": "query { State { id name comment } }"
}
```

> États typiques : En production, En stock, En réparation, Mis au rebut...

---

## 🏭 FABRICANTS (Manufacturer)

### 15. Lister tous les fabricants

```json
{
  "query": "query { Manufacturer { id name comment } }"
}
```

---

## 📋 MODÈLES (par type d'équipement)

### 16. Modèles d'ordinateurs

```json
{
  "query": "query { ComputerModel { id name comment product_number } }"
}
```

### 17. Modèles d'imprimantes

```json
{
  "query": "query { PrinterModel { id name comment product_number } }"
}
```

### 18. Modèles de téléphones

```json
{
  "query": "query { PhoneModel { id name comment product_number } }"
}
```

---

## 🔎 INTROSPECTION — Explorer les types disponibles

### 19. Lister tous les types du schéma GLPI

```json
{
  "query": "query { __schema { types { name kind description } } }"
}
```

### 20. Détail d'un type spécifique (ex: User)

```json
{
  "query": "query { __type(name: \"User\") { name fields { name description type { name kind ofType { name kind } } } } }"
}
```

### 21. Détail du type Location

```json
{
  "query": "query { __type(name: \"Location\") { name fields { name description type { name kind ofType { name kind } } } } }"
}
```

---

## 🔗 Requêtes croisées (relations entre objets)

### 22. Ordinateurs avec leur localisation et état

```json
{
  "query": "query { Computer { id name serial } }"
}
```

> 💡 Pour les relations (localisation, état, utilisateur), utilisez `__type` pour découvrir
> les champs imbriqués disponibles sur chaque objet, puis ajoutez-les à votre requête.

---

## 📊 Exemples de combinaisons filtres + pagination

```json
{
  "query": "query { User(limit: 25, offset: 0, sort: \"name\", order: \"ASC\", filter: \"is_deleted==0\") { id name firstname realname } }"
}
```

```json
{
  "query": "query { Supplier(limit: 10, sort: \"name\", order: \"ASC\") { id name comment } }"
}
```

---

## 📝 Mémo opérateurs RSQL

| Opérateur | Description | Exemple |
|-----------|-------------|---------|
| `==` | Égal | `id==5` |
| `!=` | Différent | `is_deleted!=1` |
| `=ilike=` | Contient (insensible casse) | `name=ilike=test` |
| `=in=` | Dans une liste | `id=in=(1,2,3)` |
| `=out=` | Pas dans la liste | `status=out=(5,6)` |
| `=gt=` | Supérieur à | `id=gt=100` |
| `=lt=` | Inférieur à | `id=lt=50` |
| `=isnull=` | Est null | `serial=isnull=` |
| `=isnotnull=` | N'est pas null | `serial=isnotnull=` |
