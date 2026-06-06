# Référence SQL - SQLite3

Guide de référence complet des commandes et fonctions SQL pour SQLite3.

## Table des matières

- [Commandes DDL](#commandes-ddl)
- [Commandes DML](#commandes-dml)
- [Fonctions SQL](#fonctions-sql)
- [Opérateurs](#opérateurs)
- [Pragmas](#pragmas)

## Commandes DDL

### CREATE

```sql
-- Créer une table
CREATE TABLE nom_table (colonne1 TYPE, colonne2 TYPE);

-- Créer une table si elle n'existe pas
CREATE TABLE IF NOT EXISTS nom_table (colonne1 TYPE);

-- Créer une table temporaire
CREATE TEMPORARY TABLE nom_table (colonne1 TYPE);

-- Créer un index
CREATE INDEX idx_nom ON table(colonne);

-- Créer un index unique
CREATE UNIQUE INDEX idx_nom ON table(colonne);

-- Créer une vue
CREATE VIEW nom_vue AS SELECT * FROM table WHERE condition;
```

### ALTER

```sql
-- Ajouter une colonne
ALTER TABLE table ADD COLUMN nom_colonne TYPE;

-- Renommer une table
ALTER TABLE ancien_nom RENAME TO nouveau_nom;

-- Renommer une colonne
ALTER TABLE table RENAME COLUMN ancien_nom TO nouveau_nom;
```

### DROP

```sql
-- Supprimer une table
DROP TABLE table;

-- Supprimer une table si elle existe
DROP TABLE IF EXISTS table;

-- Supprimer une vue
DROP VIEW vue;

-- Supprimer un index
DROP INDEX index;
```

## Commandes DML

### SELECT

```sql
-- Sélection simple
SELECT * FROM table;

-- Sélection avec colonnes
SELECT col1, col2 FROM table;

-- Avec clause WHERE
SELECT * FROM table WHERE condition;

-- Avec ORDER BY
SELECT * FROM table ORDER BY colonne ASC|DESC;

-- Avec LIMIT
SELECT * FROM table LIMIT 10;

-- Avec OFFSET
SELECT * FROM table LIMIT 10 OFFSET 20;

-- Avec GROUP BY
SELECT colonne, COUNT(*) FROM table GROUP BY colonne;

-- Avec HAVING
SELECT colonne, COUNT(*) FROM table GROUP BY colonne HAVING COUNT(*) > 5;

-- Avec DISTINCT
SELECT DISTINCT colonne FROM table;

-- Avec JOIN
SELECT * FROM table1 JOIN table2 ON table1.id = table2.id;

-- Avec UNION
SELECT col FROM table1 UNION SELECT col FROM table2;
```

### INSERT

```sql
-- Insertion simple
INSERT INTO table (col1, col2) VALUES (val1, val2);

-- Insertion multiple
INSERT INTO table (col1, col2) VALUES (val1, val2), (val3, val4);

-- Insertion depuis SELECT
INSERT INTO table1 (col1, col2) SELECT col1, col2 FROM table2;
```

### UPDATE

```sql
-- Mise à jour simple
UPDATE table SET colonne = valeur WHERE condition;

-- Mise à jour multiple
UPDATE table SET col1 = val1, col2 = val2 WHERE id = 1;
```

### DELETE

```sql
-- Suppression simple
DELETE FROM table WHERE condition;

-- Supprimer tous les enregistrements
DELETE FROM table;

-- Avec LIMIT
DELETE FROM table WHERE condition LIMIT 10;
```

## Fonctions SQL

### Fonctions de texte

```sql
-- Longueur
LENGTH(texte)
CHAR_LENGTH(texte)

-- Minuscules
LOWER(texte)

-- Majuscules
UPPER(texte)

-- Trim
TRIM(texte)
LTRIM(texte)
RTRIM(texte)

-- Substr
SUBSTR(texte, debut, longueur)

-- Remplacer
REPLACE(texte, recherche, remplacement)

-- Concaténation
texte1 || texte2

-- Instr (position)
INSTR(texte, sous_texte)
```

### Fonctions numériques

```sql
-- Valeur absolue
ABS(nombre)

-- Arrondir
ROUND(nombre, decimales)

-- Plancher
FLOOR(nombre)

-- Plafond
CEIL(nombre)

-- Puissance
POWER(nombre, exposant)

-- Racine carrée
SQRT(nombre)

-- Aléatoire
RANDOM()
ABS(RANDOM() % 100)  -- Nombre entre 0 et 99
```

### Fonctions d'agrégation

```sql
-- Compte
COUNT(*)
COUNT(colonne)
COUNT(DISTINCT colonne)

-- Somme
SUM(colonne)

-- Moyenne
AVG(colonne)

-- Minimum
MIN(colonne)

-- Maximum
MAX(colonne)

-- Groupe concaténé
GROUP_CONCAT(colonne)
GROUP_CONCAT(colonne, ', ')
```

### Fonctions de date et heure

```sql
-- Date actuelle
CURRENT_DATE
DATE('now')

-- Heure actuelle
CURRENT_TIME
TIME('now')

-- Horodatage actuel
CURRENT_TIMESTAMP
DATETIME('now')

-- Manipulations de date
DATE('2024-12-31', '+1 day')
DATE('2024-12-31', '+1 month')
DATE('2024-12-31', '+1 year')
DATE('2024-12-31', '-7 days')

-- Extraction de parties de date
STRFTIME('%Y', date)  -- Année
STRFTIME('%m', date)  -- Mois
STRFTIME('%d', date)  -- Jour
STRFTIME('%H', date)  -- Heure
STRFTIME('%M', date)  -- Minute
STRFTIME('%S', date)  -- Seconde

-- Formatage de date
STRFTIME('%d/%m/%Y', date)
STRFTIME('%d-%m-%Y %H:%M:%S', datetime)
```

### Fonctions conditionnelles

```sql
-- CASE
CASE WHEN condition THEN valeur1 ELSE valeur2 END

-- COALESCE (première non-NULL)
COALESCE(colonne1, colonne2, 'défaut')

-- NULLIF
NULLIF(colonne1, colonne2)

-- IIF (if-then-else)
IIF(condition, valeur_si_vrai, valeur_si_faux)
```

### Fonctions de conversion

```sql
-- Chaîne vers nombre
CAST(chaîne AS INTEGER)
CAST(chaîne AS REAL)

-- Nombre vers chaîne
CAST(nombre AS TEXT)

-- Date vers chaîne
CAST(date AS TEXT)
```

## Opérateurs

### Opérateurs de comparaison

```sql
=       -- Égal
!=      -- Pas égal
<>      -- Pas égal
<       -- Inférieur
>       -- Supérieur
<=      -- Inférieur ou égal
>=      -- Supérieur ou égal
```

### Opérateurs logiques

```sql
AND     -- Et
OR      -- Ou
NOT     -- Non
```

### Opérateurs de texte

```sql
LIKE        -- Correspond au motif
NOT LIKE    -- Ne correspond pas au motif
GLOB        -- Correspond au motif GLOB
NOT GLOB    -- Ne correspond pas au motif GLOB

-- Motifs LIKE
%          -- Zéro ou plus caractères
_          -- Un seul caractère
[abc]      -- Un caractère de a, b ou c
[a-z]      -- Plage de caractères
```

### Opérateurs d'ensemble

```sql
IN          -- Is in list
NOT IN      -- Is not in list
BETWEEN     -- Entre deux valeurs
NOT BETWEEN -- Pas entre deux valeurs
EXISTS      -- Sous-requête retourne au moins une ligne
NOT EXISTS  -- Sous-requête ne retourne pas de ligne
```

## Pragmas

### Configuration

```sql
-- Activer les clés étrangères
PRAGMA foreign_keys = ON;

-- Obtenir la version de SQLite
PRAGMA database_list;

-- Journal de mode
PRAGMA journal_mode = WAL;  -- Write-Ahead Logging

-- Synchronisation
PRAGMA synchronous = NORMAL;

-- Cache size
PRAGMA cache_size = 10000;

-- Timeout
PRAGMA busy_timeout = 5000;
```

### Diagnostic

```sql
-- Vérifier l'intégrité
PRAGMA integrity_check;

-- Analyser la base de données
PRAGMA analyze;

-- Optimiser
PRAGMA optimize;

-- Vaccum
PRAGMA auto_vacuum = FULL;

-- Information de table
PRAGMA table_info(table_name);

-- Information d'index
PRAGMA index_info(index_name);

-- Clés étrangères d'une table
PRAGMA foreign_key_list(table_name);
```

## Commandes utiles

### Informations générales

```sql
-- Tables
SELECT name FROM sqlite_master WHERE type='table';

-- Vues
SELECT name FROM sqlite_master WHERE type='view';

-- Index
SELECT name FROM sqlite_master WHERE type='index';

-- Structure d'une table
PRAGMA table_info(table_name);

-- Clés étrangères
PRAGMA foreign_key_list(table_name);
```

### Backup et export

```bash
# Backup
sqlite3 database.db ".backup '/path/to/backup.db'"

# Export en SQL
sqlite3 database.db ".dump" > database.sql

# Import d'un SQL
sqlite3 database.db < database.sql

# Export en CSV
sqlite3 database.db ".mode csv"
sqlite3 database.db "SELECT * FROM table;" > export.csv

# Export en JSON
sqlite3 database.db ".mode json"
sqlite3 database.db "SELECT * FROM table;" > export.json
```

---

*Pour des exemples pratiques, consultez [requetes_utiles.md](requetes_utiles.md) et [requetes_avancees.md](requetes_avancees.md)*
