# Gestion des Données - SQLite3

Ce document couvre la création, la modification et la suppression de tables et de données en SQLite3.

## Table des matières

- [Création de tables](#création-de-tables)
- [Types de données](#types-de-données)
- [Contraintes](#contraintes)
- [Modification de tables](#modification-de-tables)
- [Suppression de tables](#suppression-de-tables)
- [Gestion des transactions](#gestion-des-transactions)

## Création de tables

### Créer une table simple

```sql
CREATE TABLE clients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nom TEXT NOT NULL,
  email TEXT UNIQUE,
  telephone TEXT,
  date_inscription DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Créer une table avec clé étrangère

```sql
CREATE TABLE commandes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  client_id INTEGER NOT NULL,
  date_commande DATETIME DEFAULT CURRENT_TIMESTAMP,
  total REAL NOT NULL,
  FOREIGN KEY (client_id) REFERENCES clients(id)
);
```

### Créer une table avec index

```sql
CREATE TABLE produits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nom TEXT NOT NULL,
  prix REAL NOT NULL,
  stock INTEGER DEFAULT 0
);

CREATE INDEX idx_nom_produit ON produits(nom);
```

### Créer une table temporaire

```sql
CREATE TEMPORARY TABLE temp_data (
  id INTEGER,
  valeur TEXT
);
```

### Créer une table si elle n'existe pas

```sql
CREATE TABLE IF NOT EXISTS clients (
  id INTEGER PRIMARY KEY,
  nom TEXT
);
```

## Types de données

### Les principaux types de données en SQLite3

| Type | Description |
|------|-------------|
| NULL | Valeur NULL |
| INTEGER | Nombre entier |
| REAL | Nombre à virgule flottante |
| TEXT | Chaîne de caractères |
| BLOB | Données binaires |
| NUMERIC | Nombre numérique |
| BOOLEAN | Booléen (stocké comme 0/1) |

### Exemples d'utilisation

```sql
CREATE TABLE exemples (
  id INTEGER,
  nom TEXT,
  prix REAL,
  quantite INTEGER,
  active BOOLEAN,
  donnees_binaires BLOB,
  date DATE,
  heure TIME,
  horodatage TIMESTAMP
);
```

## Contraintes

### PRIMARY KEY

```sql
CREATE TABLE table1 (
  id INTEGER PRIMARY KEY,
  nom TEXT
);
```

### UNIQUE

```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  nom TEXT
);
```

### NOT NULL

```sql
CREATE TABLE commandes (
  id INTEGER PRIMARY KEY,
  client_id INTEGER NOT NULL,
  montant REAL NOT NULL
);
```

### DEFAULT

```sql
CREATE TABLE employes (
  id INTEGER PRIMARY KEY,
  nom TEXT NOT NULL,
  date_embauche DATE DEFAULT CURRENT_DATE,
  actif BOOLEAN DEFAULT 1
);
```

### CHECK

```sql
CREATE TABLE produits (
  id INTEGER PRIMARY KEY,
  nom TEXT NOT NULL,
  prix REAL CHECK(prix > 0),
  quantite INTEGER CHECK(quantite >= 0)
);
```

### FOREIGN KEY

```sql
CREATE TABLE commande_details (
  id INTEGER PRIMARY KEY,
  commande_id INTEGER NOT NULL,
  produit_id INTEGER NOT NULL,
  quantite INTEGER,
  FOREIGN KEY (commande_id) REFERENCES commandes(id),
  FOREIGN KEY (produit_id) REFERENCES produits(id)
);
```

## Modification de tables

### Ajouter une colonne

```sql
ALTER TABLE clients
ADD COLUMN adresse TEXT;

ALTER TABLE clients
ADD COLUMN ville TEXT DEFAULT 'Non spécifiée';
```

### Renommer une table

```sql
ALTER TABLE anciens_clients RENAME TO clients_archives;
```

### Renommer une colonne

```sql
ALTER TABLE clients
RENAME COLUMN telephone TO phone;
```

### Modifier une colonne

```sql
-- Note: SQLite3 a des limitations pour la modification des colonnes
-- Solution: Recréer la table avec la nouvelle structure

-- Ajouter une contrainte via une nouvelle table
CREATE TABLE clients_new (
  id INTEGER PRIMARY KEY,
  nom TEXT NOT NULL,
  email TEXT
);

INSERT INTO clients_new SELECT id, nom, email FROM clients;
DROP TABLE clients;
ALTER TABLE clients_new RENAME TO clients;
```

### Supprimer une colonne

```sql
-- SQLite3 ne supporte pas directement DROP COLUMN
-- Solution: Recréer la table sans la colonne

CREATE TABLE clients_new (
  id INTEGER PRIMARY KEY,
  nom TEXT,
  email TEXT
);

INSERT INTO clients_new (id, nom, email) 
SELECT id, nom, email FROM clients;

DROP TABLE clients;
ALTER TABLE clients_new RENAME TO clients;
```

## Suppression de tables

### Supprimer une table

```sql
DROP TABLE clients;
```

### Supprimer une table si elle existe

```sql
DROP TABLE IF EXISTS clients;
```

### Supprimer avec CASCADE

```sql
-- Les contraintes FOREIGN KEY avec CASCADE sont activées
DROP TABLE clients;
```

## Gestion des transactions

### Démarrer une transaction

```sql
BEGIN TRANSACTION;

INSERT INTO comptes (id, balance) VALUES (1, 1000);
INSERT INTO comptes (id, balance) VALUES (2, 500);

COMMIT;
```

### Valider une transaction

```sql
BEGIN;
  UPDATE comptes SET balance = balance - 100 WHERE id = 1;
  UPDATE comptes SET balance = balance + 100 WHERE id = 2;
COMMIT;
```

### Annuler une transaction

```sql
BEGIN;
  DELETE FROM clients WHERE id = 999;
ROLLBACK;  -- Les changements sont annulés
```

### Savepoint

```sql
BEGIN;
  INSERT INTO table1 VALUES (1);
  SAVEPOINT sp1;
  
  INSERT INTO table2 VALUES (2);
  ROLLBACK TO SAVEPOINT sp1;  -- Annule l'insert dans table2
  
  INSERT INTO table2 VALUES (3);
COMMIT;
```

### Mode d'auto-commit

```sql
-- Désactiver l'auto-commit
PRAGMA foreign_keys = ON;

-- Les transactions commencent automatiquement
BEGIN;
  -- Opérations multiples
COMMIT;
```

## Optimisation et maintenance

### Analyser la base de données

```sql
ANALYZE;
```

### Optimiser la base de données

```sql
PRAGMA optimize;
```

### Vacuum

```sql
VACUUM;
```

### Vérifier l'intégrité

```sql
PRAGMA integrity_check;
```

---

*Pour les requêtes de manipulation de données, consultez [requetes_utiles.md](requetes_utiles.md)*
