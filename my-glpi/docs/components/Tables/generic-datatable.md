# DataTable Générique

## Vue d'ensemble
Composant table réutilisable avec pagination, recherche, tri et filtres.

---

## 1. Generic DataTable

### Description
Table avec fonctionnalités complètes (colonnes dynamiques, pagination, recherche, tri, filtres).

### Props
```js
/**
 * @param {Array<{key, label, sortable, render?}>} columns - Définition des colonnes. Optionnel `render(row)` pour afficher du JSX personnalisé.
 * @param {Array} data - Données du tableau
 * @param {boolean} loading - Indicateur de chargement
 * @param {{page, limit, total}} pagination - Info pagination
 * @param {function} onPageChange - Callback changement de page
 * @param {function} onSort - Callback tri (key, order)
 * @param {function} onSearch - Callback recherche
 * @param {boolean} searchable - Activer barre de recherche
 */
```

### Code complet
```jsx
import { useState } from 'react'
import Spinner from '../UI/Spinner'
import Pagination from './Pagination'

export function DataTable({
  columns,
  data = [],
  loading = false,
  pagination = { page: 1, limit: 10, total: 0 },
  onPageChange,
  onSort,
  onSearch,
  searchable = false
}) {
  const [sortBy, setSortBy] = useState(null)
  const [sortOrder, setSortOrder] = useState('asc')
  const [searchTerm, setSearchTerm] = useState('')

  const handleSort = (key) => {
    if (!columns.find(c => c.key === key)?.sortable) return

    const newOrder = sortBy === key && sortOrder === 'asc' ? 'desc' : 'asc'
    setSortBy(key)
    setSortOrder(newOrder)
    onSort?.(key, newOrder)
  }

  const handleSearch = (e) => {
    const term = e.target.value
    setSearchTerm(term)
    onSearch?.(term)
  }

  if (loading) return <Spinner />

  return (
    <div className="space-y-4">
      {searchable && (
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={handleSearch}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
          />
          <button
            type="button"
            onClick={() => onSearch?.('')}
            className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md text-sm"
          >
            Reset
          </button>
        </div>
      )}

      <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map(col => (
                <th
                  key={col.key}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider select-none cursor-pointer"
                  onClick={() => handleSort(col.key)}
                >
                  <div className="flex items-center gap-2">
                    <span>{col.label}</span>
                    {col.sortable && sortBy === col.key && (
                      <span className="text-gray-500 text-sm">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {(!data || data.length === 0) ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-8 text-center text-gray-500">
                  Aucune donnée
                </td>
              </tr>
            ) : (
              data.map((row, idx) => {
                const key = row?.id ?? row?.ID ?? row?._id ?? idx
                return (
                  <tr key={key} className="hover:bg-gray-50">
                    {columns.map(col => (
                      <td key={col.key} className="px-4 py-3 text-sm text-gray-700 align-top">
                        {typeof col.render === 'function' ? col.render(row) : row[col.key]}
                      </td>
                    ))}
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {pagination?.total > 0 && (
        <div className="flex items-center justify-end">
          <Pagination
            current={pagination.page}
            total={Math.ceil(pagination.total / pagination.limit)}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  )
}
```

---

## 2. CRUD Table

### Description
Table avec actions CRUD (Créer, Lire, Mettre à jour, Supprimer).

### Exemple
```jsx
function TicketsTable() {
  const [page, setPage] = useState(1)
  const { data: tickets, loading } = useFetch(`/tickets?page=${page}`)

  const handleDelete = async (id) => {
    if (window.confirm('Confirmer la suppression?')) {
      try {
        await ticketService.delete(id)
        addToast('Supprimé!', 'success')
      } catch (error) {
        addToast(error.message, 'error')
      }
    }
  }

  const columns = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'title', label: 'Titre', sortable: true },
    { key: 'status', label: 'Statut' },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/tickets/${row.id}/edit`)}
            className="px-2 py-1 bg-blue-600 text-white rounded text-sm"
          >
            Éditer
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="px-2 py-1 bg-red-600 text-white rounded text-sm"
          >
            Supprimer
          </button>
        </div>
      )
    }
  ]

  return (
    <DataTable
      columns={columns}
      data={tickets?.data || []}
      loading={loading}
      pagination={{
        page,
        limit: 10,
        total: tickets?.total || 0
      }}
      onPageChange={setPage}
      searchable
    />
  )
}
```

---

## 3. Advanced Table avec Export

### Description
Table avec export CSV/Excel.

### Code pour Export
```js
export function exportToCSV(data, filename = 'export.csv') {
  const csv = [
    Object.keys(data[0]).join(','),
    ...data.map(row => Object.values(row).join(','))
  ].join('\n')

  const blob = new Blob([csv], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
}
```

### Utilisation
```jsx
<button
  onClick={() => exportToCSV(tickets, 'tickets.csv')}
  className="px-4 py-2 bg-green-600 text-white rounded"
>
  Exporter CSV
</button>
```
