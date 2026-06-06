# Requêtes Avancées - SQLite3

Ce document couvre les requêtes SQL avancées et les techniques d'optimisation pour SQLite3.

## Table des matières

- [Jointures](#jointures)
- [Sous-requêtes](#sous-requêtes)
- [Expressions conditionnelles](#expressions-conditionnelles)
- [Fonctions de fenêtre](#fonctions-de-fenêtre)
- [CTE (Common Table Expressions)](#cte--common-table-expressions)
- [Union et Intersect](#union-et-intersect)

## Jointures

### INNER JOIN

Retourne les enregistrements qui ont des correspondances dans les deux tables.

```sql
SELECT t1.colonne1, t2.colonne2
FROM table1 t1
INNER JOIN table2 t2 ON t1.id = t2.table1_id;
```

### LEFT JOIN

Retourne tous les enregistrements de la table gauche et les correspondances de la table droite.

```sql
SELECT t1.colonne1, t2.colonne2
FROM table1 t1
LEFT JOIN table2 t2 ON t1.id = t2.table1_id;
```

### RIGHT JOIN

Retourne tous les enregistrements de la table droite (Note: SQLite3 n'a pas RIGHT JOIN natif, utiliser LEFT JOIN inversé).

```sql
SELECT t2.colonne2, t1.colonne1
FROM table2 t2
LEFT JOIN table1 t1 ON t1.id = t2.table1_id;
```

### FULL OUTER JOIN

```sql
SELECT t1.colonne1, t2.colonne2
FROM table1 t1
FULL OUTER JOIN table2 t2 ON t1.id = t2.table1_id;
```

### Jointure sur plusieurs colonnes

```sql
SELECT *
FROM table1 t1
INNER JOIN table2 t2 
  ON t1.id = t2.id AND t1.date = t2.date;
```

### Self Join

```sql
SELECT e1.nom, e2.nom
FROM employes e1
JOIN employes e2 ON e1.manager_id = e2.id;
```

## Sous-requêtes

### Sous-requête SELECT

```sql
SELECT * FROM table1
WHERE id IN (SELECT table1_id FROM table2 WHERE condition = true);
```

### Sous-requête avec agrégation

```sql
SELECT * FROM table1
WHERE prix > (SELECT AVG(prix) FROM table1);
```

### Sous-requête corrélée

```sql
SELECT * FROM table1 t1
WHERE EXISTS (
  SELECT 1 FROM table2 t2 
  WHERE t2.table1_id = t1.id
);
```

### Sous-requête dans FROM

```sql
SELECT *
FROM (
  SELECT colonne1, COUNT(*) as compte
  FROM table1
  GROUP BY colonne1
) sous_requete
WHERE compte > 10;
```

## Expressions conditionnelles

### CASE

```sql
SELECT 
  nom,
  CASE 
    WHEN age < 18 THEN 'Mineur'
    WHEN age >= 18 AND age < 65 THEN 'Adulte'
    ELSE 'Senior'
  END as categorie
FROM personnes;
```

### COALESCE

Retourne la première valeur non-NULL.

```sql
SELECT COALESCE(colonne1, colonne2, 'valeur_par_defaut')
FROM table1;
```

### NULLIF

Retourne NULL si les deux expressions sont égales.

```sql
SELECT NULLIF(colonne1, colonne2)
FROM table1;
```

## Fonctions de fenêtre

### ROW_NUMBER

```sql
SELECT 
  colonne1,
  ROW_NUMBER() OVER (ORDER BY colonne1) as ligne_num
FROM table1;
```

### RANK

```sql
SELECT 
  colonne1,
  RANK() OVER (PARTITION BY colonne2 ORDER BY colonne1) as rang
FROM table1;
```

### LAG et LEAD

```sql
SELECT 
  colonne1,
  LAG(colonne1) OVER (ORDER BY id) as valeur_precedente,
  LEAD(colonne1) OVER (ORDER BY id) as valeur_suivante
FROM table1;
```

## CTE (Common Table Expressions)

### CTE simple

```sql
WITH employes_cte AS (
  SELECT * FROM employes WHERE actif = 1
)
SELECT * FROM employes_cte WHERE salaire > 50000;
```

### CTE récursive

```sql
WITH RECURSIVE compte AS (
  SELECT 1 as n
  UNION ALL
  SELECT n + 1 FROM compte WHERE n < 10
)
SELECT * FROM compte;
```

### CTE multiple

```sql
WITH 
  employes_actifs AS (
    SELECT * FROM employes WHERE actif = 1
  ),
  hauts_salaires AS (
    SELECT * FROM employes_actifs WHERE salaire > 80000
  )
SELECT * FROM hauts_salaires;
```

## Union et Intersect

### UNION

Combine les résultats de deux requêtes (supprime les doublons).

```sql
SELECT nom FROM clients
UNION
SELECT nom FROM fournisseurs;
```

### UNION ALL

Combine les résultats avec les doublons.

```sql
SELECT nom FROM clients
UNION ALL
SELECT nom FROM fournisseurs;
```

### INTERSECT

Retourne les lignes communes.

```sql
SELECT id FROM table1
INTERSECT
SELECT table1_id FROM table2;
```

### EXCEPT

Retourne les lignes de la première requête qui ne sont pas dans la deuxième.

```sql
SELECT id FROM table1
EXCEPT
SELECT table1_id FROM table2;
```

---

*Pour d'autres requêtes, consultez [requetes_utiles.md](requetes_utiles.md) et [reference_sql.md](reference_sql.md)*
