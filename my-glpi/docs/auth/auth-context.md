# Auth Context & Login Form

## Vue d'ensemble
Gestion globale de l'authentification et formulaire de connexion.

---

## 1. Auth Context

### Description
Context React pour l'authentification globale.

### Code : `src/contexts/AuthContext.jsx`
```jsx
import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/authService'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // Charger les données au démarrage
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = sessionStorage.getItem('user-token')
      const storedUser = sessionStorage.getItem('user')

      if (storedToken && storedUser) {
        setToken(storedToken)
        setUser(JSON.parse(storedUser))
      }
      setLoading(false)
    }

    initAuth()
  }, [])

  const login = useCallback(async (email, password) => {
    try {
      const { accessToken, user: userData } = await authService.login(email, password)
      setToken(accessToken)
      setUser(userData)
      navigate('/dashboard')
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur de connexion')
    }
  }, [navigate])

  const logout = useCallback(async () => {
    try {
      await authService.logout()
    } finally {
      setUser(null)
      setToken(null)
      navigate('/')
    }
  }, [navigate])

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token,
    login,
    logout
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider')
  }
  return context
}
```

---

## 2. Login Form

### Description
Formulaire de connexion tié au contexte d'authentification.

### Code : `src/pages/LoginBO.jsx`
```jsx
import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import TextInput from '../components/Forms/TextInput'
import PasswordInput from '../components/Forms/PasswordInput'
import SubmitButton from '../components/Buttons/SubmitButton'
import { useToast } from '../hooks/useToast'

export default function LoginBO() {
  const { login } = useAuth()
  const { addToast } = useToast()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.email) newErrors.email = 'Email requis'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email invalide'
    }
    if (!formData.password) newErrors.password = 'Mot de passe requis'
    else if (formData.password.length < 6) {
      newErrors.password = 'Minimum 6 caractères'
    }
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validateForm()

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    try {
      await login(formData.email, formData.password)
      addToast('Connexion réussie!', 'success')
    } catch (error) {
      addToast(error.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section class="bg-gray-50 min-h-screen flex items-center justify-center">
      <div class="w-full bg-white rounded-lg shadow max-w-md p-6">
        <h1 class="text-2xl font-bold text-gray-900 mb-6">Se connecter</h1>

        <form onSubmit={handleSubmit} class="space-y-4">
          <TextInput
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="nom@example.com"
          />

          <PasswordInput
            label="Mot de passe"
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
          />

          <SubmitButton
            label="Se connecter"
            loading={loading}
            disabled={loading}
          />
        </form>

        <p class="text-center text-gray-600 text-sm mt-4">
          Pas encore inscrit? <a href="/register" class="text-teal-600 hover:underline">S'inscrire</a>
        </p>
      </div>
    </section>
  )
}
```

---

## 3. Forgot Password

### Description
Formulaire de récupération de mot de passe.

### Exemple
```jsx
function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const { addToast } = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/auth/forgot-password', { email })
      addToast('Email de réinitialisation envoyé!', 'success')
    } catch (error) {
      addToast(error.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <TextInput
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <SubmitButton label="Envoyer lien" loading={loading} />
    </form>
  )
}
```

---

## Bonnes pratiques

- Stocker tokens en sessionStorage (éphémère) ou cookies HttpOnly
- Toujours valider email/mot de passe côté client ET serveur
- Gérer les erreurs de connexion proprement
- Implémenter un refresh token automatique
