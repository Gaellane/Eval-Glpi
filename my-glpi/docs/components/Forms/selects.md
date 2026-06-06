# Form Selects & Checkboxes

## Vue d'ensemble
Sélecteurs et checkboxes pour formulaires.

---

## 1. Select Simple

### Description
Dropdown pour sélectionner une option.

### Props
```js
/**
 * @param {string} label - Label du select
 * @param {Array<{value, label}>} options - Liste des options
 * @param {any} value - Valeur sélectionnée
 * @param {function} onChange - Callback au changement
 * @param {string} error - Message d'erreur
 */
```

### Exemple
```jsx
function Select({ label, options, value, onChange, error }) {
  return (
    <div className="mb-4">
      {label && <label className="block text-sm font-medium mb-1">{label}</label>}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-3 py-2 border rounded ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
      >
        <option value="">-- Sélectionner --</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  )
}
```

### Utilisation
```jsx
const options = [
  { value: 'fr', label: 'France' },
  { value: 'be', label: 'Belgique' },
  { value: 'ch', label: 'Suisse' }
]

<Select
  label="Pays"
  options={options}
  value={country}
  onChange={setCountry}
/>
```

---

## 2. Select Dynamique

### Description
Select qui charge les options via une API.

### Exemple
```jsx
import { useState, useEffect } from 'react'

function DynamicSelect({ label, fetchOptions, value, onChange }) {
  const [options, setOptions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchOptions()
        setOptions(data)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [fetchOptions])

  if (loading) return <p>Chargement...</p>

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 border border-gray-300 rounded"
    >
      <option value="">-- Sélectionner --</option>
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  )
}
```

---

## 3. MultiSelect

### Description
Select permettant plusieurs sélections.

### Props
```js
/**
 * @param {Array<{value, label}>} options - Liste des options
 * @param {Array} value - Valeurs sélectionnées (tableau)
 * @param {function} onChange - Callback avec tableau de valeurs
 */
```

### Exemple
```jsx
function MultiSelect({ options, value, onChange }) {
  const handleChange = (optValue) => {
    if (value.includes(optValue)) {
      onChange(value.filter(v => v !== optValue))
    } else {
      onChange([...value, optValue])
    }
  }

  return (
    <div className="space-y-2">
      {options.map(opt => (
        <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={value.includes(opt.value)}
            onChange={() => handleChange(opt.value)}
          />
          <span>{opt.label}</span>
        </label>
      ))}
    </div>
  )
}
```

---

## 4. Checkbox Simple

### Description
Un simple checkbox.

### Exemple
```jsx
function Checkbox({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4"
      />
      {label}
    </label>
  )
}
```

---

## 5. Checkbox Multiple

### Description
Groupe de checkboxes.

### Exemple
```jsx
function CheckboxGroup({ options, value, onChange }) {
  return (
    <div className="space-y-2">
      {options.map(opt => (
        <Checkbox
          key={opt.value}
          label={opt.label}
          checked={value.includes(opt.value)}
          onChange={(checked) => {
            if (checked) {
              onChange([...value, opt.value])
            } else {
              onChange(value.filter(v => v !== opt.value))
            }
          }}
        />
      ))}
    </div>
  )
}
```

---

## Bonnes pratiques

- Toujours fournir une option "-- Sélectionner --"
- Pour MultiSelect, utiliser `.includes()` pour vérifier les valeurs
- Gérer le loading state pour les selects dynamiques
