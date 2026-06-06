# Requêtes SQL Utiles - SQLite3

Ce document présente les requêtes SQL les plus courantes et utiles pour SQLite3.

## Table des matières

- [Requêtes SELECT](#requêtes-select)
- [Requêtes INSERT](#requêtes-insert)
- [Requêtes UPDATE](#requêtes-update)
- [Requêtes DELETE](#requêtes-delete)
- [Requêtes d'agrégation](#requêtes-dagrégation)

## Requêtes SELECT

### Sélectionner tous les enregistrements

```sql
SELECT * FROM nom_table;
```

### Sélectionner des colonnes spécifiques

```sql
SELECT colonne1, colonne2 FROM nom_table;
```

### Sélectionner avec condition

```sql
SELECT * FROM nom_table WHERE colonne1 = 'valeur';
```

### Sélectionner avec plusieurs conditions (ET)

```sql
SELECT * FROM nom_table 
WHERE colonne1 = 'valeur1' AND colonne2 = 'valeur2';
```

### Sélectionner avec plusieurs conditions (OU)

```sql
SELECT * FROM nom_table 
WHERE colonne1 = 'valeur1' OR colonne2 = 'valeur2';
```

### Trier les résultats

```sql
-- Tri ascendant
SELECT * FROM nom_table ORDER BY colonne1 ASC;

-- Tri descendant
SELECT * FROM nom_table ORDER BY colonne1 DESC;
```

### Limiter le nombre de résultats

```sql
SELECT * FROM nom_table LIMIT 10;

-- Avec offset
SELECT * FROM nom_table LIMIT 10 OFFSET 20;
```

### Recherche avec LIKE

```sql
-- Contient 'texte'
SELECT * FROM nom_table WHERE colonne1 LIKE '%texte%';

-- Commence par 'texte'
SELECT * FROM nom_table WHERE colonne1 LIKE 'texte%';

-- Se termine par 'texte'
SELECT * FROM nom_table WHERE colonne1 LIKE '%texte';
```

### Vérifier si une valeur est NULL

```sql
SELECT * FROM nom_table WHERE colonne1 IS NULL;
SELECT * FROM nom_table WHERE colonne1 IS NOT NULL;
```

## Requêtes INSERT

### Insérer un enregistrement

```sql
INSERT INTO nom_table (colonne1, colonne2, colonne3)
VALUES ('valeur1', 'valeur2', 'valeur3');
```

### Insérer plusieurs enregistrements

```sql
INSERT INTO nom_table (colonne1, colonne2)
VALUES 
  ('valeur1', 'valeur2'),
  ('valeur3', 'valeur4'),
  ('valeur5', 'valeur6');
```

### Insérer avec SELECT

```sql
INSERT INTO nom_table1 (colonne1, colonne2)
SELECT colonne1, colonne2 FROM nom_table2;
```

## Requêtes UPDATE

### Mettre à jour un enregistrement

```sql
UPDATE nom_table 
SET colonne1 = 'nouvelle_valeur' 
WHERE id = 1;
```

### Mettre à jour plusieurs colonnes

```sql
UPDATE nom_table 
SET colonne1 = 'valeur1', colonne2 = 'valeur2' 
WHERE id = 1;
```

### Mettre à jour avec condition

```sql
UPDATE nom_table 
SET colonne1 = 'nouvelle_valeur' 
WHERE colonne2 = 'valeur';
```

## Requêtes DELETE

### Supprimer un enregistrement

```sql
DELETE FROM nom_table WHERE id = 1;
```

### Supprimer avec condition

```sql
DELETE FROM nom_table WHERE colonne1 = 'valeur';
```

### Supprimer tous les enregistrements

```sql
DELETE FROM nom_table;
```

## Requêtes d'agrégation

### Compter les enregistrements

```sql
SELECT COUNT(*) FROM nom_table;

-- Avec alias
SELECT COUNT(*) as total FROM nom_table;
```

### Compter les valeurs non NULL

```sql
SELECT COUNT(colonne1) FROM nom_table;
```

### Somme des valeurs

```sql
SELECT SUM(colonne1) FROM nom_table;
```

### Valeur moyenne

```sql
SELECT AVG(colonne1) FROM nom_table;
```

### Valeur minimale

```sql
SELECT MIN(colonne1) FROM nom_table;
```

### Valeur maximale

```sql
SELECT MAX(colonne1) FROM nom_table;
```

### Grouper les résultats

```sql
SELECT colonne1, COUNT(*) as nombre 
FROM nom_table 
GROUP BY colonne1;
```

### Grouper avec condition

```sql
SELECT colonne1, COUNT(*) as nombre 
FROM nom_table 
GROUP BY colonne1 
HAVING COUNT(*) > 5;
```

---

*Pour les requêtes plus avancées, consultez [requetes_avancees.md](requetes_avancees.md)*
