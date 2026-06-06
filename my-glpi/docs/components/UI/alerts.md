# Alertes

## Vue d'ensemble
Composants pour afficher des messages d'alerte persistants.

---

## 1. Success Alert

### Description
Alerte verte pour messages de succès.

### Props
```typescript
interface AlertProps {
  message: string
  title?: string
  onClose?: () => void
}
```

### Exemple
```jsx
function SuccessAlert({ message, title, onClose }) {
  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex justify-between items-start">
      <div>
        {title && <h3 className="font-bold text-green-800 mb-1">{title}</h3>}
        <p className="text-green-700">{message}</p>
      </div>
      {onClose && (
        <button onClick={onClose} className="text-green-600 hover:text-green-800">
          ✕
        </button>
      )}
    </div>
  )
}
```

---

## 2. Error Alert

### Description
Alerte rouge pour erreurs.

### Exemple
```jsx
function ErrorAlert({ message, title, onClose }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex justify-between items-start">
      <div>
        {title && <h3 className="font-bold text-red-800 mb-1">{title}</h3>}
        <p className="text-red-700">{message}</p>
      </div>
      {onClose && (
        <button onClick={onClose} className="text-red-600 hover:text-red-800">
          ✕
        </button>
      )}
    </div>
  )
}
```

---

## 3. Warning Alert

### Description
Alerte orange pour avertissements.

### Exemple
```jsx
function WarningAlert({ message, title, onClose }) {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex justify-between items-start">
      <div>
        {title && <h3 className="font-bold text-yellow-800 mb-1">{title}</h3>}
        <p className="text-yellow-700">{message}</p>
      </div>
      {onClose && (
        <button onClick={onClose} className="text-yellow-600 hover:text-yellow-800">
          ✕
        </button>
      )}
    </div>
  )
}
```

---

## 4. Info Alert

### Description
Alerte bleue pour informations.

### Exemple
```jsx
function InfoAlert({ message, title, onClose }) {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex justify-between items-start">
      <div>
        {title && <h3 className="font-bold text-blue-800 mb-1">{title}</h3>}
        <p className="text-blue-700">{message}</p>
      </div>
      {onClose && (
        <button onClick={onClose} className="text-blue-600 hover:text-blue-800">
          ✕
        </button>
      )}
    </div>
  )
}
```

---

## Alert Container

```jsx
function AlertContainer() {
  const [alerts, setAlerts] = useState([
    { id: 1, type: 'success', title: 'Succès', message: 'Opération réalisée' }
  ])

  return (
    <div className="space-y-3">
      {alerts.map(alert => (
        <div key={alert.id}>
          {alert.type === 'success' && (
            <SuccessAlert
              title={alert.title}
              message={alert.message}
              onClose={() => setAlerts(alerts.filter(a => a.id !== alert.id))}
            />
          )}
          {alert.type === 'error' && (
            <ErrorAlert
              title={alert.title}
              message={alert.message}
              onClose={() => setAlerts(alerts.filter(a => a.id !== alert.id))}
            />
          )}
        </div>
      ))}
    </div>
  )
}
```

---

## Différence Toast vs Alert

| Toast | Alert |
|-------|-------|
| Auto-dismiss | Persistant |
| Flottant (fixed) | Inline (static) |
| Notifications brèves | Messages importants |
