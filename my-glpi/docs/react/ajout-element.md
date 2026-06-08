
# Ajouter dynamiquement des éléments (inputs) en React

Ce document présente des patterns courants pour ajouter/supprimer des champs de saisie dynamiquement (par ex. cliquer sur un bouton "Ajouter" pour insérer un nouvel input).

## Principe de base

On maintient un état qui représente la liste des éléments à rendre (tableau de valeurs ou d'objets). À chaque ajout, on étend ce tableau ; à chaque suppression, on le filtre.

### Exemple recommandé (array d'objets avec id stable)

Cet exemple utilise un identifiant stable (via `useRef`) pour éviter d'utiliser l'index comme `key`, et gère le focus sur le nouvel input.

```jsx
import React, { useState, useRef, useEffect } from 'react';

function DynamicInputs() {
	const [items, setItems] = useState([{ id: 1, value: '' }]);
	const nextId = useRef(2);
	const inputRefs = useRef({});
	const lastAddedId = useRef(null);

	const addInput = () => {
		const id = nextId.current++;
		setItems(prev => [...prev, { id, value: '' }]);
		lastAddedId.current = id;
	};

	useEffect(() => {
		if (lastAddedId.current != null) {
			const id = lastAddedId.current;
			inputRefs.current[id]?.focus();
			lastAddedId.current = null;
		}
	}, [items]);

	const updateInput = (id, value) => {
		setItems(prev => prev.map(it => (it.id === id ? { ...it, value } : it)));
	};

	const removeInput = (id) => {
		setItems(prev => prev.filter(it => it.id !== id));
		delete inputRefs.current[id];
	};

	return (
		<div>
			{items.map(item => (
				<div key={item.id} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
					<input
						ref={el => (inputRefs.current[item.id] = el)}
						value={item.value}
						onChange={e => updateInput(item.id, e.target.value)}
						placeholder="Valeur"
					/>
					<button type="button" onClick={() => removeInput(item.id)}>Supprimer</button>
				</div>
			))}

			<button type="button" onClick={addInput}>Ajouter input</button>
		</div>
	);
}

export default DynamicInputs;
```

Points clés :
- Utiliser un `id` stable pour la `key` (éviter `index` si la liste est modifiable).
- Gérer les refs via un objet (`inputRefs.current[id]`) pour pouvoir focusser le nouvel élément.
- Utiliser la fonction de mise à jour `setItems(prev => ...)` pour éviter les problèmes de closure.

### Variante simple (tableau de strings)

Pour des cas très simples (ajouts uniquement, pas de réordonnancement), on peut stocker seulement des valeurs :

```jsx
function SimpleDynamicInputs() {
	const [values, setValues] = useState(['']);

	const add = () => setValues(v => [...v, '']);
	const update = (i, val) => setValues(v => v.map((x, idx) => (idx === i ? val : x)));
	const remove = i => setValues(v => v.filter((_, idx) => idx !== i));

	return (
		<div>
			{values.map((val, i) => (
				<div key={i}>
					<input value={val} onChange={e => update(i, e.target.value)} />
					<button type="button" onClick={() => remove(i)}>Supprimer</button>
				</div>
			))}
			<button type="button" onClick={add}>Ajouter</button>
		</div>
	);
}
```

Remarque : l'utilisation de `index` comme `key` est acceptable si la liste n'est que complétée (append-only) et jamais réordonnée ; sinon préférez un `id` stable.

### Plusieurs champs par ligne (objet avec plusieurs propriétés)

Si chaque ligne contient plusieurs champs (nom, quantité, etc.), stockez un tableau d'objets et mettez à jour la propriété ciblée :

```jsx
function MultiFieldRows() {
	const [rows, setRows] = useState([{ id: 1, name: '', qty: '' }]);
	const nextId = useRef(2);

	const addRow = () => setRows(r => [...r, { id: nextId.current++, name: '', qty: '' }]);
	const updateRow = (id, field, value) => setRows(r => r.map(row => (row.id === id ? { ...row, [field]: value } : row)));
	const removeRow = id => setRows(r => r.filter(row => row.id !== id));

	return (
		<div>
			{rows.map(row => (
				<div key={row.id} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
					<input value={row.name} onChange={e => updateRow(row.id, 'name', e.target.value)} placeholder="Nom" />
					<input value={row.qty} onChange={e => updateRow(row.id, 'qty', e.target.value)} placeholder="Quantité" />
					<button type="button" onClick={() => removeRow(row.id)}>Supprimer</button>
				</div>
			))}
			<button type="button" onClick={addRow}>Ajouter ligne</button>
		</div>
	);
}
```

## Bonnes pratiques

- Préférer des `key` stables (id) plutôt que l'index.
- Pour des formulaires complexes, utiliser une librairie comme `react-hook-form` pour de meilleures performances et gestion de la validation.
- Gérer le focus avec des refs si vous voulez que le nouvel élément soit actif immédiatement.
- Pré-calculer/valider hors du rendu principal si les opérations deviennent coûteuses.

---

Souhaitez-vous que j'ajoute un exemple TypeScript, une variante avec `react-hook-form`, ou que j'intègre l'exemple dans un composant du projet ?

