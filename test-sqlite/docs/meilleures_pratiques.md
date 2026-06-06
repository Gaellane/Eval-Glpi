# Meilleures Pratiques et Conseils - SQLite3

Guide des meilleures pratiques pour maximer les performances et la sécurité avec SQLite3.

## Table des matières

- [Performances](#performances)
- [Sécurité](#sécurité)
- [Structure de base de données](#structure-de-base-de-données)
- [Debugging](#debugging)
- [Erreurs courantes](#erreurs-courantes)

## Performances

### Utiliser les index

```sql
-- Créer des index sur les colonnes fréquemment recherchées
CREATE INDEX idx_clients_email ON clients(email);

-- Index composé
CREATE INDEX idx_commandes_client_date 
ON commandes(client_id, date_commande);

-- Index unique pour les contraintes UNIQUE
CREATE UNIQUE INDEX idx_email ON users(email);
```

### Requêtes EXPLAIN

```sql
-- Analyser un plan de requête
EXPLAIN QUERY PLAN SELECT * FROM clients WHERE email = 'test@example.com';

-- Affiche comment SQLite exécute la requête
-- Aide à identifier les imprécisions dans l'indexation
```

### Batch operations

```sql
-- Au lieu de plusieurs INSERT individuels
INSERT INTO table1 (col1, col2) VALUES
  (val1, val2),
  (val3, val4),
  (val5, val6),
  (val7, val8);

-- À la place de:
-- INSERT INTO table1 (col1, col2) VALUES (val1, val2);
-- INSERT INTO table1 (col1, col2) VALUES (val3, val4);
```

### Transactions pour les opérations en masse

```sql
-- Encapsuler les opérations dans une transaction
BEGIN TRANSACTION;
  INSERT INTO table1 SELECT * FROM staging_table;
  UPDATE table2 SET status = 'processed';
  DELETE FROM staging_table;
COMMIT;

-- Plus rapide que d'exécuter chaque opération séparément
```

### Pragma pour les performances

```sql
-- Augmenter la taille du cache
PRAGMA cache_size = 10000;

-- Utiliser WAL (Write-Ahead Logging) pour les lectures concurrentes
PRAGMA journal_mode = WAL;

-- Synchronisation normale (par défaut: FULL)
PRAGMA synchronous = NORMAL;

-- Désactiver la synchronisation pendant l'import (DANGER!)
PRAGMA synchronous = OFF;
PRAGMA foreign_keys = OFF;

-- Réactiver après l'import
PRAGMA synchronous = NORMAL;
PRAGMA foreign_keys = ON;
```

## Sécurité

### Utiliser des requêtes paramétrées

```sql
-- ❌ MAUVAIS - Injection SQL possible
SELECT * FROM users WHERE email = '" + email + "';

-- ✅ BON - Utiliser les paramètres
SELECT * FROM users WHERE email = ?;
SELECT * FROM users WHERE email = :email;
```

### Exemple en Python

```python
import sqlite3

conn = sqlite3.connect('database.db')
cursor = conn.cursor()

# ✅ BON
email = "test@example.com"
cursor.execute('SELECT * FROM users WHERE email = ?', (email,))

# ✅ BON avec nommage
cursor.execute('SELECT * FROM users WHERE email = :email', {'email': email})

# ❌ MAUVAIS
# cursor.execute(f'SELECT * FROM users WHERE email = "{email}"')
```

### Activer les clés étrangères

```sql
-- Activer à la connexion
PRAGMA foreign_keys = ON;

-- Vérifier que c'est activé
PRAGMA foreign_keys;  -- Retourne 1 si activé
```

### Chiffrement

```sql
-- SQLite standard ne supporte pas le chiffrement natif
-- Utiliser sqlite3-python avec la bibliothèque cryptography
-- Ou utiliser SQLCipher pour le chiffrement entier de la BD

-- Exemple avec SQLCipher (ligne de commande)
sqlcipher database.db
sqlite> PRAGMA key = 'password';
sqlite> CREATE TABLE test (id INTEGER, data TEXT);
```

## Structure de base de données

### Conventions de nommage

```sql
-- ✅ BON
CREATE TABLE clients (
  client_id INTEGER PRIMARY KEY AUTOINCREMENT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email_address TEXT UNIQUE
);

-- Conventions:
-- - Tables au singulier ou pluriel (cohérent)
-- - Colonnes en snake_case
-- - Suffixes: _id pour les clés, _date/_time pour les dates/heures
-- - Noms descriptifs
```

### Schema complet exemple

```sql
CREATE TABLE clients (
  client_id INTEGER PRIMARY KEY AUTOINCREMENT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE commandes (
  order_id INTEGER PRIMARY KEY AUTOINCREMENT,
  client_id INTEGER NOT NULL,
  order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  total_amount REAL NOT NULL,
  status TEXT DEFAULT 'pending',
  FOREIGN KEY (client_id) REFERENCES clients(client_id)
);

CREATE TABLE produits (
  product_id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  price REAL NOT NULL CHECK(price > 0),
  stock INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
  order_item_id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL CHECK(quantity > 0),
  unit_price REAL NOT NULL,
  FOREIGN KEY (order_id) REFERENCES commandes(order_id),
  FOREIGN KEY (product_id) REFERENCES produits(product_id)
);

-- Créer des index pour les recherches fréquentes
CREATE INDEX idx_clients_email ON clients(email);
CREATE INDEX idx_orders_customer ON commandes(client_id);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);
```

### Normalisation

- **1NF**: Chaque colonne contient une valeur atomique
- **2NF**: Toutes les colonnes non-clés dépendent entièrement de la clé primaire
- **3NF**: Aucune dépendance transitive entre colonnes non-clés

## Debugging

### Afficher les requêtes SQL

```sql
-- Activer le logging
PRAGMA vdbe_trace = ON;

-- Obtenir les plans de requête
EXPLAIN SELECT * FROM table;
EXPLAIN QUERY PLAN SELECT * FROM table;
```

### Vérifier les erreurs

```python
import sqlite3

try:
    conn = sqlite3.connect(':memory:')
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM nonexistent_table')
except sqlite3.OperationalError as e:
    print(f"Erreur: {e}")
finally:
    conn.close()
```

### Analyser la performance

```bash
# Afficher les statistiques de requête
sqlite3 database.db "EXPLAIN QUERY PLAN SELECT * FROM clients WHERE email = ?;"

# Utiliser ANALYZE pour optimiser
sqlite3 database.db "ANALYZE;"
```

## Erreurs courantes

### 1. Oublier la clé étrangère

```sql
-- ❌ MAUVAIS - Insertion échouera
INSERT INTO commandes (client_id) VALUES (999);

-- ✅ BON - Vérifier que le client existe
SELECT * FROM clients WHERE client_id = 999;
INSERT INTO commandes (client_id) VALUES (999);
```

### 2. Oublier WHERE dans UPDATE/DELETE

```sql
-- ❌ DANGEREUX - Met à jour TOUTES les lignes
UPDATE clients SET status = 'inactive';

-- ✅ BON - Cibler spécifiquement
UPDATE clients SET status = 'inactive' WHERE created_at < '2020-01-01';
```

### 3. Type de données incorrect

```sql
-- ❌ MAUVAIS
CREATE TABLE produits (
  price TEXT  -- Devrait être REAL
);

-- ✅ BON
CREATE TABLE produits (
  price REAL NOT NULL CHECK(price > 0)
);
```

### 4. Pas d'index sur les colonnes JOIN

```sql
-- ❌ LENT - Pas d'index
CREATE TABLE commandes (order_id INTEGER, client_id INTEGER);

-- ✅ RAPIDE - Index présent
CREATE INDEX idx_orders_client ON commandes(client_id);
```

### 5. GROUP BY sans agrégation

```sql
-- ❌ DANGEREUX - Résultats imprévisibles
SELECT client_id, email FROM clients GROUP BY client_id;

-- ✅ BON - Inclure toutes les colonnes non-groupées dans agrégation
SELECT client_id, MIN(email) FROM clients GROUP BY client_id;
```

---

*Pour d'autres ressources, consultez les autres fichiers de documentation.*
