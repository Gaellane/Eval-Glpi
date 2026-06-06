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
 * @param {Array<{key, label, sortable}>} columns - Définition des colonnes
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
  data,
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
        <input
          type="text"
          placeholder="Rechercher..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full px-4 py-2 border border-gray-300 rounded"
        />
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              {columns.map(col => (
                <th
                  key={col.key}
                  className="p-3 text-left font-bold cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSort(col.key)}
                >
                  {col.label}
                  {col.sortable && sortBy === col.key && (
                    <span>{sortOrder === 'asc' ? ' ↑' : ' ↓'}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="p-4 text-center text-gray-500">
                  Aucune donnée
                </td>
              </tr>
            ) : (
              data.map((row, idx) => (
                <tr key={idx} className="border-b hover:bg-gray-50">
                  {columns.map(col => (
                    <td key={col.key} className="p-3">
                      {row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination.total > 0 && (
        <Pagination
          current={pagination.page}
          total={Math.ceil(pagination.total / pagination.limit)}
          onPageChange={onPageChange}
        />
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
