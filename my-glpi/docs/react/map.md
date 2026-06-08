
# `map()` — transformer et rendre des listes (JS / React)

> Cette page explique l'usage de `Array.prototype.map()` en JavaScript et en React, les bonnes pratiques pour le rendu de listes, et plusieurs techniques pour éviter ou supprimer les doublons dans les données avant rendu.

## 1. Rappel : qu'est-ce que `map()` ?

`map()` parcourt un tableau et retourne un nouveau tableau contenant le résultat d'une fonction appliquée à chaque élément.

```js
const numbers = [1, 2, 3];
const doubled = numbers.map(n => n * 2); // [2,4,6]
```

En React on l'utilise très souvent pour transformer des données en éléments JSX :

```jsx
function List({ items }) {
	return (
		<ul>
			{items.map(item => (
				<li key={item.id}>{item.name}</li>
			))}
		</ul>
	);
}
```

## 2. Bonnes pratiques pour le rendu en React

- Toujours fournir une `key` unique et stable pour chaque élément rendu via `map` (ex : `item.id`).
- Évitez d'utiliser l'index du tableau (`map((item, i) => ... key={i})`) sauf si la liste est immuable et append-only.
- Ne générez pas des clés aléatoires (`Math.random()`), cela empêche React d'optimiser le diffing.
- Si votre `map` retourne plusieurs éléments frères, utilisez un `React.Fragment` avec `key` :

```jsx
{terms.map(t => (
	<React.Fragment key={t.id}>
		<dt>{t.term}</dt>
		<dd>{t.definition}</dd>
	</React.Fragment>
))}
```

## 3. `map` vs `forEach`

`forEach` exécute une fonction pour chaque élément mais ne retourne rien. Dans le JSX, utilisez `map` (ou construisez un tableau d'éléments avec une boucle classique) :

```jsx
// Mauvais
{items.forEach(i => <div>{i.name}</div>)} // undefined

// Bon
{items.map(i => <div key={i.id}>{i.name}</div>)}
```

## 4. Chainer `filter`, `sort`, `map`

Il est courant de filtrer / trier puis mapper :

```jsx
{items
	.filter(i => i.visible)
	.sort((a,b) => a.name.localeCompare(b.name))
	.map(i => <Card key={i.id} {...i} />)
}
```

Pour des calculs coûteux, pré-calculer ou utiliser `useMemo` pour éviter de recalculer à chaque rendu.

## 5. Éviter et supprimer les doublons

Les doublons peuvent venir de la source de données (API, concaténation, import) et provoquer un affichage répété ou des problèmes de `key`. Deux usages : (A) empêcher d'envoyer/rendre des éléments en double ; (B) garantir des clés uniques.

### 5.1. Valeurs primitives (strings, numbers)

```js
const arr = ['a','b','a','c'];
const unique = [...new Set(arr)]; // ['a','b','c']
```

### 5.2. Tableaux d'objets — déduplication par `id`

1) Avec `Map` (garde la dernière occurrence pour chaque `id`) :

```js
const uniqueById = Array.from(new Map(arr.map(item => [item.id, item])).values());
```

2) Garder la première occurrence (filtre + Set) :

```js
const seen = new Set();
const unique = arr.filter(item => {
	if (seen.has(item.id)) return false;
	seen.add(item.id);
	return true;
});
```

3) Avec `reduce` :

```js
const unique = arr.reduce((acc, cur) => {
	if (!acc.find(x => x.id === cur.id)) acc.push(cur);
	return acc;
}, []);
```

4) Utiliser une lib utilitaire :

```js
import uniqBy from 'lodash/uniqBy';
const unique = uniqBy(arr, 'id');
```

### 5.3. Déduplication sur une clé composée ou normalisée

Si les doublons se basent sur une propriété non normalisée (ex : `name` sensible à la casse) :

```js
const uniqueByName = Array.from(
	new Map(arr.map(item => [item.name.trim().toLowerCase(), item])).values()
);
```

### 5.4. Dédupliquer avant de `map`

Toujours dédupliquer les données avant de faire `map` afin de garantir des `key` uniques et d'éviter de rendre plusieurs fois le même composant :

```jsx
const deduped = useMemo(() => {
	const seen = new Set();
	return items.filter(i => {
		if (seen.has(i.id)) return false;
		seen.add(i.id);
		return true;
	});
}, [items]);

return (
	<ul>
		{deduped.map(i => <li key={i.id}>{i.name}</li>)}
	</ul>
);
```

### 5.5. Eviter les doublons côté UI

- Valider côté formulaire avant d'ajouter un élément (ex : vérifier `assets` ne contient pas déjà l'asset sélectionné).
- Afficher un message utilisateur si tentative d'ajout d'un doublon.

## 6. Gestion des `key` et conséquences des doublons

- Si vous avez des clés dupliquées, React ne peut pas correctement associer éléments/diff — cela peut provoquer des réutilisations d'état ou du DOM inattendu.
- Assurez-vous que la valeur utilisée pour `key` est stable (ne change pas entre les rendus) et unique.
- Pour créer une clé composite : `key={`${item.type}-${item.id}`}`.

## 7. Performance et bonnes pratiques

- Pré-calculer et mémoriser les listes transformées avec `useMemo` si la transformation est coûteuse.
- Eviter de faire `sort` ou gros calculs directement dans le JSX.
- Pour très grandes listes, utiliser la virtualisation (`react-window`, `react-virtualized`).

## 8. Exemples pratiques

1) Dédupliquer des assets par `id` puis rendre :

```jsx
const dedupedAssets = useMemo(() => {
	return Array.from(new Map(assets.map(a => [a.id, a])).values());
}, [assets]);

return (
	<div>
		{dedupedAssets.map(a => (
			<AssetCard key={a.id} asset={a} />
		))}
	</div>
);
```

2) Empêcher l'ajout d'un doublon dans un formulaire :

```jsx
function addAsset(name) {
	setAssets(prev => {
		if (prev.some(a => a.name === name)) {
			alert('Asset déjà ajouté');
			return prev;
		}
		return [...prev, { id: generateId(), name }];
	});
}
```

3) Partitionner / grouper un tableau par attribut

Parfois on veut séparer une liste en sous-listes basées sur la valeur d'un attribut (par ex. `attr === 1` vs `attr === 2`) et obtenir un objet du type `{ 1: [...], 2: [...] }`.

Avec `filter` (si vous connaissez les valeurs attendues) :

```js
const ones = items.filter(i => i.attr === 1);
const twos = items.filter(i => i.attr === 2);
const grouped = { 1: ones, 2: twos };

// grouped[1] -> tous les objets avec attr === 1
// grouped[2] -> tous les objets avec attr === 2
```

Avec `reduce` (générique, pour n'importe quelle valeur d'attribut) :

```js
const grouped = items.reduce((acc, item) => {
	const key = item.attr; // ou String(item.attr) si vous voulez des clés chaînes
	if (!acc[key]) acc[key] = [];
	acc[key].push(item);
	return acc;
}, {});

// Ex : grouped = { '1': [objA, objC], '2': [objB] }
```

Avec `lodash` (pratique et lisible) :

```js
import groupBy from 'lodash/groupBy';
const grouped = groupBy(items, 'attr');
```

Conseils :
- Si vous avez un petit nombre de valeurs connues et que vous voulez seulement deux groupes, `filter` est très clair.
- Pour des cas dynamiques (valeurs multiples), `reduce` ou `groupBy` est plus adapté.
- Pensez à normaliser la clé (`String(...)`, `toLowerCase()`, `trim()`) si les valeurs peuvent varier en format.


## 9. Checklist rapide

- Utilisez `map` pour transformer les données en JSX.
- Dédupliquez les données avant `map` si nécessaire.
- Fournissez des `key` uniques et stables.
- Préférez `Set`, `Map`, `filter`/`reduce` ou `uniqBy` selon le besoin.
- Utilisez `useMemo` pour optimiser les transformations coûteuses.

---

Souhaitez-vous que j'ajoute des exemples TypeScript, une version utilisant `lodash/uniqBy`, ou que j'intègre la déduplication directement dans `TicketForm.jsx` ?

