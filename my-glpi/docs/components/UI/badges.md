# Badges & Labels

## Vue d'ensemble
Petits indicateurs pour afficher des statuts ou des compteurs.

---

## 1. Badge de Statut

### Description
Badge coloré pour indiquer un statut.

### Props
```typescript
interface BadgeProps {
  label: string
  status?: 'success' | 'error' | 'warning' | 'info'
}
```

### Exemple
```jsx
function StatusBadge({ label, status = 'info' }) {
  const colorMap = {
    success: 'bg-green-100 text-green-800',
    error: 'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800',
    info: 'bg-blue-100 text-blue-800'
  }

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${colorMap[status]}`}>
      {label}
    </span>
  )
}
```

### Utilisation
```jsx
<StatusBadge label="En cours" status="info" />
<StatusBadge label="Complété" status="success" />
<StatusBadge label="Erreur" status="error" />
```

---

## 2. Badge Compteur

### Description
Petit badge affichant une quantité.

### Exemple
```jsx
function CounterBadge({ count }) {
  return (
    <span className="inline-flex items-center justify-center w-6 h-6 bg-teal-600 text-white text-xs font-bold rounded-full">
      {count}
    </span>
  )
}
```

### Exemple dans un menu
```jsx
<div className="flex items-center gap-2">
  <span>Notifications</span>
  <CounterBadge count={5} />
</div>
```

---

## Variantes de couleurs

```jsx
const variants = {
  primary: 'bg-teal-100 text-teal-800',
  secondary: 'bg-gray-100 text-gray-800',
  success: 'bg-green-100 text-green-800',
  warning: 'bg-yellow-100 text-yellow-800',
  danger: 'bg-red-100 text-red-800'
}
```
