# Map

Une `Map` est une collection de paires clé/valeur.

Contrairement à un objet classique :

- Les clés peuvent être de n'importe quel type.
- L'ordre d'insertion est conservé.
- La taille est disponible avec `size`.

---

# Création

```js
const users = new Map();
```

Ou directement avec des valeurs :

```js
const users = new Map([
    [1, "John"],
    [2, "Bob"],
    [3, "Alice"]
]);
```

---

# Ajouter un élément

```js
const users = new Map();

users.set(1, "John");
users.set(2, "Bob");

console.log(users);
```

Résultat :

```js
Map(2) {
    1 => "John",
    2 => "Bob"
}
```

---

# Récupérer une valeur

```js
const users = new Map();

users.set(1, "John");

console.log(users.get(1));
```

Résultat :

```js
John
```

---

# Vérifier l'existence

```js
const users = new Map();

users.set(1, "John");

console.log(users.has(1));
console.log(users.has(2));
```

Résultat :

```js
true
false
```

---

# Supprimer un élément

```js
const users = new Map();

users.set(1, "John");
users.set(2, "Bob");

users.delete(1);

console.log(users);
```

Résultat :

```js
Map(1) {
    2 => "Bob"
}
```

---

# Taille

```js
const users = new Map();

users.set(1, "John");
users.set(2, "Bob");

console.log(users.size);
```

Résultat :

```js
2
```

---

# Vider une Map

```js
const users = new Map();

users.set(1, "John");
users.set(2, "Bob");

users.clear();

console.log(users);
```

Résultat :

```js
Map(0) {}
```

---

# Parcourir avec for...of

```js
const users = new Map([
    [1, "John"],
    [2, "Bob"],
    [3, "Alice"]
]);

for (const [key, value] of users) {
    console.log(key, value);
}
```

Résultat :

```js
1 John
2 Bob
3 Alice
```

---

# Parcourir les clés

```js
const users = new Map([
    [1, "John"],
    [2, "Bob"]
]);

for (const key of users.keys()) {
    console.log(key);
}
```

Résultat :

```js
1
2
```

---

# Parcourir les valeurs

```js
const users = new Map([
    [1, "John"],
    [2, "Bob"]
]);

for (const value of users.values()) {
    console.log(value);
}
```

Résultat :

```js
John
Bob
```

---

# Parcourir les entrées

```js
const users = new Map([
    [1, "John"],
    [2, "Bob"]
]);

for (const entry of users.entries()) {
    console.log(entry);
}
```

Résultat :

```js
[1, "John"]
[2, "Bob"]
```

---

# forEach

```js
const users = new Map([
    [1, "John"],
    [2, "Bob"]
]);

users.forEach((value, key) => {
    console.log(key, value);
});
```

Résultat :

```js
1 John
2 Bob
```

---

# Convertir en Array

```js
const users = new Map([
    [1, "John"],
    [2, "Bob"]
]);

const arr = [...users];

console.log(arr);
```

Résultat :

```js
[
    [1, "John"],
    [2, "Bob"]
]
```

---

# Convertir un Object en Map

```js
const user = {
    name: "John",
    age: 20
};

const map = new Map(Object.entries(user));

console.log(map);
```

Résultat :

```js
Map(2) {
    "name" => "John",
    "age" => 20
}
```

---

# Convertir une Map en Object

```js
const users = new Map([
    ["name", "John"],
    ["age", 20]
]);

const obj = Object.fromEntries(users);

console.log(obj);
```

Résultat :

```js
{
    name: "John",
    age: 20
}
```

---

# Exemple : compteur de mots

```js
const words = ["a", "b", "a", "c", "a"];

const counter = new Map();

for (const word of words) {
    counter.set(word, (counter.get(word) || 0) + 1);
}

console.log(counter);
```

Résultat :

```js
Map(3) {
    "a" => 3,
    "b" => 1,
    "c" => 1
}
```