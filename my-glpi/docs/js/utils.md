# Utils

Ce document regroupe :

- Date
- Number
- String

---

# DATE

## Date actuelle

```js
const date = new Date();
```

---

## Timestamp

```js
Date.now();
```

---

## Année

```js
date.getFullYear();
```

---

## Mois

```js
date.getMonth();
```

Attention :

```js
0 = Janvier
11 = Décembre
```

---

## Jour du mois

```js
date.getDate();
```

---

## Jour semaine

```js
date.getDay();
```

---

## Heure

```js
date.getHours();
```

---

## Minutes

```js
date.getMinutes();
```

---

## Format ISO

```js
date.toISOString();
```

---

## Format local

```js
date.toLocaleDateString();
```

---

# NUMBER

## Conversion

```js
Number("123");
```

---

## Parse Int

```js
parseInt("123");
```

---

## Parse Float

```js
parseFloat("10.5");
```

---

## Nombre entier ?

```js
Number.isInteger(10);
```

---

## Arrondi

```js
Math.round(10.5);
```

---

## Plafond

```js
Math.ceil(10.1);
```

---

## Sol

```js
Math.floor(10.9);
```

---

## Maximum

```js
Math.max(1,2,3);
```

---

## Minimum

```js
Math.min(1,2,3);
```

---

## Aléatoire

```js
Math.random();
```

---

## Entre min et max

```js
const random =
    Math.floor(Math.random() * 10);
```

---

# STRING

## Longueur

```js
text.length
```

---

## Majuscule

```js
text.toUpperCase();
```

---

## Minuscule

```js
text.toLowerCase();
```

---

## Remplacer

```js
text.replace("John", "Bob");
```

---

## Tout remplacer

```js
text.replaceAll("a", "x");
```

---

## Découper

```js
text.split(",");
```

---

## Sous-chaîne

```js
text.substring(0,5);
```

---

## Slice

```js
text.slice(0,5);
```

---

## Commence par

```js
text.startsWith("Hello");
```

---

## Termine par

```js
text.endsWith("World");
```

---

## Inclut

```js
text.includes("John");
```

---

## Trim

```js
text.trim();
```

---

## Répéter

```js
text.repeat(3);
```

---

## Template String

```js
const name = "John";

const result = `Hello ${name}`;
```