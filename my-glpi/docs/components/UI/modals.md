# Modals & Popups

## Vue d'ensemble
Composants pour afficher du contenu ou des formulaires en overlay.

---

## 1. Modal Simple

### Description
Modal basique pour afficher du contenu.

### Props
```js
/**
 * @param {boolean} isOpen - Modal ouvert/fermé
 * @param {function} onClose - Callback à la fermeture
 * @param {string} title - Titre du modal
 * @param {ReactNode} children - Contenu du modal
 */
```

### Exemple
```jsx
import { useState } from 'react'

function ModalSimple() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="px-4 py-2 bg-teal-600 text-white rounded">
        Ouvrir Modal
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Titre</h2>
              <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>
            <p>Contenu du modal</p>
          </div>
        </div>
      )}
    </>
  )
}
```

### Bonnes pratiques
- Fermer avec Escape (ajouter `useEffect` avec `keydown`)
- Utiliser `fixed` et backdrop semi-transparent
- Z-index haut pour être visible

---

## 2. Modal de Confirmation

### Description
Modal pour confirmer une action avant exécution.

### Props
```js
/**
 * @param {boolean} isOpen - Modal ouvert/fermé
 * @param {string} title - Titre du modal
 * @param {string} message - Message de confirmation
 * @param {function} onConfirm - Callback à la confirmation
 * @param {function} onCancel - Callback à l'annulation
 */
```

### Exemple
```jsx
function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-sm">
        <h2 className="text-lg font-bold mb-2">{title}</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>
  )
}
```

---

## 3. Modal Formulaire

### Description
Modal contenant un formulaire.

### Props
```js
/**
 * @param {boolean} isOpen - Modal ouvert/fermé
 * @param {string} title - Titre du formulaire
 * @param {function} onSubmit - Callback à la soumission avec les données
 * @param {function} onClose - Callback à la fermeture
 */
```

### Exemple
```jsx
function FormModal({ isOpen, title, onSubmit, onClose }) {
  const [formData, setFormData] = useState({})

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-lg font-bold mb-4">{title}</h2>
        <form onSubmit={(e) => {
          e.preventDefault()
          onSubmit(formData)
          onClose()
        }}>
          <input
            type="text"
            placeholder="Nom"
            className="w-full mb-3 px-3 py-2 border border-gray-300 rounded"
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-400 text-white rounded"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-teal-600 text-white rounded"
            >
              Envoyer
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
```

---

## 4. Modal Plein Écran

### Description
Modal qui occupe tout l'écran.

### Exemple
```jsx
function FullscreenModal({ isOpen, onClose, children }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-white flex flex-col">
      <div className="flex justify-between items-center p-4 border-b">
        <h1 className="text-2xl font-bold">Titre</h1>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          ✕
        </button>
      </div>
      <div className="flex-1 overflow-auto p-4">
        {children}
      </div>
    </div>
  )
}
```

---

## 5. Drawer Latéral

### Description
Tiroir qui glisse depuis le côté.

### Props
```js
/**
 * @param {boolean} isOpen - Drawer ouvert/fermé
 * @param {function} onClose - Callback à la fermeture
 * @param {'left'|'right'} position - Position du drawer (défaut: 'right')
 * @param {ReactNode} children - Contenu du drawer
 */
```

### Exemple
```jsx
function Drawer({ isOpen, onClose, position = 'right', children }) {
  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-30" onClick={onClose} />}
      <div
        className={`fixed top-0 h-full w-64 bg-white shadow-lg transform transition-transform ${
          position === 'right' ? 'right-0' : 'left-0'
        } ${isOpen ? 'translate-x-0' : (position === 'right' ? 'translate-x-full' : '-translate-x-full')}`}
      >
        <div className="p-4 flex justify-between items-center border-b">
          <h2 className="font-bold">Menu</h2>
          <button onClick={onClose}>✕</button>
        </div>
        <div className="p-4">
          {children}
        </div>
      </div>
    </>
  )
}
```

---

## Patterns recommandés

- Utiliser `useClickOutside` pour fermer au clic externe
- Gérer le scroll du body (ajouter `overflow-hidden` lors de l'ouverture)
- Fermer avec Escape : implémenter dans `useEffect` avec `keydown`
