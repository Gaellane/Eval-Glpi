# Set

Un `Set` est une collection de valeurs uniques.

Les doublons sont automatiquement ignorés.

---

# Création

```js
const letters = new Set();
```

Ou :

```js
const letters = new Set(["a", "b", "c"]);
```

---

# Ajouter une valeur

```js
const letters = new Set();

letters.add("a");
letters.add("b");
letters.add("c");

console.log(letters);
```

Résultat :

```js
Set(3) {
    "a",
    "b",
    "c"
}
```

---

# Les doublons sont ignorés

```js
const letters = new Set();

letters.add("a");
letters.add("a");
letters.add("a");

console.log(letters);
```

Résultat :

```js
Set(1) {
    "a"
}
```

---

# Vérifier l'existence

```js
const letters = new Set(["a", "b", "c"]);

console.log(letters.has("a"));
console.log(letters.has("z"));
```

Résultat :

```js
true
false
```

---

# Supprimer une valeur

```js
const letters = new Set(["a", "b", "c"]);

letters.delete("b");

console.log(letters);
```

Résultat :

```js
Set(2) {
    "a",
    "c"
}
```

---

# Taille

```js
const letters = new Set(["a", "b", "c"]);

console.log(letters.size);
```

Résultat :

```js
3
```

---

# Vider un Set

```js
const letters = new Set(["a", "b", "c"]);

letters.clear();

console.log(letters);
```

Résultat :

```js
Set(0) {}
```

---

# Parcourir avec for...of

```js
const letters = new Set(["a", "b", "c"]);

for (const letter of letters) {
    console.log(letter);
}
```

Résultat :

```js
a
b
c
```

---

# forEach

```js
const letters = new Set(["a", "b", "c"]);

letters.forEach(value => {
    console.log(value);
});
```

Résultat :

```js
a
b
c
```

---

# values()

```js
const letters = new Set(["a", "b", "c"]);

console.log(letters.values());
```

---

# keys()

Pour un Set, keys() et values() retournent la même chose.

```js
const letters = new Set(["a", "b", "c"]);

console.log(letters.keys());
```

---

# entries()

```js
const letters = new Set(["a", "b", "c"]);

for (const entry of letters.entries()) {
    console.log(entry);
}
```

Résultat :

```js
["a", "a"]
["b", "b"]
["c", "c"]
```

---

# Convertir en Array

```js
const letters = new Set(["a", "b", "c"]);

const arr = [...letters];

console.log(arr);
```

Résultat :

```js
["a", "b", "c"]
```

Ou :

```js
const arr = Array.from(letters);
```

---

# Supprimer les doublons d'un tableau

```js
const numbers = [1, 2, 3, 1, 2, 4, 5];

const unique = [...new Set(numbers)];

console.log(unique);
```

Résultat :

```js
[1, 2, 3, 4, 5]
```

---

# Union

```js
const a = new Set([1, 2, 3]);
const b = new Set([3, 4, 5]);

const union = new Set([...a, ...b]);

console.log(union);
```

Résultat :

```js
Set(5) {
    1,
    2,
    3,
    4,
    5
}
```

---

# Intersection

```js
const a = new Set([1, 2, 3]);
const b = new Set([3, 4, 5]);

const intersection = new Set(
    [...a].filter(value => b.has(value))
);

console.log(intersection);
```

Résultat :

```js
Set(1) {
    3
}
```

---

# Différence

```js
const a = new Set([1, 2, 3]);
const b = new Set([3, 4, 5]);

const difference = new Set(
    [...a].filter(value => !b.has(value))
);

console.log(difference);
```

Résultat :

```js
Set(2) {
    1,
    2
}
```

---

# Exemple pratique

```js
const users = [
    "John",
    "Bob",
    "John",
    "Alice",
    "Bob"
];

const uniqueUsers = [...new Set(users)];

console.log(uniqueUsers);
```

Résultat :

```js
[
    "John",
    "Bob",
    "Alice"
]
```