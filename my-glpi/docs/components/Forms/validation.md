# Validation de Formulaires

## Vue d'ensemble
Gestion des erreurs et validation des formulaires.

---

## 1. Gestion des Erreurs

### Description
Centraliser les erreurs de formulaire.

### Exemple
```jsx
function useFormErrors() {
  const [errors, setErrors] = useState({})

  const setError = (field, error) => {
    setErrors(prev => ({
      ...prev,
      [field]: error
    }))
  }

  const clearError = (field) => {
    setErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[field]
      return newErrors
    })
  }

  const clearAll = () => setErrors({})

  return { errors, setError, clearError, clearAll }
}
```

### Utilisation
```jsx
function MyForm() {
  const { errors, setError, clearAll } = useFormErrors()
  const [formData, setFormData] = useState({})

  const handleSubmit = (e) => {
    e.preventDefault()
    clearAll()

    // Valider
    if (!formData.email) setError('email', 'Email requis')
    if (formData.password?.length < 8) setError('password', 'Min 8 caractères')

    if (Object.keys(errors).length === 0) {
      // Soumettre
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <TextInput
        label="Email"
        value={formData.email}
        onChange={(v) => setFormData({ ...formData, email: v })}
        error={errors.email}
      />
    </form>
  )
}
```

---

## 2. Messages d'Erreur

### Description
Afficher les messages d'erreur sous les champs.

### Exemple
```jsx
function FormError({ message }) {
  if (!message) return null
  return <p className="text-red-500 text-sm mt-1">{message}</p>
}
```

### Pattern dans les inputs
```jsx
<input className={error ? 'border-red-500' : 'border-gray-300'} />
<FormError message={error} />
```

---

## 3. Validation Formulaire

### Description
Fonction de validation réutilisable.

### Exemple
```jsx
const validators = {
  required: (value, label) => {
    if (!value || value.trim() === '') return `${label} est requis`
    return null
  },
  email: (value) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!regex.test(value)) return 'Email invalide'
    return null
  },
  minLength: (value, length) => {
    if (value.length < length) return `Minimum ${length} caractères`
    return null
  },
  maxLength: (value, length) => {
    if (value.length > length) return `Maximum ${length} caractères`
    return null
  },
  match: (value, compareValue, label) => {
    if (value !== compareValue) return `${label} ne correspond pas`
    return null
  }
}

// Utilisation
const validateEmail = validators.required('test@test.com', 'Email')
const validatePassword = validators.minLength('pass', 8)
```

---

## 4. Validation Complète

### Exemple complet avec tous les champs
```jsx
function validateForm(data) {
  const errors = {}

  const emailError = validators.required(data.email, 'Email')
  if (emailError) errors.email = emailError
  else {
    const emailFormatError = validators.email(data.email)
    if (emailFormatError) errors.email = emailFormatError
  }

  const passwordError = validators.required(data.password, 'Mot de passe')
  if (passwordError) {
    errors.password = passwordError
  } else {
    const minError = validators.minLength(data.password, 8)
    if (minError) errors.password = minError
  }

  return errors
}
```

---

## Bonnes pratiques

- Valider au blur et au submit
- Afficher un message d'erreur clair
- Désactiver le bouton submit si erreurs
- Nettoyer les erreurs avant soumission
