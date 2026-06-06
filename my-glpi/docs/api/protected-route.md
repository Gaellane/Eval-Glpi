# Protected Route & Private Route

## Vue d'ensemble
Composants pour protéger les routes selon l'authentification et les rôles.

---

## 1. Protected Route

### Description
Route accessible seulement si authentifié.

### Props
```js
/**
 * @param {ReactNode} element - Composant à afficher si authentifié
 * @param {boolean} isAuthenticated - État d'authentification
 * @param {string} redirectTo - URL de redirection si non-auth (défaut: '/')
 */
```

### Exemple
```jsx
import { Navigate } from 'react-router-dom'

function ProtectedRoute({ isAuthenticated, element, redirectTo = '/' }) {
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />
  }
  return element
}
```

### Utilisation dans Routes
```jsx
<Routes>
  <Route path="/" element={<LoginBO />} />
  <Route
    path="/dashboard"
    element={
      <ProtectedRoute
        isAuthenticated={!!sessionStorage.getItem('user-token')}
        element={<Dashboard />}
      />
    }
  />
</Routes>
```

---

## 2. Private Route (avec Layout)

### Description
Route protégée avec layout déjà appliqué.

### Exemple
```jsx
function PrivateRoute({ isAuthenticated, redirectTo = '/' }) {
  return isAuthenticated ? (
    <MainLayoutBO />
  ) : (
    <Navigate to={redirectTo} replace />
  )
}

// Utilisation
<Routes>
  <Route path="/" element={<LoginBO />} />
  <Route element={<PrivateRoute isAuthenticated={!!accessToken} />}>
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/tickets" element={<Tickets />} />
  </Route>
</Routes>
```

---

## 3. Role Based Access

### Description
Accès selon le rôle de l'utilisateur.

### Exemple
```jsx
function RoleBasedRoute({ element, allowedRoles, userRole }) {
  if (!allowedRoles.includes(userRole)) {
    return <div>Accès refusé. Rôle requis: {allowedRoles.join(', ')}</div>
  }
  return element
}
```

### Utilisation
```jsx
const userRole = JSON.parse(sessionStorage.getItem('user'))?.role

<Routes>
  <Route
    path="/admin"
    element={
      <RoleBasedRoute
        element={<AdminPanel />}
        allowedRoles={['admin']}
        userRole={userRole}
      />
    }
  />
</Routes>
```

---

## Contexte Auth Recommandé

```jsx
// AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = sessionStorage.getItem('user-token')
    const userData = sessionStorage.getItem('user')
    if (token && userData) {
      setUser(JSON.parse(userData))
    }
    setLoading(false)
  }, [])

  const logout = () => {
    sessionStorage.removeItem('user-token')
    sessionStorage.removeItem('refresh-token')
    sessionStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
```

### Utilisation du contexte
```jsx
function Dashboard() {
  const { user } = useAuth()
  return <h1>Bienvenue {user?.name}</h1>
}
```
