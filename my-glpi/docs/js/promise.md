# Promise

Une Promise représente une valeur qui sera disponible plus tard.

Elle possède 3 états :

- Pending
- Fulfilled
- Rejected

---

# Création

```js
const promise = new Promise((resolve, reject) => {

    const success = true;

    if(success){
        resolve("Succès");
    }else{
        reject("Erreur");
    }

});
```

---

# then

```js
promise.then(result => {
    console.log(result);
});
```

Résultat :

```js
Succès
```

---

# catch

```js
promise
    .then(result => {
        console.log(result);
    })
    .catch(error => {
        console.log(error);
    });
```

---

# finally

```js
promise
    .finally(() => {
        console.log("Terminé");
    });
```

---

# Exemple simple

```js
const promise = new Promise(resolve => {

    setTimeout(() => {
        resolve("Data chargée");
    }, 2000);

});

promise.then(data => {
    console.log(data);
});
```

Résultat après 2 secondes :

```js
Data chargée
```

---

# Rejet

```js
const promise = new Promise((resolve, reject) => {

    reject("Erreur serveur");

});

promise.catch(error => {
    console.log(error);
});
```

---

# Chaînage

```js
Promise.resolve(5)
    .then(value => value * 2)
    .then(value => value + 10)
    .then(value => console.log(value));
```

Résultat :

```js
20
```

---

# Promise.resolve()

```js
const promise = Promise.resolve("Hello");
```

---

# Promise.reject()

```js
const promise = Promise.reject("Erreur");
```

---

# Promise.all()

Toutes les promesses doivent réussir.

```js
const p1 = Promise.resolve(10);
const p2 = Promise.resolve(20);
const p3 = Promise.resolve(30);

Promise.all([p1, p2, p3])
    .then(result => {
        console.log(result);
    });
```

Résultat :

```js
[10,20,30]
```

---

# Promise.race()

La première qui termine gagne.

```js
Promise.race([
    p1,
    p2,
    p3
]);
```

---

# Promise.allSettled()

Retourne tous les résultats.

```js
Promise.allSettled([
    Promise.resolve("OK"),
    Promise.reject("Erreur")
]);
```

Résultat :

```js
[
    { status: "fulfilled" },
    { status: "rejected" }
]
```

---

# Exemple API

```js
fetch("/users")
    .then(response => response.json())
    .then(users => console.log(users))
    .catch(error => console.log(error));
```

---

# Résumé

```js
promise
    .then(...)
    .catch(...)
    .finally(...);
```