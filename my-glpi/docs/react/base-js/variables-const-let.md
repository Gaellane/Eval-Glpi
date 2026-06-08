# Variables en JavaScript : `const` vs `let`

En JavaScript moderne (ES6+), on déclare les variables avec **`const`** ou **`let`**. L'ancien mot-clé `var` est à éviter.

---

## `let` — Variable réassignable

`let` déclare une variable dont la **valeur peut changer** au cours du programme.

```js
let age = 25;
age = 26; // ✅ OK, on peut réassigner

let nom = "Alice";
nom = "Bob"; // ✅ OK
```

### Cas d'usage typiques

- Compteurs
- Valeurs qui évoluent dans une boucle
- État temporaire qui sera mis à jour

```js
let compteur = 0;

for (let i = 0; i < 5; i++) {
  compteur += i;
}

console.log(compteur); // 10
```

---

## `const` — Variable non réassignable

`const` déclare une variable dont la **référence ne peut pas être changée** après l'initialisation.

```js
const PI = 3.14159;
PI = 3; // ❌ TypeError: Assignment to constant variable

const prenom = "Alice";
prenom = "Bob"; // ❌ Erreur
```

### ⚠️ Attention : `const` ne veut pas dire "immuable"

Pour les **objets** et les **tableaux**, `const` empêche la réassignation de la variable, mais **pas la modification du contenu**.

```js
const utilisateur = { nom: "Alice", age: 25 };

utilisateur.age = 26;         // ✅ OK — on modifie une propriété
utilisateur.email = "a@b.com"; // ✅ OK — on ajoute une propriété

utilisateur = { nom: "Bob" }; // ❌ Erreur — on tente de réassigner la variable
```

Même principe avec les tableaux :

```js
const fruits = ["pomme", "banane"];

fruits.push("orange"); // ✅ OK — on modifie le contenu du tableau
fruits[0] = "kiwi";    // ✅ OK

fruits = ["mangue"];    // ❌ Erreur — réassignation interdite
```

---

## Portée (Scope) : block scope

`let` et `const` ont tous les deux une **portée de bloc** (`{}`). Ils n'existent que dans le bloc où ils sont déclarés.

```js
if (true) {
  let x = 10;
  const y = 20;
  console.log(x, y); // 10, 20
}

console.log(x); // ❌ ReferenceError: x is not defined
console.log(y); // ❌ ReferenceError: y is not defined
```

C'est un avantage par rapport à `var`, qui a une portée de **fonction** et peut fuiter hors des blocs :

```js
if (true) {
  var z = 30;
}
console.log(z); // 30 — var "fuit" hors du bloc ⚠️
```

---

## Pas de hoisting utilisable

Contrairement à `var`, les variables `let` et `const` ne sont **pas utilisables avant leur déclaration** (temporal dead zone).

```js
console.log(a); // undefined (var est "hoisté")
var a = 5;

console.log(b); // ❌ ReferenceError (temporal dead zone)
let b = 10;
```

---

## Résumé : quand utiliser quoi ?

| Critère | `const` | `let` |
|---|---|---|
| Réassignation possible ? | ❌ Non | ✅ Oui |
| Modification du contenu (objet/tableau) ? | ✅ Oui | ✅ Oui |
| Portée | Bloc `{}` | Bloc `{}` |
| Hoisting utilisable ? | ❌ Non | ❌ Non |

### La règle simple

> **Utilise `const` par défaut.** Ne passe à `let` que si tu as besoin de réassigner la variable.

Cette règle rend le code plus **prévisible** et plus **lisible** : quand tu vois `const`, tu sais que cette variable ne changera jamais de référence.

---

## En contexte React

Dans React, cette règle s'applique partout :

```jsx
// ✅ const pour les composants (la référence ne change jamais)
const MonComposant = () => {
  // ✅ const pour le state (on ne réassigne jamais, on utilise le setter)
  const [nom, setNom] = useState("Alice");

  // ✅ const pour les handlers
  const handleClick = () => {
    setNom("Bob"); // on utilise le setter, pas de réassignation
  };

  // let seulement si vraiment nécessaire
  let message;
  if (nom === "Alice") {
    message = "Bonjour Alice !";
  } else {
    message = `Bonjour ${nom} !`;
  }

  return <p onClick={handleClick}>{message}</p>;
};
```

> En pratique, dans un composant React, tu utiliseras `const` dans **95% des cas**.
