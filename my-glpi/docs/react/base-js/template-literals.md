# Template Literals (Littéraux de gabarit)

Les **template literals** sont des chaînes de caractères délimitées par des **backticks** (`` ` ``) au lieu des guillemets. Ils permettent l'interpolation d'expressions et les chaînes multi-lignes.

---

## Syntaxe de base

```js
// Guillemets classiques
const message = "Bonjour tout le monde";

// Template literal (backticks)
const message = `Bonjour tout le monde`;
```

En soi, pas de différence… Le pouvoir vient de l'**interpolation**.

---

## Interpolation d'expressions `${...}`

On peut insérer n'importe quelle **expression JavaScript** dans `${}` :

### Variables

```js
const nom = "Alice";
const age = 25;

// ❌ Concaténation classique — lourd et source d'erreurs
const message = "Bonjour, je suis " + nom + " et j'ai " + age + " ans.";

// ✅ Template literal — lisible et élégant
const message = `Bonjour, je suis ${nom} et j'ai ${age} ans.`;

console.log(message); // "Bonjour, je suis Alice et j'ai 25 ans."
```

### Expressions et calculs

On peut mettre **n'importe quelle expression** JavaScript, pas juste des variables :

```js
const prix = 19.99;
const quantite = 3;

const total = `Total : ${prix * quantite}€`;
// "Total : 59.97€"

const message = `Il a ${age >= 18 ? "plus" : "moins"} de 18 ans`;
// "Il a plus de 18 ans"
```

### Appels de fonctions

```js
const nom = "alice";

const message = `Bonjour ${nom.toUpperCase()} !`;
// "Bonjour ALICE !"

const date = `Aujourd'hui : ${new Date().toLocaleDateString("fr-FR")}`;
// "Aujourd'hui : 12/03/2026"
```

---

## Chaînes multi-lignes

Avec les guillemets classiques, les retours à la ligne nécessitent `\n`. Avec les template literals, les retours à la ligne sont **naturels** :

```js
// ❌ Classique — illisible
const html = "<div>\n  <h1>Titre</h1>\n  <p>Contenu</p>\n</div>";

// ✅ Template literal — clair
const html = `
<div>
  <h1>Titre</h1>
  <p>Contenu</p>
</div>
`;
```

---

## Template literals imbriqués

On peut imbriquer des template literals :

```js
const articles = ["pomme", "banane", "orange"];

const liste = `
<ul>
  ${articles.map(a => `<li>${a}</li>`).join("\n  ")}
</ul>
`;

/*
<ul>
  <li>pomme</li>
  <li>banane</li>
  <li>orange</li>
</ul>
*/
```

---

## Guillemets dans la chaîne

Les template literals permettent d'utiliser librement `"` et `'` sans échappement :

```js
// ❌ Échappement nécessaire avec les guillemets
const phrase = "Il a dit : \"Bonjour l'ami\"";

// ✅ Aucun échappement avec les backticks
const phrase = `Il a dit : "Bonjour l'ami"`;
```

Pour utiliser un backtick dans un template literal, il faut l'échapper :

```js
const code = `Utilisez \`const\` au lieu de \`var\``;
```

---

## Tagged Templates (avancé)

Les **tagged templates** sont des fonctions qui traitent un template literal. C'est un concept avancé utilisé par des bibliothèques comme **styled-components** :

```js
function majuscules(strings, ...values) {
  return strings.reduce((result, str, i) => {
    return result + str + (values[i] ? values[i].toString().toUpperCase() : "");
  }, "");
}

const nom = "alice";
const ville = "paris";

const message = majuscules`Bonjour ${nom} de ${ville}`;
// "Bonjour ALICE de PARIS"
```

---

## En contexte React

### Classes CSS dynamiques

```jsx
const Bouton = ({ type, taille, actif }) => {
  const classes = `btn btn-${type} btn-${taille} ${actif ? "actif" : ""}`;

  return <button className={classes}>Cliquer</button>;
};

// Rendu : <button class="btn btn-primary btn-lg actif">Cliquer</button>
```

### URLs dynamiques

```jsx
const Avatar = ({ userId }) => {
  const url = `https://api.example.com/users/${userId}/avatar`;

  return <img src={url} alt="Avatar" />;
};
```

### Messages conditionnels

```jsx
const Salutation = ({ nom, estConnecte }) => (
  <p>
    {`${estConnecte ? `Bienvenue, ${nom} !` : "Veuillez vous connecter."}`}
  </p>
);
```

### Styled-components (tagged template)

```jsx
import styled from "styled-components";

// Tagged template literal en action
const Titre = styled.h1`
  color: ${props => props.couleur || "black"};
  font-size: ${props => props.taille || "24px"};
  text-align: center;
`;

// Utilisation
<Titre couleur="blue" taille="32px">Mon titre</Titre>
```

---

## Résumé

| Fonctionnalité | Syntaxe | Exemple |
|---|---|---|
| Interpolation | `` `${expression}` `` | `` `Bonjour ${nom}` `` |
| Multi-lignes | Retours à la ligne naturels | `` `ligne 1\nligne 2` `` |
| Expressions | `` `${a + b}` `` | `` `Total: ${prix * qte}€` `` |
| Ternaire | `` `${cond ? "a" : "b"}` `` | `` `${ok ? "oui" : "non"}` `` |
| Tagged | `` fn`texte ${val}` `` | styled-components |

> **Règle** : utilise systématiquement les template literals dès que tu dois insérer une variable ou une expression dans une chaîne. Abandonne la concaténation avec `+`.
