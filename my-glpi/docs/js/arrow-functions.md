# Arrow Function

Les Arrow Functions (fonctions fléchées) sont une syntaxe plus courte pour écrire des fonctions.

Introduites en ES6.

Syntaxe :

```js
(parametres) => {
    // code
}
```

---

# Fonction classique

```js
function addition(a, b) {
    return a + b;
}

console.log(addition(5, 3));
```

Résultat :

```js
8
```

---

# Arrow Function équivalente

```js
const addition = (a, b) => {
    return a + b;
};

console.log(addition(5, 3));
```

Résultat :

```js
8
```

---

# Retour implicite

Si la fonction contient uniquement un return, les accolades peuvent être supprimées.

```js
const addition = (a, b) => a + b;

console.log(addition(5, 3));
```

Résultat :

```js
8
```

---

# Un seul paramètre

Les parenthèses deviennent optionnelles.

```js
const carre = x => x * x;

console.log(carre(5));
```

Résultat :

```js
25
```

---

# Aucun paramètre

Les parenthèses restent obligatoires.

```js
const hello = () => "Hello World";

console.log(hello());
```

Résultat :

```js
Hello World
```

---

# Plusieurs lignes

```js
const addition = (a, b) => {
    const resultat = a + b;
    return resultat;
};

console.log(addition(5, 3));
```

Résultat :

```js
8
```

---

# Retourner un objet

Attention :

```js
const createUser = () => {
    name: "John";
};

console.log(createUser());
```

Résultat :

```js
undefined
```

Pourquoi ?

JavaScript interprète les accolades comme un bloc de code.

Pour retourner un objet :

```js
const createUser = () => ({
    name: "John"
});

console.log(createUser());
```

Résultat :

```js
{
    name: "John"
}
```

---

# Utilisation avec forEach

```js
const numbers = [1, 2, 3, 4];

numbers.forEach(number => {
    console.log(number);
});
```

Résultat :

```js
1
2
3
4
```

---

# Utilisation avec map

```js
const numbers = [1, 2, 3, 4];

const doubles = numbers.map(number => number * 2);

console.log(doubles);
```

Résultat :

```js
[2, 4, 6, 8]
```

---

# Utilisation avec filter

```js
const numbers = [1, 2, 3, 4, 5, 6];

const pairs = numbers.filter(number => number % 2 === 0);

console.log(pairs);
```

Résultat :

```js
[2, 4, 6]
```

---

# Utilisation avec find

```js
const numbers = [1, 2, 3, 4, 5];

const result = numbers.find(number => number > 3);

console.log(result);
```

Résultat :

```js
4
```

---

# Utilisation avec some

Retourne true si au moins un élément respecte la condition.

```js
const numbers = [1, 2, 3, 4, 5];

const result = numbers.some(number => number > 4);

console.log(result);
```

Résultat :

```js
true
```

---

# Utilisation avec every

Retourne true si tous les éléments respectent la condition.

```js
const numbers = [1, 2, 3, 4, 5];

const result = numbers.every(number => number > 0);

console.log(result);
```

Résultat :

```js
true
```

---

# Utilisation avec reduce

```js
const numbers = [1, 2, 3, 4];

const sum = numbers.reduce(
    (accumulator, current) => accumulator + current,
    0
);

console.log(sum);
```

Résultat :

```js
10
```

---

# Trier un tableau

```js
const numbers = [10, 5, 20, 3];

numbers.sort((a, b) => a - b);

console.log(numbers);
```

Résultat :

```js
[3, 5, 10, 20]
```

---

# this dans une fonction classique

```js
const user = {
    name: "John",

    sayHello: function () {
        console.log(this.name);
    }
};

user.sayHello();
```

Résultat :

```js
John
```

---

# this dans une Arrow Function

```js
const user = {
    name: "John",

    sayHello: () => {
        console.log(this.name);
    }
};

user.sayHello();
```

Résultat :

```js
undefined
```

Les Arrow Functions ne possèdent pas leur propre `this`.

Elles récupèrent le `this` du contexte extérieur.

---

# Cas pratique : setTimeout

Fonction classique :

```js
const user = {
    name: "John",

    showName: function () {
        setTimeout(function () {
            console.log(this.name);
        }, 1000);
    }
};

user.showName();
```

Résultat :

```js
undefined
```

---

Avec Arrow Function :

```js
const user = {
    name: "John",

    showName: function () {
        setTimeout(() => {
            console.log(this.name);
        }, 1000);
    }
};

user.showName();
```

Résultat après 1 seconde :

```js
John
```

---

# Chaînage de méthodes

```js
const numbers = [1, 2, 3, 4, 5];

const result = numbers
    .filter(x => x % 2 === 0)
    .map(x => x * 10)
    .reduce((sum, x) => sum + x, 0);

console.log(result);
```

Résultat :

```js
60
```

Détail :

```js
[1,2,3,4,5]
↓ filter
[2,4]
↓ map
[20,40]
↓ reduce
60
```

---

# Bonnes pratiques

Utiliser les Arrow Functions :

- Avec map()
- Avec filter()
- Avec reduce()
- Avec forEach()
- Avec les callbacks
- Avec les Promises

Éviter les Arrow Functions :

- Comme méthode principale d'un objet
- Quand on a besoin de son propre this
- Comme constructeur avec new

---

# Impossible avec new

```js
const Person = (name) => {
    this.name = name;
};

const p = new Person("John");
```

Résultat :

```js
TypeError
```

Les Arrow Functions ne peuvent pas être utilisées comme constructeur.

---

# Résumé

```js
const add = (a, b) => a + b;

const square = x => x * x;

const hello = () => "Hello";

const user = () => ({
    name: "John"
});
```

Les Arrow Functions sont aujourd'hui la syntaxe la plus utilisée en JavaScript moderne, React, Node.js et TypeScript.