# JSON

JSON = JavaScript Object Notation

Format utilisé pour échanger des données.

---

# Objet JS → JSON

```js
const user = {
    name: "John",
    age: 25
};

const json = JSON.stringify(user);

console.log(json);
```

Résultat :

```js
'{"name":"John","age":25}'
```

---

# JSON → Objet JS

```js
const json =
'{"name":"John","age":25}';

const user = JSON.parse(json);

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

# Formatage JSON

```js
JSON.stringify(user, null, 2);
```

---

# DOM

DOM = Document Object Model

Permet de manipuler une page HTML.

---

# Sélection

## ID

```js
document.getElementById("title");
```

---

## Classe

```js
document.getElementsByClassName("item");
```

---

## Tag

```js
document.getElementsByTagName("div");
```

---

## Query Selector

```js
document.querySelector(".item");
```

---

## Query Selector All

```js
document.querySelectorAll(".item");
```

---

# Modifier le texte

```js
element.textContent = "Hello";
```

---

# Modifier le HTML

```js
element.innerHTML =
    "<strong>Hello</strong>";
```

---

# Modifier un attribut

```js
element.setAttribute(
    "class",
    "active"
);
```

---

# Ajouter une classe

```js
element.classList.add("active");
```

---

# Retirer une classe

```js
element.classList.remove("active");
```

---

# Toggle

```js
element.classList.toggle("active");
```

---

# Création d'élément

```js
const div =
    document.createElement("div");
```

---

# Ajouter au DOM

```js
document.body.appendChild(div);
```

---

# Supprimer

```js
element.remove();
```

---

# Event Listener

```js
button.addEventListener(
    "click",
    () => {
        console.log("Clicked");
    }
);
```

---

# Input

```js
input.addEventListener(
    "input",
    event => {
        console.log(event.target.value);
    }
);
```

---

# Submit

```js
form.addEventListener(
    "submit",
    event => {
        event.preventDefault();
    }
);
```