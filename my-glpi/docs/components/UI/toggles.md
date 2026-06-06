# Toggles & Switches

## Vue d'ensemble
Composants pour activer/désactiver des états.

---

## 1. Toggle Simple

### Description
Switch binaire pour alterner entre deux états.

### Props
```typescript
interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
}
```

### Exemple
```jsx
import { useState } from 'react'

function ToggleSimple({ label }) {
  const [checked, setChecked] = useState(false)

  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
        className="w-5 h-5"
      />
      {label && <span>{label}</span>}
    </label>
  )
}
```

---

## 2. Dark / Light Mode Toggle

### Description
Toggle pour basculer entre thème clair et sombre.

### Exemple
```jsx
function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle('dark')
    localStorage.setItem('theme', isDark ? 'light' : 'dark')
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 hover:bg-gray-200 rounded"
      title="Basculer thème"
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  )
}
```

### Configuration Tailwind
```js
// tailwind.config.js
export default {
  darkMode: 'class',
  theme: {
    extend: {}
  }
}
```

---

## 3. Afficher / Masquer Mot de Passe

### Description
Toggle pour afficher/masquer le mot de passe en saisie.

### Exemple
```jsx
import { useState } from 'react'

function PasswordToggle({ value, onChange }) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="relative">
      <input
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded pr-10"
        placeholder="Mot de passe"
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-2.5 text-gray-500"
      >
        {showPassword ? '👁️' : '👁️‍🗨️'}
      </button>
    </div>
  )
}
```

---

## Bonnes pratiques

- Utiliser `onChange` callback pour synchroniser l'état parent
- Ajouter des labels accessibles (pour l'a11y)
- Persister les préférences utilisateur en localStorage
