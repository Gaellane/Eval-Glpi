# 🖥️ GLPI GraphQL — Module Parc (Assets)

> **Endpoint :** `POST http://localhost:8081/api.php/GraphQL`
> **Header :** `Authorization: Bearer VOTRE_TOKEN`
> **Header :** `Content-Type: application/json`

---

## 💻 ORDINATEURS (Computer)

### 1. Lister tous les ordinateurs

```json
{
  "query": "query { Computer { id name serial otherserial } }"
}
```

### 2. Ordinateurs avec détails complets

```json
{
  "query": "query { Computer { id name serial otherserial uuid comment date_creation date_mod } }"
}
```

### 3. Rechercher un ordinateur par nom

```json
{
  "query": "query { Computer(filter: \"name=ilike=srv\") { id name serial otherserial } }"
}
```

### 4. Ordinateurs sans numéro de série

```json
{
  "query": "query { Computer(filter: \"serial=isnull=\") { id name } }"
}
```

### 5. Introspection — champs disponibles pour Computer

```json
{
  "query": "query { __type(name: \"Computer\") { name fields { name description type { name kind ofType { name kind } } } } }"
}
```

---

## 📱 TÉLÉPHONES (Phone)

### 6. Lister tous les téléphones

```json
{
  "query": "query { Phone { id name serial otherserial comment } }"
}
```

### 7. Rechercher un téléphone par nom

```json
{
  "query": "query { Phone(filter: \"name=ilike=iphone\") { id name serial } }"
}
```

---

## 🖨️ IMPRIMANTES (Printer)

### 8. Lister toutes les imprimantes

```json
{
  "query": "query { Printer { id name serial otherserial have_usb have_ethernet comment } }"
}
```

### 9. Imprimantes avec port réseau

```json
{
  "query": "query { Printer(filter: \"have_ethernet==1\") { id name serial } }"
}
```

---

## 🔌 ÉQUIPEMENTS RÉSEAU (NetworkEquipment)

### 10. Lister les équipements réseau

```json
{
  "query": "query { NetworkEquipment { id name serial otherserial comment } }"
}
```

### 11. Rechercher par nom

```json
{
  "query": "query { NetworkEquipment(filter: \"name=ilike=switch\") { id name serial } }"
}
```

---

## 📺 MONITEURS (Monitor)

### 12. Lister tous les moniteurs

```json
{
  "query": "query { Monitor { id name serial otherserial comment } }"
}
```

---

## 💾 LOGICIELS (Software)

### 13. Lister tous les logiciels

```json
{
  "query": "query { Software { id name comment } }"
}
```

### 14. Rechercher un logiciel par nom

```json
{
  "query": "query { Software(filter: \"name=ilike=office\") { id name comment } }"
}
```

---

## 🖥️ ÉCRANS & PÉRIPHÉRIQUES (Peripheral)

### 15. Lister tous les périphériques

```json
{
  "query": "query { Peripheral { id name serial otherserial comment } }"
}
```

---

## 📦 CARTOUCHES (CartridgeItem)

### 16. Lister les modèles de cartouches avec imprimantes associées

```json
{
  "query": "query { CartridgeItem { id name printer_models { name product_number } } }"
}
```

---

## 🔍 Filtres utiles pour le Parc

| Besoin | Filtre RSQL |
|--------|------------|
| Par nom exact | `name==MonPC` |
| Contient | `name=ilike=srv` |
| Par numéro de série | `serial==SN123456` |
| Sans série | `serial=isnull=` |
| Plusieurs noms | `name=in=(PC01,PC02,PC03)` |
| Créé après une date | `date_creation=gt=2024-01-01` |

---

## 📋 Pagination et tri

```json
{
  "query": "query { Computer(limit: 50, offset: 0, sort: \"name\", order: \"ASC\") { id name serial } }"
}
```
