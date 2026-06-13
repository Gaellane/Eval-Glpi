# Object

Un objet permet de stocker des données sous forme de clé / valeur.

---

# Création

```js
const user = {
    name: "John",
    age: 25
};
```

---

# Accès aux propriétés

```js
console.log(user.name);
```

Résultat :

```js
John
```

ou

```js
console.log(user["name"]);
```

---

# Ajouter une propriété

```js
const user = {
    name: "John"
};

user.age = 25;

console.log(user);
```

Résultat :

```js
{
    name: "John",
    age: 25
}
```

---

# Modifier une propriété

```js
user.name = "Bob";
```

---

# Supprimer une propriété

```js
delete user.age;
```

---

# Vérifier l'existence

```js
console.log("name" in user);
```

Résultat :

```js
true
```

---

# Object.keys()

```js
const user = {
    name: "John",
    age: 25
};

console.log(Object.keys(user));
```

Résultat :

```js
["name", "age"]
```

---

# Object.values()

```js
console.log(Object.values(user));
```

Résultat :

```js
["John", 25]
```

---

# Object.entries()

```js
console.log(Object.entries(user));
```

Résultat :

```js
[
    ["name", "John"],
    ["age", 25]
]
```

---

# Boucle sur un objet

```js
for(const key in user){
    console.log(key, user[key]);
}
```

---

# Copie

```js
const user2 = { ...user };
```

---

# Fusion

```js
const address = {
    city: "Paris"
};

const result = {
    ...user,
    ...address
};
```

---

# Destructuring

```js
const user = {
    name: "John",
    age: 25
};

const { name, age } = user;

console.log(name);
console.log(age);
```

---

# Objet imbriqué

```js
const user = {
    name: "John",
    address: {
        city: "Paris"
    }
};

console.log(user.address.city);
```

---

# Optional Chaining

```js
console.log(user.address?.city);
```

---

# Nullish Coalescing

```js
const city = user.city ?? "Unknown";
```

---

# Freeze

```js
Object.freeze(user);
```

Impossible ensuite de modifier l'objet.

---

# Exemple pratique

```js
const users = [
    { name: "John", age: 20 },
    { name: "Bob", age: 30 },
    { name: "Alice", age: 40 }
];

const names = users.map(user => user.name);

console.log(names);
```

Résultat :

```js
["John", "Bob", "Alice"]
```