# Spread Operator (`...`)

Le **spread operator** permet de **copier** ou **fusionner** des objets et des tableaux sans modifier les originaux. C'est un pilier de l'immutabilité en React.

---

## Spread avec les tableaux

### Copier un tableau

```js
const originaux = [1, 2, 3];

// ❌ Ceci ne copie PAS — c'est la même référence
const copieRef = originaux;
copieRef.push(4);
console.log(originaux); // [1, 2, 3, 4] — l'original est modifié !

// ✅ Copie réelle avec le spread
const copie = [...originaux];
copie.push(4);
console.log(originaux); // [1, 2, 3] — l'original est intact
console.log(copie);      // [1, 2, 3, 4]
```

### Fusionner des tableaux

```js
const fruits = ["pomme", "banane"];
const legumes = ["carotte", "poivron"];

const nourriture = [...fruits, ...legumes];
// ["pomme", "banane", "carotte", "poivron"]

// Ajouter des éléments au milieu
const complet = [...fruits, "orange", ...legumes];
// ["pomme", "banane", "orange", "carotte", "poivron"]
```

### Ajouter un élément (sans modifier l'original)

```js
const nombres = [1, 2, 3];

// Ajouter à la fin
const avecQuatre = [...nombres, 4];
// [1, 2, 3, 4]

// Ajouter au début
const avecZero = [0, ...nombres];
// [0, 1, 2, 3]
```

### Supprimer un élément (combiner spread + filter)

```js
const noms = ["Alice", "Bob", "Charlie"];

const sansBot = noms.filter(nom => nom !== "Bob");
// ["Alice", "Charlie"]
// L'original 'noms' n'est pas modifié
```

---

## Spread avec les objets

### Copier un objet

```js
const utilisateur = { nom: "Alice", age: 25 };

// ❌ Même référence
const ref = utilisateur;
ref.age = 30;
console.log(utilisateur.age); // 30 — l'original est modifié !

// ✅ Copie avec spread
const copie = { ...utilisateur };
copie.age = 30;
console.log(utilisateur.age); // 25 — intact
console.log(copie.age);        // 30
```

### Fusionner des objets

```js
const infosBase = { nom: "Alice", age: 25 };
const infosContact = { email: "alice@mail.com", tel: "0123456789" };

const utilisateur = { ...infosBase, ...infosContact };
// { nom: "Alice", age: 25, email: "alice@mail.com", tel: "0123456789" }
```

### Modifier une propriété (sans toucher à l'original)

```js
const utilisateur = { nom: "Alice", age: 25, ville: "Paris" };

// Créer une copie avec age modifié
const utilisateurModifie = { ...utilisateur, age: 26 };

console.log(utilisateur);        // { nom: "Alice", age: 25, ville: "Paris" }
console.log(utilisateurModifie); // { nom: "Alice", age: 26, ville: "Paris" }
```

> **L'ordre compte** : les propriétés déclarées **après** le spread écrasent celles du spread.

```js
const defaut = { theme: "clair", langue: "fr", taille: 14 };
const preferences = { theme: "sombre" };

const config = { ...defaut, ...preferences };
// { theme: "sombre", langue: "fr", taille: 14 }
// "sombre" a écrasé "clair"
```

### Ajouter une propriété

```js
const utilisateur = { nom: "Alice", age: 25 };

const avecRole = { ...utilisateur, role: "admin" };
// { nom: "Alice", age: 25, role: "admin" }
```

---

## ⚠️ Copie superficielle (shallow copy)

Le spread fait une copie **superficielle** : les objets imbriqués restent des références partagées.

```js
const utilisateur = {
  nom: "Alice",
  adresse: { ville: "Paris", cp: "75001" }
};

const copie = { ...utilisateur };
copie.nom = "Bob";                // ✅ Copie indépendante
copie.adresse.ville = "Lyon";     // ⚠️ Modifie aussi l'original !

console.log(utilisateur.adresse.ville); // "Lyon" — pas ce qu'on voulait
```

Pour une copie profonde des objets imbriqués :

```js
const copie = {
  ...utilisateur,
  adresse: { ...utilisateur.adresse } // spread aussi l'objet imbriqué
};

copie.adresse.ville = "Lyon";
console.log(utilisateur.adresse.ville); // "Paris" ✅
```

---

## Spread dans les arguments de fonction

Le spread permet de passer les éléments d'un tableau comme **arguments séparés** :

```js
const nombres = [3, 7, 1, 9, 4];

// Sans spread — ne fonctionne pas comme attendu
Math.max(nombres); // NaN

// Avec spread
Math.max(...nombres); // 9

// Équivalent à :
Math.max(3, 7, 1, 9, 4); // 9
```

---

## En contexte React

Le spread est **fondamental** en React, surtout pour gérer le state de manière immutable.

### Mettre à jour un objet dans le state

```jsx
const [utilisateur, setUtilisateur] = useState({
  nom: "Alice",
  age: 25,
  ville: "Paris"
});

// ✅ Modifier une propriété sans toucher au reste
const handleAnniversaire = () => {
  setUtilisateur({ ...utilisateur, age: utilisateur.age + 1 });
};

// ✅ Modifier un objet imbriqué
const [profil, setProfil] = useState({
  nom: "Alice",
  adresse: { ville: "Paris", cp: "75001" }
});

const changerVille = (nouvelleVille) => {
  setProfil({
    ...profil,
    adresse: { ...profil.adresse, ville: nouvelleVille }
  });
};
```

### Mettre à jour un tableau dans le state

```jsx
const [taches, setTaches] = useState(["Courses", "Ménage"]);

// ✅ Ajouter un élément
const ajouterTache = (tache) => {
  setTaches([...taches, tache]);
};

// ✅ Supprimer un élément
const supprimerTache = (index) => {
  setTaches(taches.filter((_, i) => i !== index));
};

// ✅ Modifier un élément à un index donné
const modifierTache = (index, nouvelleTache) => {
  setTaches(taches.map((t, i) => (i === index ? nouvelleTache : t)));
};
```

### Transférer des props avec le spread

```jsx
const Bouton = ({ variante, ...props }) => (
  <button className={`btn-${variante}`} {...props} />
);

// Tous les attributs HTML (onClick, disabled, id…) sont passés automatiquement
<Bouton variante="primary" onClick={handleClick} disabled={false}>
  OK
</Bouton>
```

---

## Résumé

| Opération | Syntaxe | Résultat |
|---|---|---|
| Copier un tableau | `[...arr]` | Nouvelle copie |
| Fusionner des tableaux | `[...a, ...b]` | Tableau combiné |
| Ajouter à un tableau | `[...arr, x]` | Nouveau tableau + x |
| Copier un objet | `{...obj}` | Nouvelle copie |
| Fusionner des objets | `{...a, ...b}` | Objet combiné |
| Modifier une propriété | `{...obj, clé: val}` | Copie modifiée |
| Passer en arguments | `fn(...arr)` | Arguments séparés |

> **Règle en React** : ne modifie **jamais** directement le state. Utilise toujours le spread pour créer une nouvelle copie avant de la passer au setter.
