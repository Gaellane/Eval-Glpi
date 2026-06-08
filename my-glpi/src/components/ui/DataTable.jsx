import React, { isValidElement } from 'react'
import Spinner from './Spinner';

export function DataTable({
  columns,
  data = [],
  loading = false,
  onClickRow,
  // simplified: sorting/search removed
}) {
  // sorting and search removed

  const getNestedValue = (obj, path) => {
    if (!obj || !path) return undefined
    return path.split('.').reduce((o, key) => (o ? o[key] : undefined), obj)
  }

  const formatCellValue = (val) => {
    if (val === null || val === undefined) return ''
    if (isValidElement(val)) return val
    if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean') return val
    if (Array.isArray(val)) {
      return val
        .map(v => (v && typeof v === 'object' ? (v.name ?? v.label ?? JSON.stringify(v)) : String(v)))
        .join(', ')
    }
    // object fallback: try common display properties
    return val.name ?? val.label ?? val.id ?? JSON.stringify(val)
  }

  const renderCell = (row, col) => {
    if (typeof col.render === 'function') return col.render(row)
    const raw = col?.key ? (col.key.includes('.') ? getNestedValue(row, col.key) : row[col.key]) : ''
    return formatCellValue(raw)
  }

  if (loading) return <Spinner />

  return (
    <div className="space-y-4">
      {/* search removed */}

      <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map(col => (
                <th
                  key={col.key}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider select-none"
                >
                  {col.label}
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
                  <tr
                    key={key}
                    className={`hover:bg-gray-50 ${onClickRow ? 'cursor-pointer' : ''}`}
                    onClick={() => onClickRow?.(row, idx)}
                    role={onClickRow ? 'button' : undefined}
                    tabIndex={onClickRow ? 0 : undefined}
                    onKeyDown={onClickRow ? (e) => { if (e.key === 'Enter' || e.key === ' ') onClickRow(row, idx) } : undefined}
                  >
                    {columns.map(col => (
                      <td key={col.key} className="px-4 py-3 text-sm text-gray-700 align-top">
                        {renderCell(row, col)}
                      </td>
                    ))}
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

    </div>
  )
}

export default DataTable;