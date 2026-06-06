# Buttons - Composants boutons

## Vue d'ensemble
Composants boutons réutilisables pour différents état et actions.

---

## 1. Button Simple

### Description
Bouton standard pour les actions régulières.

### Props
```js
/**
 * @param {ReactNode} children - Contenu du bouton
 * @param {function} onClick - Callback au clic
 * @param {string} className - Classes Tailwind supplémentaires
 * @param {boolean} disabled - État désactivé
 * @param {'button'|'submit'|'reset'} type - Type de bouton
 */
```

### Exemple
```jsx
function SimpleButton() {
  return (
    <button className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition">
      Click me
    </button>
  )
}
```

### Bonnes pratiques
- Ajouter des hover states pour meilleure UX
- Utiliser `disabled` pour indiquer l'état non-cliquable
- Préférer Tailwind pour la cohérence

---

## 2. Icon Button

### Description
Bouton contenant une ou plusieurs icônes.

### Props
```js
/**
 * @param {ReactNode} icon - Élément icône
 * @param {function} onClick - Callback au clic
 * @param {'sm'|'md'|'lg'} size - Taille du bouton
 * @param {'primary'|'secondary'|'danger'} variant - Style du bouton
 */
```

### Exemple
```jsx
function IconButton({ icon, onClick }) {
  return (
    <button onClick={onClick} className="p-2 hover:bg-gray-200 rounded">
      {icon}
    </button>
  )
}
```

---

## 3. Loading Button

### Description
Bouton avec indicateur de chargement.

### Props
```js
/**
 * @param {boolean} loading - État de chargement
 * @param {ReactNode} children - Texte du bouton
 * @param {function} onClick - Callback au clic
 */
```

### Exemple
```jsx
function LoadingButton({ loading, children, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="px-4 py-2 bg-teal-600 text-white rounded disabled:opacity-50"
    >
      {loading ? '⏳ Chargement...' : children}
    </button>
  )
}
```

---

## 4. Submit Button

### Description
Bouton optimisé pour les soumissions de formulaire.

### Props
```js
/**
 * @param {string} label - Texte du bouton (défaut: 'Envoyer')
 * @param {boolean} loading - État de chargement
 * @param {boolean} disabled - État désactivé
 */
```

### Exemple
```jsx
function SubmitButton({ label = 'Envoyer', loading = false, disabled = false }) {
  return (
    <button
      type="submit"
      disabled={disabled || loading}
      className="w-full px-4 py-2 bg-teal-600 text-white rounded disabled:opacity-50"
    >
      {loading ? 'Envoi...' : label}
    </button>
  )
}
```

---

## 5. Confirmation Button

### Description
Bouton avec confirmation avant action.

### Props
```js
/**
 * @param {function} onConfirm - Callback à la confirmation
 * @param {string} label - Texte du bouton principal
 * @param {string} confirmLabel - Texte bouton confirmation
 * @param {string} cancelLabel - Texte bouton annulation
 */
```

### Exemple
```jsx
function ConfirmationButton({ onConfirm, label = 'Supprimer' }) {
  const [showConfirm, setShowConfirm] = useState(false)

  if (showConfirm) {
    return (
      <div className="flex gap-2">
        <button onClick={onConfirm} className="px-2 py-1 bg-red-600 text-white rounded">
          Confirmer
        </button>
        <button onClick={() => setShowConfirm(false)} className="px-2 py-1 bg-gray-400 text-white rounded">
          Annuler
        </button>
      </div>
    )
  }

  return (
    <button onClick={() => setShowConfirm(true)} className="px-4 py-2 bg-red-600 text-white rounded">
      {label}
    </button>
  )
}
```

---

## Variantes Tailwind recommandées

```js
// Couleurs primaires
'bg-teal-600 hover:bg-teal-700'
'bg-blue-600 hover:bg-blue-700'

// Danger
'bg-red-600 hover:bg-red-700'

// Secondaire
'bg-gray-600 hover:bg-gray-700'

// Désactivé
'disabled:opacity-50 disabled:cursor-not-allowed'
```
