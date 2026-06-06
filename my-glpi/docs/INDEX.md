# Index Documentation React — my-glpi

Bienvenue dans la documentation complète du projet React my-glpi. Ce guide regroupe tous les composants, patterns et conventions utiles pour développer rapidement et proprement.

---

## Navigation Rapide

### 🚀 Commencer ici
1. **[React Guide Principal](../react-guide.md)** — conventions, structure, bonnes pratiques
2. **[Top 20 Composants](./top-20.md)** — les 20 éléments à connaître absolument
3. **[Checklist Complète](../list.md)** — liste exhaustive de tous les composants

---

## 📦 Composants UI (`docs/components/UI/`)

Éléments visuels de base :

| Composant | Fichier | Cas d'usage |
|-----------|---------|-----------|
| **Buttons** | [buttons.md](./UI/buttons.md) | Simple, Icon, Loading, Submit, Confirmation |
| **Modals** | [modals.md](./UI/modals.md) | Simple, Confirmation, Formulaire, Fullscreen, Drawer |
| **Notifications** | [notifications.md](./UI/notifications.md) | Toast Success/Error/Warning/Info |
| **Alerts** | [alerts.md](./UI/alerts.md) | Alertes persistantes (Success/Error/Warning/Info) |
| **Toggles** | [toggles.md](./UI/toggles.md) | Switch, Dark/Light mode, Afficher/Masquer |
| **Loaders** | [loaders.md](./UI/loaders.md) | Spinner, Progress Bar, Skeleton |
| **Badges** | [badges.md](./UI/badges.md) | Statut, Compteur |
| **Tooltips** | [tooltips.md](./UI/tooltips.md) | Infobulle simple, Positionnable |

---

## 📋 Composants Formulaires (`docs/components/Forms/`)

Champs et logique de formulaires :

| Composant | Fichier | Description |
|-----------|---------|------------|
| **Inputs** | [inputs.md](./Forms/inputs.md) | Text, Number, Email, Password, TextArea |
| **Selects** | [selects.md](./Forms/selects.md) | Select, MultiSelect, Dynamique |
| **Validation** | [validation.md](./Forms/validation.md) | Gestion erreurs, Messages, Validation |

---

## 📊 Composants Listes & Tables (`docs/components/Tables/`)

Affichage de données tabulaires :

| Composant | Fichier | Fonctionnalités |
|-----------|---------|-----------------|
| **DataTable** | [generic-datatable.md](./Tables/generic-datatable.md) | Colonnes dynamiques, Pagination, Recherche, Tri, Filtres |
| **CRUD Table** | *inséré dans datatable* | Ajouter, Modifier, Supprimer, Détails |
| **Advanced** | *inséré dans datatable* | Export CSV, Sélection multiple |

---

## 🔐 Authentification & Routes (`docs/api/` et `docs/auth/`)

Gestion de l'authentification et protection des routes :

| Composant | Fichier | Description |
|-----------|---------|------------|
| **Auth Context** | [auth-context.md](../auth/auth-context.md) | Context global, Login Form, Forgot Password |
| **Protected Route** | [protected-route.md](../api/protected-route.md) | Routes protégées, Rôles utilisateur |

---

## 🌐 Services & API (`docs/api/`)

Couche réseau centralisée :

| Composant | Fichier | Description |
|-----------|---------|------------|
| **API Service** | [api-service.md](../api/api-service.md) | Axios instance, Interceptors, Refresh token auto |

---

## 🎣 Hooks Réutilisables (`docs/hooks/`)

Logique React réutilisable :

| Hook | Fichier | Cas d'usage |
|------|---------|-----------|
| **useFetch** | [useFetch.md](../hooks/useFetch.md) | Récupérer données API |
| **useLocalStorage** | *dans useFetch.md* | Persister données localStorage |
| **useDebounce** | *dans useFetch.md* | Débouncer valeurs (search) |
| **useToast** | *dans useFetch.md* | Notifications globales |

---

## 🛠️ Utilitaires (`docs/utilities/`)

Fonctions utilitaires :

- Export CSV / Excel
- Download files
- Copy to clipboard
- QR Code
- Confirmation Dialog

---

## ⭐ Top 20 Composants à Apprendre

```
1. DataTable              (tableau with pagination/search/filter/sort)
2. Modal                  (boîte de dialogue générique)
3. Form générique         (génération dynamique des champs)
4. CRUD Page              (Create/Read/Update/Delete)
5. Pagination             (navigation entre pages)
6. SearchBar              (avec debounce)
7. Filter Panel           (filtres dynamiques)
8. Sort Component         (tri multi-colonnes)
9. Sidebar                (navigation latérale)
10. Navbar               (navigation principal)
11. Toast System         (notifications flottantes)
12. Protected Route      (authentification)
13. useFetch             (hook pour API)
14. useLocalStorage      (persistence)
15. useDebounce          (optimisation search)
16. Auth Context         (contexte global)
17. Product Card         (affichage produit)
18. Dashboard Card       (statut/KPI)
19. Accordion            (contenu repliable)
20. Dropdown             (sélecteur)
```

---

## 🚀 Quickstart pour nouveaux développeurs

### 1. Installer dépendances
```bash
npm install
```

### 2. Démarrer l'app
```bash
npm run dev
```

### 3. Lire les fichiers essentiels (dans cet ordre)
- [react-guide.md](../react-guide.md) — compréhension générale
- [auth-context.md](../auth/auth-context.md) — comprendre l'authentification
- [api-service.md](../api/api-service.md) — appels réseau
- [generic-datatable.md](./Tables/generic-datatable.md) — afficher des données

### 4. Créer votre première page
```jsx
// pages/MyPage.jsx
import { useFetch } from '../hooks/useFetch'
import { DataTable } from '../components/Tables/DataTable'

export default function MyPage() {
  const { data, loading } = useFetch('/my-endpoint')

  return (
    <DataTable
      columns={[/* ... */]}
      data={data || []}
      loading={loading}
    />
  )
}
```

---

## 📁 Structure des fichiers doc

```
docs/
├── react-guide.md                  # Guide principal
├── list.md                         # Checklist exhaustive
├── INDEX.md                        # Ce fichier
├── top-20.md                       # Top 20 composants
│
├── components/
│   ├── UI/                         # Boutons, modals, etc.
│   ├── Forms/                      # Inputs, validation, etc.
│   ├── Tables/                     # DataTable, CRUD
│   ├── Lists/                      # Lists, pagination, filtres
│   ├── Navigation/                 # Sidebar, navbar, breadcrumb
│   ├── CRUD/                       # Formulaires CRUD
│   ├── Dashboard/                  # Cards, widgets
│   ├── Ecommerce/                  # Produits, panier
│   ├── Layout/                     # Layouts réutilisables
│   └── Advanced/                   # Kanban, drag-drop, etc.
│
├── api/                            # Services API
│   ├── api-service.md              # Axios + interceptors
│   └── protected-route.md          # Routes protégées
│
├── auth/                           # Authentification
│   └── auth-context.md             # Auth global
│
├── hooks/                          # Hooks réutilisables
│   └── useFetch.md                 # useFetch, useDebounce, etc.
│
└── utilities/                      # Utilitaires
```

---

## 💡 Tips & Tricks

- **Réutiliser les composants** : modifier `className` plutôt que copier-coller
- **Utiliser les contexts** : Auth, Toast, Theme au niveau global
- **Centraliser l'API** : tous les appels dans `src/services/`
- **Interceptors** : gère le refresh token automatiquement
- **Validation** : côté client ET serveur toujours

---

## ❓ Questions fréquentes

**Q: Comment ajouter un nouveau composant?**
A: Créer le fichier dans `src/components/CategoryName/ComponentName.jsx`, puis exporter dans un `index.js`.

**Q: Comment persister l'authentification?**
A: Les tokens sont dans `sessionStorage`. Ils sont automatiquement gérés par le contexte `AuthProvider`.

**Q: Comment récupérer des données du serveur?**
A: Utiliser `useFetch()` ou `ticketService.getAll()` depuis `src/services/`.

**Q: Où ajouter un nouveau service API?**
A: Créer `src/services/myService.js` et exporter les fonctions.

---

## 📚 Ressources externes

- [React Docs](https://react.dev)
- [React Router](https://reactrouter.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Axios](https://axios-http.com)

---

Dernière mise à jour : 3 juin 2026
