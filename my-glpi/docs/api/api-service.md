# API Service Layer & Axios Instance

## Vue d'ensemble
Centraliser les appels API avec axios et interceptors pour refresh token automatique.

---

## 1. Axios Instance

### Description
Instance réutilisable d'axios configurée pour le projet.

### Code : `src/services/api.js`
```js
import axios from 'axios'

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Pré-configurer le token au démarrage
const token = sessionStorage.getItem('user-token')
if (token) {
  api.defaults.headers['Authorization'] = `Bearer ${token}`
}

export default api
```

---

## 2. API Service Layer

### Description
Wrapper pour les appels API métier.

### Exemple : `src/services/authService.js`
```js
import api from './api'

export const authService = {
  login: async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password })
    sessionStorage.setItem('user-token', data.accessToken)
    sessionStorage.setItem('refresh-token', data.refreshToken)
    sessionStorage.setItem('user', JSON.stringify(data.user))
    return data
  },

  logout: async () => {
    await api.post('/auth/logout')
    sessionStorage.removeItem('user-token')
    sessionStorage.removeItem('refresh-token')
    sessionStorage.removeItem('user')
  },

  refresh: async () => {
    const refreshToken = sessionStorage.getItem('refresh-token')
    const { data } = await api.post('/auth/refresh', { refreshToken })
    sessionStorage.setItem('user-token', data.accessToken)
    api.defaults.headers['Authorization'] = `Bearer ${data.accessToken}`
    return data
  }
}
```

### Exemple : `src/services/ticketService.js`
```js
import api from './api'

export const ticketService = {
  getAll: async (page = 1, limit = 10) => {
    const { data } = await api.get(`/tickets?page=${page}&limit=${limit}`)
    return data
  },

  getById: async (id) => {
    const { data } = await api.get(`/tickets/${id}`)
    return data
  },

  create: async (ticket) => {
    const { data } = await api.post('/tickets', ticket)
    return data
  },

  update: async (id, ticket) => {
    const { data } = await api.put(`/tickets/${id}`, ticket)
    return data
  },

  delete: async (id) => {
    await api.delete(`/tickets/${id}`)
  }
}
```

---

## 3. Interceptors pour Refresh Token

### Description
Interceptors qui renouvellent automatiquement le token en cas d'expiration.

### Code complet: `src/services/api.js`
```js
import axios from 'axios'

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api'
})

let isRefreshing = false
let subscribers = []

function onRefreshed(token) {
  subscribers.forEach(callback => callback(token))
  subscribers = []
}

function addSubscriber(callback) {
  subscribers.push(callback)
}

// Request Interceptor : ajouter le token à chaque requête
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('user-token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response Interceptor : gérer les 401 et refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error

    // Si pas 401 ou déjà retenté, rejeter
    if (!response || response.status !== 401 || config._retry) {
      return Promise.reject(error)
    }

    // Si déjà en cours de refresh, mettre en queue
    if (isRefreshing) {
      return new Promise((resolve) => {
        addSubscriber((token) => {
          config.headers['Authorization'] = `Bearer ${token}`
          resolve(api(config))
        })
      })
    }

    // Lancer le refresh
    config._retry = true
    isRefreshing = true

    try {
      const refreshToken = sessionStorage.getItem('refresh-token')
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL || 'http://localhost:3000/api'}/auth/refresh`,
        { refreshToken }
      )

      const newAccessToken = data.accessToken
      sessionStorage.setItem('user-token', newAccessToken)
      api.defaults.headers['Authorization'] = `Bearer ${newAccessToken}`

      onRefreshed(newAccessToken)
      config.headers['Authorization'] = `Bearer ${newAccessToken}`

      return api(config)
    } catch (refreshError) {
      // Refresh a échoué -> rediriger vers login
      sessionStorage.clear()
      window.location.href = '/'
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  }
)

export default api
```

---

## 4. Utilisation dans composants

### Hook `useFetch`
```js
import { useState, useEffect } from 'react'
import api from '../services/api'

export function useFetch(url, options = {}) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: result } = await api.get(url, options)
        setData(result)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [url])

  return { data, loading, error }
}
```

### Utilisation dans une page
```jsx
import { ticketService } from '../services/ticketService'

function TicketsList() {
  const { data: tickets, loading, error } = useFetch('/tickets')

  if (loading) return <Spinner />
  if (error) return <ErrorAlert message={error} />

  return (
    <div>
      {tickets?.map(ticket => (
        <TicketCard key={ticket.id} ticket={ticket} />
      ))}
    </div>
  )
}
```

---

## Structure recommandée

```
src/services/
├── api.js                    # Instance axios + interceptors
├── authService.js            # Auth endpoints
├── ticketService.js          # Ticket endpoints
├── userService.js            # User endpoints
└── ... (autres services)
```
