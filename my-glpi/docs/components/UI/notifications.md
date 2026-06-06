# Notifications & Toasts

## Vue d'ensemble
Systèmes de notifications fixes/flottantes pour informer l'utilisateur.

---

## 1. Toast Success

### Description
Notification de succès qui disparaît automatiquement.

### Props
```typescript
interface ToastProps {
  message: string
  duration?: number
  onClose?: () => void
}
```

### Exemple
```jsx
import { useState, useEffect } from 'react'

function ToastSuccess({ message, duration = 3000, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [duration, onClose])

  return (
    <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded shadow-lg">
      ✓ {message}
    </div>
  )
}
```

### Utilisation
```jsx
const [toast, setToast] = useState(null)

const showSuccess = (msg) => {
  setToast({ type: 'success', message: msg })
  setTimeout(() => setToast(null), 3000)
}
```

---

## 2. Toast Error

### Description
Notification d'erreur.

### Exemple
```jsx
function ToastError({ message, duration = 3000, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded shadow-lg">
      ✕ {message}
    </div>
  )
}
```

---

## 3. Toast Warning

### Description
Notification d'avertissement.

### Exemple
```jsx
function ToastWarning({ message, duration = 3000, onClose }) {
  return (
    <div className="fixed top-4 right-4 bg-yellow-500 text-white px-6 py-3 rounded shadow-lg">
      ⚠ {message}
    </div>
  )
}
```

---

## 4. Toast Info

### Description
Notification informationnelle.

### Exemple
```jsx
function ToastInfo({ message, duration = 3000, onClose }) {
  return (
    <div className="fixed top-4 right-4 bg-blue-500 text-white px-6 py-3 rounded shadow-lg">
      ℹ {message}
    </div>
  )
}
```

---

## Toast Manager (Recommandé)

Centraliser la gestion des toasts avec un contexte:

```jsx
// ToastContext.jsx
import { createContext, useState, useCallback } from 'react'

export const ToastContext = createContext()

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, duration)
  }, [])

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed top-4 right-4 space-y-2">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`px-6 py-3 rounded shadow-lg text-white ${
              toast.type === 'success' ? 'bg-green-500' :
              toast.type === 'error' ? 'bg-red-500' :
              toast.type === 'warning' ? 'bg-yellow-500' :
              'bg-blue-500'
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
```

### Utilisation
```jsx
import { useContext } from 'react'
import { ToastContext } from './ToastContext'

function MyComponent() {
  const { addToast } = useContext(ToastContext)

  const handleAction = async () => {
    try {
      await someAction()
      addToast('Action réussie!', 'success')
    } catch (err) {
      addToast('Erreur: ' + err.message, 'error')
    }
  }

  return <button onClick={handleAction}>Action</button>
}
```

---

## Bonnes pratiques

- Auto-dismiss après 2-4 secondes
- Stacker les toasts verticalement
- Utiliser des couleurs cohérentes (vert=succès, rouge=erreur, etc)
- Placer en haut-droit ou bas-droit (viewport fixe)
