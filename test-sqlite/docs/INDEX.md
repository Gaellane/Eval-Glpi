# Index de la Documentation SQLite3

Bienvenue! Cette page d'index vous guide vers les ressources appropriées selon vos besoins.

## 🎯 Commencer rapidement

Si vous débutez avec SQLite3:

1. **[README.md](README.md)** - Vue d'ensemble et introduction à SQLite3
2. **[requetes_utiles.md](requetes_utiles.md)** - Les requêtes essentielles pour commencer
3. **[commandes_cli.md](commandes_cli.md)** - Comment utiliser SQLite3 en ligne de commande

## 📚 Ressources par sujet

### Requêtes SQL

- **[Requêtes Utiles](requetes_utiles.md)** - Les requêtes les plus courantes
  - SELECT, INSERT, UPDATE, DELETE
  - Filters, Sorting, Aggregation
  - Conditions et recherches

- **[Requêtes Avancées](requetes_avancees.md)** - Requêtes complexes
  - Jointures (INNER, LEFT, FULL)
  - Sous-requêtes et CTE
  - Fonctions de fenêtre
  - UNION, INTERSECT, EXCEPT

- **[Référence SQL](reference_sql.md)** - Guide de référence complet
  - Toutes les commandes DDL, DML
  - Toutes les fonctions SQL
  - Opérateurs et pragmas

### Gestion de la Base de Données

- **[Gestion des Données](gestion_donnees.md)** - Structure et organisation
  - Création et modification de tables
  - Types de données
  - Contraintes et clés étrangères
  - Transactions

- **[Meilleures Pratiques](meilleures_pratiques.md)** - Conseils et optimisation
  - Performance et index
  - Sécurité et paramètres
  - Structure de base de données
  - Erreurs courantes

### Ligne de Commande

- **[Commandes CLI](commandes_cli.md)** - Utilisation en ligne de commande
  - Commandes de base
  - Commandes Meta
  - Import et Export
  - Scripts et automation
  - Backup et Restore

## 🔍 Recherche par cas d'usage

### Je veux...

**...créer une table avec des relations**
- Voir: [Gestion des Données - Création de tables](gestion_donnees.md#création-de-tables)
- Voir: [Gestion des Données - Contraintes](gestion_donnees.md#contraintes)

**...récupérer des données**
- Voir: [Requêtes Utiles - SELECT](requetes_utiles.md#requêtes-select)
- Voir: [Requêtes Avancées - Jointures](requetes_avancees.md#jointures)

**...modifier ou supprimer des données**
- Voir: [Requêtes Utiles - UPDATE](requetes_utiles.md#requêtes-update)
- Voir: [Requêtes Utiles - DELETE](requetes_utiles.md#requêtes-delete)

**...analyser des données**
- Voir: [Requêtes Utiles - Agrégation](requetes_utiles.md#requêtes-dagrégation)
- Voir: [Requêtes Avancées - Sous-requêtes](requetes_avancees.md#sous-requêtes)

**...améliorer les performances**
- Voir: [Meilleures Pratiques - Performances](meilleures_pratiques.md#performances)
- Voir: [Référence SQL - Pragmas](reference_sql.md#pragmas)

**...sécuriser ma base de données**
- Voir: [Meilleures Pratiques - Sécurité](meilleures_pratiques.md#sécurité)
- Voir: [Meilleures Pratiques - Structure](meilleures_pratiques.md#structure-de-base-de-données)

**...faire un backup ou export**
- Voir: [Commandes CLI - Backup et Restore](commandes_cli.md#backup-et-restore)
- Voir: [Commandes CLI - Import et Export](commandes_cli.md#import-et-export)

**...debugger une requête**
- Voir: [Meilleures Pratiques - Debugging](meilleures_pratiques.md#debugging)
- Voir: [Meilleures Pratiques - Erreurs courantes](meilleures_pratiques.md#erreurs-courantes)

## 🛠️ Structure des fichiers

```
docs/
├── README.md                    # Vue d'ensemble
├── INDEX.md                     # Ce fichier
├── requetes_utiles.md          # Requêtes courantes
├── requetes_avancees.md        # Requêtes complexes
├── gestion_donnees.md          # Structure et données
├── meilleures_pratiques.md     # Conseils et optimisation
├── reference_sql.md            # Référence complète
└── commandes_cli.md            # Utilisation CLI
```

## 📖 Conventions utilisées dans la documentation

### Symboles

- ✅ BON - Exemple recommandé
- ❌ MAUVAIS - À éviter
- ⚠️ ATTENTION - À faire avec prudence

### Format du code SQL

```sql
-- Commentaires avec --
SELECT * FROM table;  -- Code SQL complet
```

### Format des commandes CLI

```bash
sqlite3 database.db "SELECT * FROM table;"
```

### Format des exemples Python

```python
import sqlite3
cursor.execute('SELECT * FROM table WHERE id = ?', (id,))
```

## 🔗 Références externes

### Documentation officielle

- [SQLite3 Official Documentation](https://www.sqlite.org/docs.html)
- [SQL Language Reference](https://www.sqlite.org/lang.html)
- [SQLite3 Command Line Shell](https://www.sqlite.org/cli.html)

### Ressources populaires

- [SQLite Tutorial](https://www.sqlitetutorial.net/)
- [W3Schools SQLite](https://www.w3schools.com/sql/)
- [Stack Overflow SQLite Tag](https://stackoverflow.com/questions/tagged/sqlite)

## 💡 Conseils généraux

1. **Toujours utiliser des requêtes paramétrées** pour éviter l'injection SQL
2. **Activer les clés étrangères** : `PRAGMA foreign_keys = ON;`
3. **Créer des index** sur les colonnes fréquemment recherchées
4. **Utiliser des transactions** pour les opérations en masse
5. **Faire des backups réguliers** de votre base de données
6. **Tester les requêtes** avant de les utiliser en production

## ❓ FAQ

### Q: SQLite3 peut-il gérer de grandes bases de données?
**A:** SQLite3 fonctionne bien pour les bases de données jusqu'à plusieurs gigabytes. Pour plus grand, considérez PostgreSQL ou MySQL.

### Q: Comment puis-je utiliser SQLite3 en Python?
**A:** Utilisez le module `sqlite3` intégré :
```python
import sqlite3
conn = sqlite3.connect('database.db')
cursor = conn.cursor()
cursor.execute('SELECT * FROM table')
```

### Q: SQLite3 supporte-t-il les utilisateurs et les droits d'accès?
**A:** Non, SQLite3 n'a pas de système de droits. Utilisez le système de fichiers pour les permissions.

### Q: Comment dois-je structurer ma base de données?
**A:** Voir [Structure de base de données](meilleures_pratiques.md#structure-de-base-de-données) pour un exemple complet.

### Q: Mes requêtes sont lentes. Que faire?
**A:** Voir [Performances](meilleures_pratiques.md#performances) pour les techniques d'optimisation.

---

**Version:** 1.0  
**Dernière mise à jour:** 4 juin 2026  
**Auteur:** Documentation SQLite3
