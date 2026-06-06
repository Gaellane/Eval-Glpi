# Guide pratique React — projet my-glpi

Ce document rassemble les bonnes pratiques, conventions et snippets utiles pour développer rapidement et proprement dans ce projet React (`my-glpi`). Il complète la checklist présente dans `docs/list.md`.

---

## Table des matières
- Introduction
- Structure du projet
- Installation et exécution
- Conventions de code
- Composants & Layouts
- Authentification et refresh token
- Services / API
- Styling (Tailwind)
- Debugging & pièges courants
- Checklist recommandée

---

## Introduction

Ce guide est conçu pour vous faciliter le développement day-to-day : conventions, modèles réutilisables, et exemples concrets (auth, refresh token, axios). Rédigé en français pour usage interne.

## Structure du projet

Principaux dossiers à connaître :

- `src/components/` : composants réutilisables (Header, Buttons, etc.)
- `src/pages/` : pages liées aux routes (LoginBO, Dashboard, ...)
- `src/layouts/` : layouts applicatifs (ex. `MainLayoutBO`)
- `src/services/` : couche d'accès API, utilitaires réseau
- `src/hooks/` : hooks personnalisés (ex. `useAuth`, `useFetch`)
- `src/assets/` : images / icônes
- `docs/` : documentation (vous êtes ici)

Exemples de fichiers utiles déjà présents :

- `src/pages/LoginBO.jsx` — formulaire de connexion
- `src/layouts/MainLayoutBO.jsx` — layout principal (gère refresh)
- `src/components/HeaderBO.jsx` — header réutilisable

## Installation & exécution

Commandes usuelles :

```bash
npm install
npm run dev
```

Pour construire la version de production :

```bash
npm run build
```

## Conventions de code

- Nommage composants : `PascalCase` (ex. `HeaderBO.jsx`).
- Fichiers de composants : `src/components/ComponentName.jsx`.
- Pages : `src/pages/PageName.jsx`.
- Layouts : `src/layouts/LayoutName.jsx`.
- Préférez `className` en JSX (note : certains templates utilisent `class` — migrer progressivement).
- Utilisez des hooks pour la logique réutilisable (`useAuth`, `useFetch`, `useLocalStorage`).

## Composants & Layouts

- Les layouts utilisent `react-router` et le slot `<Outlet />` pour afficher les pages enfants.
- Exemple d'utilisation de `MainLayoutBO` dans les routes :

```jsx
import { Routes, Route } from 'react-router-dom'
import MainLayoutBO from './layouts/MainLayoutBO'
import LoginBO from './pages/LoginBO'
import Dashboard from './pages/Dashboard'

<Routes>
  <Route path="/" element={<LoginBO />} />
  <Route element={<MainLayoutBO />}>
    <Route path="/dashboard" element={<Dashboard />} />
  </Route>
</Routes>
```

## Authentification & Refresh token

Recommandations de sécurité :

- Stocker le `refresh token` idéalement dans un cookie `HttpOnly` sécurisé (plus sûr contre le XSS).
- Le `access token` peut être stocké en mémoire ou dans `sessionStorage` si vous acceptez le compromis.

Si vous stockez en `sessionStorage`, voici un exemple robuste pour effectuer le refresh — inspiré de `MainLayoutBO` :

```js
// utils/auth.js
export async function refreshAccessToken(refreshToken) {
  const res = await fetch('/api/auth/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken })
  })

  if (!res.ok) throw new Error('refresh-failed')
  const data = await res.json()

  if (data.accessToken) sessionStorage.setItem('user-token', data.accessToken)
  if (data.refreshToken) sessionStorage.setItem('refresh-token', data.refreshToken)

  return data
}
```

Et la logique côté layout pour appeler ce refresh une seule fois (prévention double appel StrictMode) :

```jsx
import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { refreshAccessToken } from '../utils/auth'

function MainLayoutBO() {
  const navigate = useNavigate()
  const refreshingRef = useRef(false)

  useEffect(() => {
    const check = async () => {
      if (refreshingRef.current) return
      const refreshToken = sessionStorage.getItem('refresh-token')
      const accessToken = sessionStorage.getItem('user-token')

      if (!refreshToken) return navigate('/')
      if (!accessToken) {
        try {
          refreshingRef.current = true
          await refreshAccessToken(refreshToken)
        } catch (err) {
          navigate('/')
        } finally {
          refreshingRef.current = false
        }
      }
    }
    check()
  }, [navigate])
}
```

### Bonnes pratiques

- Eviter d'appeler une variable (string) comme une fonction — c'était la cause d'une erreur observée (`await refreshToken()` quand `refreshToken` est une string).
- En `StrictMode` React appelle certains effets deux fois en dev : utilisez un guard (`useRef`) pour éviter les double-calls indésirables.

## Services / API

Centralisez vos appels réseau dans `src/services/`.

Exemple d'instance Axios avec interceptor de refresh :

```js
// src/services/api.js
import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

let isRefreshing = false
let subscribers = []

function onRefreshed(token) {
  subscribers.forEach(cb => cb(token))
  subscribers = []
}

function addSubscriber(cb) { subscribers.push(cb) }

api.interceptors.response.use(
  res => res,
  async error => {
    const { config, response } = error
    if (response && response.status === 401 && !config._retry) {
      if (isRefreshing) {
        return new Promise(resolve => {
          addSubscriber(token => {
            config.headers['Authorization'] = `Bearer ${token}`
            resolve(axios(config))
          })
        })
      }

      config._retry = true
      isRefreshing = true
      try {
        const refreshToken = sessionStorage.getItem('refresh-token')
        const { data } = await axios.post('/api/auth/refresh', { refreshToken })
        const token = data.accessToken
        sessionStorage.setItem('user-token', token)
        api.defaults.headers['Authorization'] = `Bearer ${token}`
        onRefreshed(token)
        return axios(config)
      } catch (e) {
        window.location.href = '/'
        return Promise.reject(e)
      } finally {
        isRefreshing = false
      }
    }
    return Promise.reject(error)
  }
)

export default api
```

## Styling (Tailwind)

- Le projet utilise Tailwind CSS (classes utilitaires comme `bg-gray-50`, `text-teal-600`, ...).
- Pour le mode sombre, **préférez** `darkMode: 'class'` dans `tailwind.config.js` et ajoutez la classe `dark` au `<html>` ou à un wrapper si besoin.
- Pour forcer le rendu clair, retirez les classes `dark:` et utilisez les utilitaires clairs (`bg-white`, `text-gray-900`).

## Debugging & pièges courants

- Double exécution d'effets en dev : causé par `React.StrictMode`. Utilisez un guard (`useRef`) pour empêcher les doubles appels réseau.
- `class` vs `className` : JSX React attend `className`. Si vous voyez `class` dans certains fichiers, planifiez une migration progressive.
- Vérifiez toujours le type des variables avant de les appeler (`typeof refreshToken === 'string'`).

## Checklist recommandée

Reprenez la checklist complète dans `docs/list.md` et priorisez :

- Auth / Protected Route / Refresh (haut-priorité)
- DataTable, Formulaire générique, Modal, Toasts
- API Service + Interceptors
- Hooks utilitaires (`useFetch`, `useLocalStorage`, `useDebounce`)

## Exemples rapides & snippets

- Ajout d'un composant simple :

```jsx
// src/components/MyButton.jsx
function MyButton({ children }) {
  return <button className="px-4 py-2 bg-teal-600 text-white rounded">{children}</button>
}
export default MyButton
```

- Utiliser `MainLayoutBO` pour protéger des routes (voir plus haut).

## Prochaines étapes suggérées

- Ajouter un `src/services/api.js` si non présent et centraliser les appels.
- Migrer progressivement `class` -> `className` (scriptsed conversion possible).
- Implémenter les composants prioritaires de `docs/list.md` (DataTable, Modal, Auth).

---

Si vous voulez, je peux :
- générer des fichiers exemples (`src/services/api.js`, `src/hooks/useAuth.js`),
- convertir automatiquement les occurrences `class` en `className` (avec précaution),
- ou créer des templates de composants (Button, Modal, Toast).

Dites-moi ce que vous préférez comme prochaine étape.
