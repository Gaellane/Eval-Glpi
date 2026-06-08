# Destructuring (Déstructuration)

Le **destructuring** permet d'extraire des valeurs d'objets ou de tableaux et de les assigner à des variables en une seule ligne. C'est une syntaxe essentielle en React.

---

## Destructuring d'objets

### Syntaxe de base

```js
const utilisateur = {
  nom: "Alice",
  age: 25,
  ville: "Paris"
};

// ❌ Sans destructuring — répétitif
const nom = utilisateur.nom;
const age = utilisateur.age;
const ville = utilisateur.ville;

// ✅ Avec destructuring — concis
const { nom, age, ville } = utilisateur;

console.log(nom);   // "Alice"
console.log(age);   // 25
console.log(ville);  // "Paris"
```

> Les noms des variables doivent correspondre aux **clés de l'objet**.

### Renommer les variables

```js
const utilisateur = { nom: "Alice", age: 25 };

const { nom: prenom, age: annees } = utilisateur;

console.log(prenom);  // "Alice"
console.log(annees);   // 25
console.log(nom);      // ❌ ReferenceError — nom n'existe plus
```

### Valeurs par défaut

Si une propriété n'existe pas, on peut lui donner une valeur par défaut :

```js
const utilisateur = { nom: "Alice" };

const { nom, age = 18, ville = "Inconnue" } = utilisateur;

console.log(nom);   // "Alice"
console.log(age);   // 18 (valeur par défaut)
console.log(ville); // "Inconnue" (valeur par défaut)
```

### Destructuring imbriqué

```js
const utilisateur = {
  nom: "Alice",
  adresse: {
    ville: "Paris",
    codePostal: "75001"
  }
};

const { nom, adresse: { ville, codePostal } } = utilisateur;

console.log(nom);        // "Alice"
console.log(ville);       // "Paris"
console.log(codePostal);  // "75001"
console.log(adresse);     // ❌ ReferenceError — adresse n'est pas assignée
```

### Rest operator dans le destructuring

On peut récupérer le **reste** des propriétés avec `...` :

```js
const utilisateur = { nom: "Alice", age: 25, ville: "Paris", email: "a@b.com" };

const { nom, ...reste } = utilisateur;

console.log(nom);   // "Alice"
console.log(reste);  // { age: 25, ville: "Paris", email: "a@b.com" }
```

---

## Destructuring de tableaux

### Syntaxe de base

```js
const couleurs = ["rouge", "vert", "bleu"];

// ❌ Sans destructuring
const premiere = couleurs[0];
const deuxieme = couleurs[1];

// ✅ Avec destructuring
const [premiere, deuxieme, troisieme] = couleurs;

console.log(premiere);  // "rouge"
console.log(deuxieme);  // "vert"
console.log(troisieme); // "bleu"
```

> Ici, c'est la **position** qui compte, pas le nom.

### Ignorer des éléments

```js
const couleurs = ["rouge", "vert", "bleu", "jaune"];

// Ignorer le 2ème élément
const [premiere, , troisieme] = couleurs;

console.log(premiere);  // "rouge"
console.log(troisieme); // "bleu"
```

### Valeurs par défaut

```js
const nombres = [10];

const [a, b = 20] = nombres;

console.log(a); // 10
console.log(b); // 20 (valeur par défaut)
```

### Rest operator avec les tableaux

```js
const nombres = [1, 2, 3, 4, 5];

const [premier, deuxieme, ...reste] = nombres;

console.log(premier);  // 1
console.log(deuxieme); // 2
console.log(reste);     // [3, 4, 5]
```

### Échanger deux variables

```js
let a = 1;
let b = 2;

[a, b] = [b, a];

console.log(a); // 2
console.log(b); // 1
```

---

## Destructuring dans les paramètres de fonction

On peut destructurer directement dans la signature d'une fonction :

### Avec un objet

```js
// ❌ Sans destructuring
function afficherUtilisateur(utilisateur) {
  console.log(`${utilisateur.nom} a ${utilisateur.age} ans`);
}

// ✅ Avec destructuring
function afficherUtilisateur({ nom, age }) {
  console.log(`${nom} a ${age} ans`);
}

afficherUtilisateur({ nom: "Alice", age: 25 });
// "Alice a 25 ans"
```

### Avec des valeurs par défaut

```js
function creerUtilisateur({ nom, age = 18, role = "visiteur" }) {
  return { nom, age, role };
}

creerUtilisateur({ nom: "Alice" });
// { nom: "Alice", age: 18, role: "visiteur" }
```

---

## En contexte React

Le destructuring est **omniprésent** en React :

### Destructurer les props

```jsx
// ❌ Sans destructuring
const Carte = (props) => {
  return <h1>{props.titre} — {props.description}</h1>;
};

// ✅ Dans les paramètres
const Carte = ({ titre, description }) => {
  return <h1>{titre} — {description}</h1>;
};

// ✅ Dans le corps de la fonction
const Carte = (props) => {
  const { titre, description } = props;
  return <h1>{titre} — {description}</h1>;
};
```

### Destructurer le state (useState)

`useState` retourne un **tableau** → destructuring de tableau :

```jsx
// useState retourne [valeur, setter]
const [compteur, setCompteur] = useState(0);
const [nom, setNom] = useState("Alice");
const [estVisible, setEstVisible] = useState(false);
```

### Destructurer les réponses d'API

```jsx
const ChargerDonnees = () => {
  const [donnees, setDonnees] = useState(null);

  useEffect(() => {
    fetch("/api/utilisateur")
      .then(res => res.json())
      .then(({ nom, email, avatar }) => {
        // Destructuring directement dans le .then
        console.log(nom, email, avatar);
      });
  }, []);
};
```

### Props avec rest (transférer des props)

```jsx
const Bouton = ({ variante, taille, ...reste }) => {
  const classes = `btn btn-${variante} btn-${taille}`;
  return <button className={classes} {...reste} />;
};

// Utilisation — onClick, disabled, etc. sont passés via ...reste
<Bouton variante="primary" taille="lg" onClick={handleClick} disabled={false}>
  Cliquer
</Bouton>
```

---

## Résumé

| Type | Syntaxe | Base de correspondance |
|---|---|---|
| Objet | `const { a, b } = obj` | Nom des clés |
| Tableau | `const [a, b] = arr` | Position (index) |
| Paramètre | `function f({ a, b })` | Nom des clés |
| Renommage | `const { a: x } = obj` | Clé `a` → variable `x` |
| Défaut | `const { a = 10 } = obj` | Valeur si `undefined` |
| Rest | `const { a, ...rest } = obj` | Tout le reste |

> **En React** : destructure tes props, ton state (`useState`), et tes réponses d'API. C'est la convention standard.
