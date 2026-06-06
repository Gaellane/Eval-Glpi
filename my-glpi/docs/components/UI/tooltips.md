# Tooltips

## Vue d'ensemble
Petites infobulle qui apparaissent au survol.

---

## 1. Tooltip Simple

### Description
Tooltip basique au survol.

### Props
```typescript
interface TooltipProps {
  content: string
  children: ReactNode
}
```

### Exemple
```jsx
import { useState } from 'react'

function Tooltip({ content, children }) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
      >
        {children}
      </div>

      {visible && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-sm rounded whitespace-nowrap">
          {content}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800" />
        </div>
      )}
    </div>
  )
}
```

### Utilisation
```jsx
<Tooltip content="Aide">
  <button>?</button>
</Tooltip>
```

---

## 2. Tooltip Positionnable

### Description
Tooltip avec position configurable.

### Props
```typescript
interface PositionableTooltipProps {
  content: string
  position?: 'top' | 'bottom' | 'left' | 'right'
  children: ReactNode
}
```

### Exemple
```jsx
function PositionableTooltip({ content, position = 'top', children }) {
  const [visible, setVisible] = useState(false)

  const positionClasses = {
    top: 'bottom-full mb-2 left-1/2 -translate-x-1/2',
    bottom: 'top-full mt-2 left-1/2 -translate-x-1/2',
    left: 'right-full mr-2 top-1/2 -translate-y-1/2',
    right: 'left-full ml-2 top-1/2 -translate-y-1/2'
  }

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
      >
        {children}
      </div>

      {visible && (
        <div className={`absolute ${positionClasses[position]} px-3 py-1 bg-gray-800 text-white text-sm rounded whitespace-nowrap`}>
          {content}
        </div>
      )}
    </div>
  )
}
```

---

## Bonnes pratiques

- Délai court avant affichage/masquage
- Z-index suffisant (100+)
- Responsive : masquer sur mobile (sauf tap)
