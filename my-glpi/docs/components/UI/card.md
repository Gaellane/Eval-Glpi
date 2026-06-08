# Card - Composants de cartes

## Vue d'ensemble
Composants Card pour afficher des contenus structurés en conteneurs distincts avec ombres, bordures et espacements cohérents.

---

## 1. Card Simple

### Description
Carte basique avec un contenu simple et un style épuré.

### Props
```js
/**
 * @param {ReactNode} children - Contenu de la carte
 * @param {string} className - Classes Tailwind supplémentaires
 * @param {string} title - Titre optionnel de la carte
 */
```

### Exemple
```jsx
function SimpleCard() {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm transition-all duration-200">
      <h3 className="text-lg font-bold text-slate-900 mb-2">Card Title</h3>
      <p className="text-slate-600">Contenu de la carte</p>
    </div>
  )
}
```

### Bonnes pratiques
- Utiliser `shadow` pour la profondeur visuelle
- Appliquer `rounded-lg` pour les coins arrondis
- Ajouter du padding `p-6` pour l'espacement interne
- Utiliser du fond blanc `bg-white` pour la cohérence

---

## 2. Card avec En-tête

### Description
Carte avec un en-tête distinct contenant titre et actions.

### Props
```js
/**
 * @param {string} title - Titre de la carte
 * @param {ReactNode} headerAction - Élément d'action (bouton, etc.)
 * @param {ReactNode} children - Contenu de la carte
 * @param {string} className - Classes Tailwind supplémentaires
 */
```

### Exemple
```jsx
function CardWithHeader() {
  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden transition-all duration-300">
      <div className="border-b border-slate-100 px-6 py-4 flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-900">Titre</h3>
        <button className="text-slate-500 hover:text-slate-700">⋯</button>
      </div>
      <div className="px-6 py-4 text-slate-600">
        <p>Contenu de la carte</p>
      </div>
    </div>
  )
}
```

### Bonnes pratiques
- Séparer l'en-tête avec `border-b`
- Utiliser `overflow-hidden` pour respecter les coins arrondis
- Aligner le titre à gauche, les actions à droite

---

## 3. Card avec Pied de page

### Description
Carte avec contenu principal et pied de page pour les actions.

### Props
```js
/**
 * @param {ReactNode} children - Contenu principal
 * @param {ReactNode} footer - Contenu du pied de page
 * @param {string} className - Classes Tailwind supplémentaires
 */
```

### Exemple
```jsx
function CardWithFooter() {
  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden transition-all duration-300">
      <div className="px-6 py-4 text-slate-600">
        <p>Contenu principal de la carte</p>
      </div>
      <div className="border-t border-slate-100 px-6 py-4 bg-slate-50 flex justify-end gap-2">
        <button className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded">Annuler</button>
        <button className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700">Confirmer</button>
      </div>
    </div>
  )
}
```

### Bonnes pratiques
- Ajouter `border-t` pour séparer le pied
- Utiliser `bg-gray-50` pour distinguer le pied
- Aligner les actions à droite avec `justify-end`

---

## 4. Card avec Image

### Description
Carte contenant une image en en-tête et du contenu en dessous.

### Props
```js
/**
 * @param {string} image - URL de l'image
 * @param {string} alt - Texte alternatif de l'image
 * @param {string} title - Titre de la carte
 * @param {ReactNode} children - Contenu texte
 */
```

### Exemple
```jsx
function CardWithImage() {
  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden transition-all duration-300">
      <div className="h-48 bg-slate-300 overflow-hidden">
        <img src="image.jpg" alt="Card image" className="w-full h-full object-cover" />
      </div>
      <div className="px-6 py-4">
        <h3 className="text-lg font-bold text-slate-900 mb-2">Titre</h3>
        <p className="text-slate-600 text-sm">Description de la carte avec image</p>
      </div>
    </div>
  )
}
```

### Bonnes pratiques
- Fixer une hauteur pour l'image avec `h-48`
- Utiliser `object-cover` pour respecter les proportions
- Permettre l'overflow avec `overflow-hidden`

---

## 5. Card avec État (Info/Success/Warning/Error)

### Description
Carte avec couleur de bordure ou fond indiquant un état.

### Props
```js
/**
 * @param {'info'|'success'|'warning'|'error'} state - État de la carte
 * @param {string} title - Titre de la carte
 * @param {ReactNode} children - Contenu
 */
```

### Exemple
```jsx
function StateCard({ state = 'info' }) {
  const stateStyles = {
    info: 'border-blue-300 bg-blue-50',
    success: 'border-teal-300 bg-teal-50',
    warning: 'border-amber-300 bg-amber-50',
    error: 'border-red-300 bg-red-50'
  }
  
  return (
    <div className={`bg-white border border-slate-200 rounded-lg border-l-4 ${stateStyles[state]} px-6 py-4`}>
      <h3 className="text-lg font-bold text-slate-900 mb-1">Titre</h3>
      <p className="text-slate-700">Message d'état</p>
    </div>
  )
}
```

### Bonnes pratiques
- Utiliser la bordure gauche `border-l-4` pour indiquer l'état
- Maintenir les couleurs de l'app (teal pour succès, rouge pour erreur)
- Combiner couleur de bordure et couleur de fond légère

---

## Variantes de Style

### Shadows
```jsx
// Léger
className="shadow-sm"

// Standard
className="shadow"

// Élevé
className="shadow-lg"

// Très élevé
className="shadow-xl"
```

### Bordures
```jsx
// Sans bordure
// (défaut)

// Avec bordure légère
className="border border-gray-200"

// Avec bordure colorée
className="border border-teal-300"

// Avec bordure gauche accentuée
className="border-l-4 border-teal-600"
```

### Espacements
```jsx
// Petit
className="p-3"

// Standard
className="p-6"

// Grand
className="p-8"
```

---

## Bonnes pratiques générales

1. **Hiérarchie visuelle** : Utiliser les ombres et bordures pour suggérer l'importance
2. **Espacement** : Maintenir du padding cohérent (`p-6` standard)
3. **Lisibilité** : Assurer un contraste suffisant entre le texte et le fond
4. **États visuels** : Indiquer les états avec couleurs ou icônes
5. **Responsivité** : Adapter le layout sur mobile (stack verticalement si nécessaire)
6. **Accessibilité** : Ajouter des `alt` pour les images, sémantique HTML correcte
