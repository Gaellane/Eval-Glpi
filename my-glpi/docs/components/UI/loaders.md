# Loaders & Loading States

## Vue d'ensemble
Indicateurs de chargement et d'attente.

---

## 1. Spinner

### Description
Indicateur rotatif de chargement.

### Exemple
```jsx
function Spinner({ size = 'md' }) {
  const sizeClass = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }[size]

  return (
    <div className={`${sizeClass} border-4 border-gray-300 border-t-teal-600 rounded-full animate-spin`} />
  )
}
```

### Utilisation
```jsx
<Spinner size="lg" />
```

---

## 2. Progress Bar

### Description
Barre de progression linéaire.

### Props
```typescript
interface ProgressBarProps {
  progress: number // 0-100
  label?: string
}
```

### Exemple
```jsx
function ProgressBar({ progress, label }) {
  return (
    <div>
      {label && <p className="text-sm font-medium mb-2">{label}</p>}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-teal-600 h-2 rounded-full transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-xs text-gray-500 mt-1">{progress}%</p>
    </div>
  )
}
```

---

## 3. Skeleton Loader

### Description
Placeholder animé pour contenu en chargement.

### Exemple
```jsx
function SkeletonLoader() {
  return (
    <div className="space-y-4">
      <div className="h-4 bg-gray-300 rounded animate-pulse" />
      <div className="h-4 bg-gray-300 rounded animate-pulse w-5/6" />
      <div className="h-4 bg-gray-300 rounded animate-pulse w-4/6" />
    </div>
  )
}
```

### Cas d'usage : Card avec Skeleton

```jsx
function CardSkeleton() {
  return (
    <div className="border rounded-lg p-4">
      <div className="h-48 bg-gray-300 rounded animate-pulse mb-4" />
      <div className="h-4 bg-gray-300 rounded animate-pulse mb-2" />
      <div className="h-4 bg-gray-300 rounded animate-pulse w-5/6" />
    </div>
  )
}
```

---

## Patterns recommandés

- Utiliser `animate-spin` pour les spinners
- Utiliser `animate-pulse` pour les skeletons
- Combiner avec transition smooth pour meilleure UX
