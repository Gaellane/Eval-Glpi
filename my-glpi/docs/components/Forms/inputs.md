# Form Inputs

## Vue d'ensemble
Composants d'entrée de texte et données pour formulaires.

---

## 1. Text Input

### Description
Champ texte générique.

### Props
```js
/**
 * @param {string} label - Label du champ
 * @param {string} value - Valeur courante
 * @param {function} onChange - Callback au changement
 * @param {string} placeholder - Placeholder du champ
 * @param {string} error - Message d'erreur (si existe)
 */
```

### Exemple
```jsx
function TextInput({ label, value, onChange, placeholder, error }) {
  return (
    <div className="mb-4">
      {label && <label className="block text-sm font-medium mb-1">{label}</label>}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border rounded ${
          error ? 'border-red-500' : 'border-gray-300'
        } focus:outline-none focus:ring-2 focus:ring-teal-500`}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  )
}
```

---

## 2. Number Input

### Description
Champ pour nombres.

### Exemple
```jsx
function NumberInput({ label, value, onChange, min, max, error }) {
  return (
    <div className="mb-4">
      {label && <label className="block text-sm font-medium mb-1">{label}</label>}
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        max={max}
        className={`w-full px-3 py-2 border rounded ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  )
}
```

---

## 3. Email Input

### Description
Champ spécialisé pour emails avec validation.

### Exemple
```jsx
function EmailInput({ label, value, onChange, error }) {
  return (
    <div className="mb-4">
      {label && <label className="block text-sm font-medium mb-1">{label}</label>}
      <input
        type="email"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="nom@example.com"
        className={`w-full px-3 py-2 border rounded ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  )
}
```

---

## 4. Password Input

### Description
Champ mot de passe avec toggle affichage.

### Exemple
```jsx
import { useState } from 'react'

function PasswordInput({ label, value, onChange, error }) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="mb-4">
      {label && <label className="block text-sm font-medium mb-1">{label}</label>}
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full px-3 py-2 pr-10 border rounded ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-2.5 text-gray-500"
        >
          {showPassword ? '👁️' : '👁️‍🗨️'}
        </button>
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  )
}
```

---

## 5. TextArea

### Description
Champ texte multi-ligne.

### Exemple
```jsx
function TextArea({ label, value, onChange, placeholder, rows = 4, error }) {
  return (
    <div className="mb-4">
      {label && <label className="block text-sm font-medium mb-1">{label}</label>}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={`w-full px-3 py-2 border rounded resize-none ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  )
}
```

---

## Patterns recommandés

- Toujours avoir `label` pour l'accessibilité
- Afficher messages d'erreur en rouge sous le champ
- Focus ring avec couleur primaire
- Feedback visuel au focus
