# Documentation SQLite3

Bienvenue dans la documentation SQLite3. Ce guide couvre les concepts fondamentaux, les requêtes utiles et les meilleures pratiques pour travailler avec SQLite3.

## Table des matières

- [Vue d'ensemble de SQLite3](#vue-densemble-de-sqlite3)
- [Installation et configuration](#installation-et-configuration)
- [Structure de la documentation](#structure-de-la-documentation)

## Vue d'ensemble de SQLite3

SQLite3 est une base de données SQL légère et sans serveur, idéale pour:
- Les applications de bureau
- Les applications mobiles
- Les prototypes et tests
- Les petites à moyennes bases de données

### Caractéristiques principales

- **Sans serveur**: Aucun processus serveur séparé
- **Auto-contenu**: Une seule base de données par fichier
- **Léger**: Faible overhead en ressources
- **ACID**: Transactions sécurisées
- **SQL complet**: Support de la plupart des fonctionnalités SQL

## Installation et configuration

### Installation

```bash
# Sur Ubuntu/Debian
sudo apt-get install sqlite3

# Sur macOS
brew install sqlite3

# Vérifier la version
sqlite3 --version
```

### Utilisation de base

```bash
# Ouvrir/créer une base de données
sqlite3 boutique.db

# Exécuter une commande SQL
sqlite3 boutique.db "SELECT * FROM table_name;"

# Importer un script SQL
sqlite3 boutique.db < script.sql
```

## Structure de la documentation

- **[requetes_utiles.md](requetes_utiles.md)** - Requêtes SQL essentielles et courantes
- **[requetes_avancees.md](requetes_avancees.md)** - Requêtes complexes et optimisées
- **[gestion_donnees.md](gestion_donnees.md)** - Création, modification et suppression de données
- **[reference_sql.md](reference_sql.md)** - Référence complète des commandes SQL

---

*Dernière mise à jour: 4 juin 2026*
