# Commandes CLI SQLite3

Guide des commandes en ligne de commande pour SQLite3.

## Table des matières

- [Commandes de base](#commandes-de-base)
- [Commandes Meta](#commandes-meta)
- [Import et Export](#import-et-export)
- [Configuration](#configuration)
- [Scripts et Automation](#scripts-et-automation)

## Commandes de base

### Ouvrir une base de données

```bash
# Ouvrir/créer une base de données
sqlite3 database.db

# Ouvrir en mode lecture seule
sqlite3 -readonly database.db

# Ouvrir en mémoire
sqlite3 :memory:
```

### Exécuter des requêtes

```bash
# Exécuter une requête directement
sqlite3 database.db "SELECT * FROM clients;"

# Exécuter depuis un fichier
sqlite3 database.db < script.sql

# Exécuter et sauvegarder dans un fichier
sqlite3 database.db "SELECT * FROM clients;" > resultat.txt
```

### Mode interactif

```bash
sqlite3 database.db

# Une fois dans le prompt
sqlite> SELECT * FROM clients;
sqlite> .quit
```

## Commandes Meta

Ces commandes commencent par un point (`.`) et ne fonctionnent qu'en mode interactif.

### Information sur la base de données

```bash
# Afficher la version de SQLite
.version

# Afficher les bases de données connectées
.databases

# Afficher la structure d'une table
.schema table_name

# Afficher le schéma complet
.schema

# Afficher les tables
.tables

# Afficher les vues
.views

# Afficher les index
.indexes

# Afficher les trigger
.triggers
```

### Mode d'affichage

```bash
# List mode (défaut)
.mode list

# Column mode
.mode column

# Line mode
.mode line

# CSV mode
.mode csv

# TSV mode
.mode tabs

# JSON mode
.mode json

# HTML mode
.mode html

# SQL mode
.mode sql
```

### En-têtes et séparateurs

```bash
# Afficher les en-têtes de colonnes
.headers on
.headers off

# Définir le séparateur de colonne
.separator |
.separator ","

# Définir les caractères NULL
.nullvalue [NULL]
```

### Affichage et pagination

```bash
# Définir la largeur des colonnes
.width 10 20 15

# Mode page (affichage paginé)
.mode column
.headers on

# Utiliser less pour la pagination (Unix)
.system less
```

## Import et Export

### Export en différents formats

```bash
# Export SQL
sqlite3 database.db ".output dump.sql"
sqlite3 database.db ".dump"

# Export CSV
sqlite3 database.db ".mode csv"
sqlite3 database.db ".output export.csv"
sqlite3 database.db "SELECT * FROM clients;"

# Export JSON
sqlite3 database.db ".mode json"
sqlite3 database.db ".output export.json"
sqlite3 database.db "SELECT * FROM clients;"

# Export TSV
sqlite3 database.db ".mode tabs"
sqlite3 database.db ".output export.tsv"
sqlite3 database.db "SELECT * FROM clients;"

# Fermer le fichier de sortie
sqlite3 database.db ".output stdout"
```

### Import depuis des fichiers

```bash
# Importer un script SQL
sqlite3 database.db < script.sql

# Importer un CSV
sqlite3 database.db ".mode csv"
sqlite3 database.db ".import data.csv table_name"

# Importer depuis stdin
cat data.sql | sqlite3 database.db
```

### Backup et Restore

```bash
# Backup complet
sqlite3 database.db ".backup backup.db"

# Dump SQL complet
sqlite3 database.db ".dump" > backup.sql

# Restore depuis dump SQL
sqlite3 new_database.db < backup.sql

# Restaurer une table spécifique
sqlite3 database.db ".dump table_name" > table_backup.sql
sqlite3 database.db < table_backup.sql
```

## Configuration

### Variables d'environnement

```bash
# Définir le prompt
export SQLITE_TMPDIR=/path/to/temp

# Utiliser dans une variable
sqlite3 $DATABASE_PATH

# Exemple complet
export DB_PATH="./database.db"
sqlite3 $DB_PATH "SELECT * FROM clients;"
```

### Fichier de configuration

```bash
# Créer un fichier .sqliterc dans le home
cat > ~/.sqliterc << 'EOF'
.headers on
.mode column
.separator |
.width 15 15 25 15
.nullvalue [NULL]
EOF

# SQLite3 chargera automatiquement ce fichier
sqlite3 database.db
```

## Scripts et Automation

### Script batch

```bash
#!/bin/bash
# backup.sh

DATABASE="database.db"
BACKUP_DIR="./backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Créer le dossier de backup
mkdir -p $BACKUP_DIR

# Effectuer le backup
sqlite3 $DATABASE ".backup $BACKUP_DIR/backup_$DATE.db"

# Optionnel: nettoyer les anciens backups (plus de 30 jours)
find $BACKUP_DIR -name "backup_*.db" -mtime +30 -delete

echo "Backup terminé: $BACKUP_DIR/backup_$DATE.db"
```

### Exécuter des scripts

```bash
# Exécuter un script SQL
sqlite3 database.db < init.sql

# Exécuter plusieurs scripts
sqlite3 database.db < script1.sql < script2.sql

# Exécuter avec erreurs tolerées
sqlite3 database.db "PRAGMA foreign_keys = OFF;" < script.sql

# Exécuter avec checkpoint
sqlite3 database.db << 'EOF'
BEGIN TRANSACTION;
.read script.sql
COMMIT;
EOF
```

### Cron job pour backup automatique

```bash
# Ajouter à crontab
crontab -e

# Backup quotidien à 2h du matin
0 2 * * * /path/to/backup.sh

# Backup hebdomadaire
0 3 * * 0 sqlite3 /path/to/database.db ".backup /path/to/backups/weekly_$(date +\%Y\%m\%d).db"
```

## Commandes utiles avancées

### Diagnostiquer les problèmes

```bash
# Vérifier l'intégrité de la base de données
sqlite3 database.db "PRAGMA integrity_check;"

# Obtenir les informations de base
sqlite3 database.db "PRAGMA database_list;"

# Vérifier les pages d'erreur
sqlite3 database.db "PRAGMA freelist_count;"

# Analyser la fragmentation
sqlite3 database.db "PRAGMA page_count; PRAGMA freelist_count;"
```

### Optimisation

```bash
# Analyser et optimiser
sqlite3 database.db "ANALYZE; PRAGMA optimize;"

# Vacuum complet
sqlite3 database.db "VACUUM;"

# Vacuum dans une base comprimée
sqlite3 database.db "VACUUM INTO 'compressed.db';"
```

### Statistiques

```bash
# Afficher les statistiques de table
sqlite3 database.db << 'EOF'
SELECT 
  name,
  SUM(pgsize) as total_pages
FROM dbstat
GROUP BY name;
EOF

# Examiner l'utilisation d'espace
sqlite3 database.db "PRAGMA page_count; PRAGMA page_size;"
```

### Exemples pratiques

```bash
# Obtenir le nombre de lignes par table
sqlite3 database.db << 'EOF'
.mode column
.headers on
SELECT name, COUNT(*) as rows 
FROM sqlite_master sm
LEFT JOIN (SELECT name FROM sqlite_master WHERE type='table') t ON sm.name = t.name
WHERE type='table'
GROUP BY name;
EOF

# Exporter toutes les tables en CSV séparé
sqlite3 database.db << 'EOF'
.mode csv
.tables |
EOF

for table in $(sqlite3 database.db ".tables"); do
  sqlite3 database.db ".mode csv" "SELECT * FROM $table;" > "${table}.csv"
done

# Comparer deux bases de données
diff <(sqlite3 db1.db ".dump") <(sqlite3 db2.db ".dump")
```

---

*Pour plus d'informations sur SQLite3, consultez la [référence SQL](reference_sql.md) et les [meilleures pratiques](meilleures_pratiques.md).*
