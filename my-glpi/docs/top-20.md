# Top 20 Composants à Connaître par Cœur

Liste des 20 composants/patterns essentiels pour développer rapidement dans ce projet.

---

## 1. **DataTable** — [generic-datatable.md](./components/Tables/generic-datatable.md)

Tableau avec pagination, recherche, tri, filtres.

```jsx
<DataTable
  columns={[
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Nom', sortable: true }
  ]}
  data={items}
  searchable
  pagination={{ page, limit: 10, total: 100 }}
/>
```

**Cas d'usage**: Listes de tickets, utilisateurs, produits.

---

## 2. **Modal** — [modals.md](./components/UI/modals.md)

Boîte de dialogue pour afficher du contenu ou demander confirmation.

```jsx
{isOpen && (
  <Modal
    title="Confirmer"
    onClose={() => setIsOpen(false)}
  >
    <p>Continuer?</p>
    <button onClick={handleConfirm}>Oui</button>
  </Modal>
)}
```

---

## 3. **Form Générique** — [validation.md](./components/Forms/validation.md)

Génération dynamique des champs de formulaire avec validation.

```jsx
const fields = [
  { name: 'email', label: 'Email', type: 'email', required: true },
  { name: 'password', label: 'Mot de passe', type: 'password', required: true }
]

<GenericForm fields={fields} onSubmit={handleSubmit} />
```

---

## 4. **CRUD Page** — [generic-datatable.md](./components/Tables/generic-datatable.md)

Page complète Create/Read/Update/Delete.

```jsx
function TicketsCRUD() {
  const { data: tickets } = useFetch('/tickets')
  const [page, setPage] = useState(1)

  return (
    <div>
      <button onClick={() => setShowForm(true)}>Créer</button>
      <DataTable
        columns={cols}
        data={tickets}
        onPageChange={setPage}
      />
    </div>
  )
}
```

---

## 5. **Pagination** — Intégré dans DataTable

Navigation entre pages de résultats.

```jsx
<Pagination current={page} total={10} onPageChange={setPage} />
```

---

## 6. **SearchBar** — [useFetch.md](./hooks/useFetch.md)

Champ de recherche avec debounce.

```jsx
const [search, setSearch] = useState('')
const debouncedSearch = useDebounce(search, 300)
const { data: results } = useFetch(
  debouncedSearch ? `/search?q=${debouncedSearch}` : null
)
```

---

## 7. **Filter Panel** — [validation.md](./components/Forms/validation.md)

Ensemble de filtres pour refiner les résultats.

```jsx
<FilterPanel
  filters={[
    { name: 'status', label: 'Statut', options: [...] },
    { name: 'date', label: 'Date', type: 'date' }
  ]}
  onChange={handleFilter}
/>
```

---

## 8. **Sort Component** — Intégré dans DataTable

Tri des colonnes (asc/desc, multi-colonnes).

```jsx
// Cliquer sur colonne header pour trier
<th onClick={() => handleSort('name')}>Nom {sortBy === 'name' && sortOrder}</th>
```

---

## 9. **Sidebar** — À implémenter

Navigation latérale avec liens.

```jsx
<Sidebar>
  <SidebarLink to="/dashboard">Dashboard</SidebarLink>
  <SidebarLink to="/tickets">Tickets</SidebarLink>
</Sidebar>
```

---

## 10. **Navbar** — [react-guide.md](../react-guide.md)

Barre de navigation principale avec header, logo, menu.

```jsx
<header className="bg-white shadow">
  <nav className="flex justify-between p-4">
    <div>Logo</div>
    <div>Menu items</div>
  </nav>
</header>
```

---

## 11. **Toast System** — [notifications.md](./components/UI/notifications.md)

Notifications flottantes auto-dismiss.

```jsx
import { useToast } from '../hooks/useToast'

const { addToast } = useToast()
addToast('Succès!', 'success')
addToast('Erreur', 'error')
```

---

## 12. **Protected Route** — [protected-route.md](./api/protected-route.md)

Protéger les routes selon l'authentification.

```jsx
<Routes>
  <Route path="/" element={<Login />} />
  <Route
    path="/dashboard"
    element={<ProtectedRoute element={<Dashboard />} isAuthenticated={!!token} />}
  />
</Routes>
```

---

## 13. **useFetch** — [useFetch.md](./hooks/useFetch.md)

Hook pour récupérer données depuis API.

```jsx
const { data, loading, error } = useFetch('/users')
```

---

## 14. **useLocalStorage** — [useFetch.md](./hooks/useFetch.md)

Persister données en localStorage.

```jsx
const [theme, setTheme] = useLocalStorage('theme', 'light')
```

---

## 15. **useDebounce** — [useFetch.md](./hooks/useFetch.md)

Débouncer une valeur (utile pour search optimisé).

```jsx
const debouncedSearch = useDebounce(searchTerm, 300)
```

---

## 16. **Auth Context** — [auth-context.md](../auth/auth-context.md)

Gestion globale de l'authentification.

```jsx
const { user, login, logout, isAuthenticated } = useAuth()
```

---

## 17. **Product Card** — À créer

Affichage d'un produit (image, price, actions).

```jsx
<ProductCard product={product} onBuy={handleBuy} />
```

---

## 18. **Dashboard Card** — À créer

Carte affichant KPI, statut, revenue.

```jsx
<DashboardCard
  title="Revenue"
  value="$12,345"
  icon={<DollarIcon />}
  trend="+5%"
/>
```

---

## 19. **Accordion** — À créer

Contenu repliable/dépliant.

```jsx
<Accordion>
  <AccordionItem title="Section 1">Contenu 1</AccordionItem>
  <AccordionItem title="Section 2">Contenu 2</AccordionItem>
</Accordion>
```

---

## 20. **Dropdown** — À créer

Menu déroulant avec options.

```jsx
<Dropdown>
  <DropdownItem onClick={handleEdit}>Éditer</DropdownItem>
  <DropdownItem onClick={handleDelete}>Supprimer</DropdownItem>
</Dropdown>
```

---

## Résumé d'Implémentation

### Frontend (React)
- ✅ DataTable, Modal, Forms
- ✅ Auth System avec refresh token
- ✅ API Service avec interceptors
- ✅ Toast notifications
- ✅ Hooks réutilisables

### À implémenter
- Sidebar & Navbar (layouts)
- Product Card & Dashboard Card
- Accordion & Dropdown
- Advanced components (Calendar, etc.)

---

## Stratégie de Développement

1. **Jour 1** : DataTable + Forms + CRUD basic
2. **Jour 2** : Auth + Protected routes + API service
3. **Jour 3** : Search + Filter + Pagination
4. **Jour 4** : Notifications + Loaders + Polish
5. **Jour 5+** : Advanced features, e-commerce, etc.
