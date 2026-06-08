
# Boucles et itérations en React

Ce document explique comment parcourir et rendre des listes en React, avec des exemples et des bonnes pratiques.

## Principe général

En React, on construit souvent un tableau d'éléments JSX à partir d'un tableau de données. La méthode la plus courante est `Array.prototype.map()` : elle permet de retourner un tableau d'éléments JSX directement depuis le render (ou la fonction composant).

## Utiliser `map` pour rendre des listes

Exemple classique :

```jsx
function TodoList({ todos }) {
	return (
		<ul>
			{todos.map(todo => (
				<li key={todo.id}>{todo.text}</li>
			))}
		</ul>
	);
}
```

Points importants :
- Toujours fournir une `key` unique pour chaque élément retourné par `map`.
- La clé doit être stable et unique (id provenant des données). Évitez d'utiliser l'index du tableau comme `key` si la liste peut changer d'ordre ou subir des insertions/suppressions.

## Pourquoi `key` est important

La prop `key` aide React à identifier quels éléments ont changé, été ajoutés ou supprimés. Une mauvaise clé (par ex. index) peut provoquer des réaffectations d'état dans des composants enfants et des comportements inattendus.

## Ne pas utiliser `forEach` dans le JSX

`forEach` renvoie `undefined`, il ne convient donc pas pour produire des éléments dans le JSX :

```jsx
// MAUVAIS : forEach ne renvoie rien
return (
	<div>
		{items.forEach(item => <div>{item.name}</div>)}
	</div>
);
```

Si vous souhaitez utiliser une boucle impérative, construisez d'abord un tableau d'éléments puis retournez-le :

```jsx
function ItemList({ items }) {
	const elements = [];
	for (let i = 0; i < items.length; i++) {
		const it = items[i];
		elements.push(<div key={it.id}>{it.name}</div>);
	}
	return <div>{elements}</div>;
}
```

## Boucles imbriquées et fragments

Pour des structures imbriquées (ex : groupes avec listes internes) :

```jsx
{groups.map(group => (
	<section key={group.id}>
		<h3>{group.name}</h3>
		<ul>
			{group.items.map(item => (
				<li key={item.id}>{item.name}</li>
			))}
		</ul>
	</section>
))}
```

Si votre `map` doit retourner plusieurs éléments frères pour chaque entrée, utilisez un fragment avec `key` :

```jsx
{terms.map(t => (
	<React.Fragment key={t.id}>
		<dt>{t.term}</dt>
		<dd>{t.definition}</dd>
	</React.Fragment>
))}
```

Note : la forme courte `<>...</>` ne supporte pas `key`, utilisez `React.Fragment` si vous avez besoin d'une clé.

## Filtrer, trier, transformer avant de rendre

Vous pouvez chaîner `filter` / `sort` / `map` :

```jsx
{items
	.filter(i => i.visible)
	.map(i => <Card key={i.id} {...i} />)
}
```

Pour des transformations complexes, calculez la structure hors du JSX (ou utilisez `useMemo`) afin d'éviter des calculs coûteux à chaque rendu.

## Exemples d'utilisation conditionnelle

```jsx
{items.map(item => (
	<div key={item.id}>
		{item.url ? (
			<a href={item.url}>{item.title}</a>
		) : (
			<span>{item.title}</span>
		)}
	</div>
))}
```

## Bonnes pratiques et performances

- Favoriser `map` pour la lisibilité et l'expressivité.
- Fournir des `key` stables et uniques (id, UUID, etc.).
- Éviter d'utiliser `index` comme `key` sur des listes dynamiques.
- Ne pas générer des clés aléatoires à chaque rendu (Math.random), cela annule les bénéfices du diffing de React.
- Ne pas faire de lourds calculs / tri / formatage directement dans le JSX ; pré-calculer ou utiliser `useMemo`.
- Pour de très longues listes, envisager la virtualisation (`react-window`, `react-virtualized`).

## Résumé rapide

- Utilisez `map` pour rendre des listes.
- Donnez une `key` unique et stable.
- N'utilisez pas `forEach` directement dans le JSX.
- Pour des cas spéciaux, construisez un tableau d'éléments avec une boucle classique ou utilisez des fonctions utilitaires (`filter`, `reduce`, etc.).

---

Si vous voulez, je peux ajouter des exemples supplémentaires (ex : tableau HTML, lignes de table, exemples TypeScript, ou démonstration de virtualisation).

