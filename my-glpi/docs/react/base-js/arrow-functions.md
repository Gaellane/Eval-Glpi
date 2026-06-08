# Arrow Functions (Fonctions fléchées)

Les **arrow functions** sont une syntaxe plus concise pour écrire des fonctions, introduite en ES6. Elles sont omniprésentes en React.

---

## Syntaxe de base

### Fonction classique vs Arrow function

```js
// Fonction classique
function saluer(nom) {
  return `Bonjour ${nom}`;
}

// Arrow function équivalente
const saluer = (nom) => {
  return `Bonjour ${nom}`;
};
```

---

## Raccourcis de syntaxe

### 1. Retour implicite (une seule expression)

Si le corps de la fonction ne contient **qu'une seule expression**, on peut supprimer les `{}` et le `return` :

```js
// Avec accolades et return explicite
const doubler = (n) => {
  return n * 2;
};

// Retour implicite — même résultat
const doubler = (n) => n * 2;
```

### 2. Un seul paramètre → parenthèses optionnelles

```js
// Avec parenthèses
const carre = (x) => x * x;

// Sans parenthèses (un seul paramètre)
const carre = x => x * x;
```

> **Recommandation** : en React, on garde souvent les parenthèses pour la cohérence et la lisibilité.

### 3. Zéro ou plusieurs paramètres → parenthèses obligatoires

```js
// Aucun paramètre
const direBonjour = () => "Bonjour !";

// Plusieurs paramètres
const additionner = (a, b) => a + b;
```

### 4. Retourner un objet littéral

Pour retourner un **objet** avec le retour implicite, il faut l'entourer de parenthèses (sinon les `{}` sont interprétés comme un bloc) :

```js
// ❌ Ne fonctionne pas — JS pense que {} est un bloc de code
const creerUtilisateur = (nom) => { nom: nom };

// ✅ Correct — les parenthèses forcent l'interprétation comme objet
const creerUtilisateur = (nom) => ({ nom: nom });

console.log(creerUtilisateur("Alice")); // { nom: "Alice" }
```

---

## Le `this` dans les arrow functions

C'est **la différence majeure** avec les fonctions classiques. Les arrow functions **n'ont pas leur propre `this`** : elles héritent du `this` du contexte englobant.

### Fonction classique : `this` dépend de l'appel

```js
const personne = {
  nom: "Alice",
  saluer: function () {
    console.log(`Bonjour, je suis ${this.nom}`);
  }
};

personne.saluer(); // "Bonjour, je suis Alice" ✅
```

### Arrow function : `this` hérité du scope parent

```js
const personne = {
  nom: "Alice",
  saluer: () => {
    console.log(`Bonjour, je suis ${this.nom}`);
  }
};

personne.saluer(); // "Bonjour, je suis undefined" ❌
// this ne pointe pas vers personne, mais vers le scope englobant (window/global)
```

### Là où c'est utile : callbacks et timers

```js
const personne = {
  nom: "Alice",
  saluerAvecDelai: function () {
    // Fonction classique dans setTimeout → this perdu ❌
    setTimeout(function () {
      console.log(`Bonjour, je suis ${this.nom}`); // undefined
    }, 1000);

    // Arrow function dans setTimeout → this hérité ✅
    setTimeout(() => {
      console.log(`Bonjour, je suis ${this.nom}`); // "Alice"
    }, 1000);
  }
};
```

---

## Arrow functions et tableaux

Les arrow functions brillent avec les méthodes de tableau (`map`, `filter`, `reduce`, `forEach`…) :

```js
const nombres = [1, 2, 3, 4, 5];

// Doubler chaque élément
const doubles = nombres.map(n => n * 2);
// [2, 4, 6, 8, 10]

// Filtrer les pairs
const pairs = nombres.filter(n => n % 2 === 0);
// [2, 4]

// Somme
const somme = nombres.reduce((acc, n) => acc + n, 0);
// 15

// Trouver un élément
const premier = nombres.find(n => n > 3);
// 4
```

---

## En contexte React

Les arrow functions sont utilisées **partout** en React :

```jsx
// ✅ Déclarer un composant
const MonComposant = () => {
  return <h1>Bonjour</h1>;
};

// ✅ Retour implicite pour les composants simples
const Titre = ({ texte }) => <h1>{texte}</h1>;

// ✅ Handlers d'événements
const Bouton = () => {
  const handleClick = () => {
    console.log("Cliqué !");
  };

  return <button onClick={handleClick}>Cliquer</button>;
};

// ✅ Inline dans le JSX (pour les cas simples)
const Bouton = () => (
  <button onClick={() => console.log("Cliqué !")}>Cliquer</button>
);

// ✅ Transformer des listes avec map
const ListeNoms = ({ noms }) => (
  <ul>
    {noms.map(nom => (
      <li key={nom}>{nom}</li>
    ))}
  </ul>
);
```

---

## Résumé

| Caractéristique | Fonction classique | Arrow function |
|---|---|---|
| Syntaxe | `function nom() {}` | `const nom = () => {}` |
| `this` | Propre `this` (selon l'appel) | Hérite du `this` parent |
| Retour implicite | ❌ Non | ✅ Oui (sans `{}`) |
| Utilisable comme méthode d'objet | ✅ Oui | ⚠️ Attention au `this` |
| Constructeur (`new`) | ✅ Oui | ❌ Non |

> **Règle simple en React** : utilise les arrow functions par défaut pour les composants, les handlers et les callbacks.
