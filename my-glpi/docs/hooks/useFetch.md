# Hooks Utiles

## Vue d'ensemble
Hooks React réutilisables pour logique courante.

---

## 1. useFetch

### Description
Hook pour récupérer des données depuis une API.

### Code
```js
import { useState, useEffect } from 'react'
import api from '../services/api'

export function useFetch(url, options = {}, dependencies = []) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const { data: result } = await api.get(url, options)
        setData(result)
        setError(null)
      } catch (err) {
        setError(err.response?.data?.message || err.message)
      } finally {
        setLoading(false)
      }
    }

    if (url) fetchData()
  }, [url, ...dependencies])

  return { data, loading, error, refetch: () => {} }
}
```

### Utilisation
```jsx
function UsersList() {
  const { data: users, loading, error } = useFetch('/users')

  if (loading) return <Spinner />
  if (error) return <ErrorAlert message={error} />

  return (
    <div>
      {users?.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  )
}
```

---

## 2. useLocalStorage

### Description
Hook pour persister des données en localStorage.

### Code
```js
import { useState, useEffect } from 'react'

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(error)
      return initialValue
    }
  })

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error(error)
    }
  }

  return [storedValue, setValue]
}
```

### Utilisation
```jsx
function MyComponent() {
  const [count, setCount] = useLocalStorage('count', 0)

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Incrémenter</button>
    </div>
  )
}
```

---

## 3. useDebounce

### Description
Hook pour débouncer une valeur (utile pour search).

### Code
```js
import { useState, useEffect } from 'react'

export function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}
```

### Utilisation avec SearchBar
```jsx
function SearchUsers() {
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, 300)
  const { data: results } = useFetch(
    debouncedSearchTerm ? `/users?search=${debouncedSearchTerm}` : null
  )

  return (
    <div>
      <input
        type="text"
        placeholder="Rechercher..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {results?.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  )
}
```

---

## 4. useToast

### Description
Hook pour afficher des notifications toast.

### Code
```js
import { useContext } from 'react'
import { ToastContext } from '../contexts/ToastContext'

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast doit être utilisé dans un ToastProvider')
  }
  return context
}
```

### Utilisation
```jsx
function MyComponent() {
  const { addToast } = useToast()

  const handleAction = async () => {
    try {
      await someAction()
      addToast('Succès!', 'success')
    } catch (error) {
      addToast(error.message, 'error')
    }
  }

  return <button onClick={handleAction}>Action</button>
}
```

---

## Bonnes pratiques

- Utiliser des dépendances pour éviter les boucles infinies
- Cleanup les timers/listeners dans `useEffect` return
- Documenter les alternatives et cas limites
