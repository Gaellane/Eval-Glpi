# Expressions régulières (RegEx)

Une expression régulière (RegEx) est un motif utilisé pour rechercher, valider ou manipuler du texte. En JavaScript, on peut créer une RegExp soit avec une littérale `/pattern/flags`, soit avec le constructeur `new RegExp("pattern", "flags")`.

## Sommaire
- Syntaxe de base
- Flags (modificateurs)
- Classes de caractères
- Quantificateurs
- Ancrages
- Groupes et captures
- Lookahead / Lookbehind
- Méthodes utiles en JavaScript
- Exemples pratiques
- Conseils & ressources

## Syntaxe de base

- Littérale : `/abc/i` — recherche `abc` (ici sans tenir compte de la casse).
- Constructeur : `new RegExp('a\\d+')` — utile quand le motif est dynamique.

Note : dans une chaîne (constructeur), il faut échapper le `\\` (double échappement). Exemple : `new RegExp("\\\\d+")` équivaut à `/\d+/`.

## Flags (modificateurs)

- `i` : insensible à la casse (ignoreCase).
- `g` : global — trouver toutes les occurrences (utile avec `match`, `replace`, `exec`).
- `m` : multi-line — `^` et `$` correspondent respectivement au début/fin de ligne.
- `s` : dotAll — le `.` matche aussi les retours à la ligne.
- `u` : unicode — active le mode Unicode (bons comportements pour caractères Unicode).
- `y` : sticky — commence la recherche à la position actuelle (`lastIndex`).

## Classes de caractères

- `.` : n'importe quel caractère (sauf newline sans `s`).
- `\d` / `\D` : chiffre / non-chiffre.
- `\w` / `\W` : mot (lettres, chiffres, underscore) / non-mot.
- `\s` / `\S` : espace blanc / non-espace.
- `[abc]` : un des caractères `a` ou `b` ou `c`.
- `[a-z]` : intervalle (ici lettres minuscules).
- `[^abc]` : caractère sauf `a`, `b`, `c`.

Exemple : `/[A-Za-z0-9_-]/` pour autoriser lettres, chiffres, underscore et tirets.

## Quantificateurs

- `?` : 0 ou 1 fois (optionnel).
- `*` : 0 fois ou plus.
- `+` : 1 fois ou plus.
- `{n}` : exactement n fois.
- `{n,}` : n fois ou plus.
- `{n,m}` : entre n et m fois.
- Greedy vs lazy : les quantificateurs sont gourmands par défaut (`.+`), ajoutez `?` pour rendre non-gourmand (`.+?`).

Exemple : `/a{2,4}/` correspond `aa`, `aaa` ou `aaaa`.

## Ancrages

- `^` : début de la chaîne (ou début de ligne en `m`).
- `$` : fin de la chaîne (ou fin de ligne en `m`).
- `\b` : frontière de mot.
- `\B` : non-frontière de mot.

Pour valider que toute la chaîne correspond, on utilise `^` et `$` : `/^\d{4}-\d{2}-\d{2}$/` (date `YYYY-MM-DD`).

## Groupes et captures

- `( ... )` : groupe capturant — récupérable via `RegExp.exec`, `match` (captures) et backreferences (`\1`).
- `(?: ... )` : groupe non capturant — utile pour grouper sans capturer.
- `(?<name> ... )` : groupe nommé (ES2018+), récupérable via `groups.name`.
- Backreference : `\1`, `\2`... ou `\k<name>` pour groupes nommés.

Exemple : `/^(\w+)-(\d+)$/` capture deux groupes : un mot puis un nombre.

## Lookahead / Lookbehind

- Positive lookahead : `(?=...)` — assure qu'un motif suit, sans le consommer.
- Negative lookahead : `(?!...)` — assure qu'un motif ne suit pas.
- Positive lookbehind : `(?<=...)` — assure qu'un motif précède (ES2018+).
- Negative lookbehind : `(?<!...)` — assure qu'un motif ne précède pas (ES2018+).

Exemple : `\d+(?=px)` — nombre suivi de `px` (le `px` n'est pas capturé).

Attention : le support des lookbehind est récent ; vérifiez la compatibilité des environnements cibles.

## Méthodes utiles en JavaScript

- `RegExp.prototype.test(str)` : renvoie `true`/`false` si le motif est trouvé.
- `RegExp.prototype.exec(str)` : renvoie un tableau avec captures, ou `null`. Utile en boucle avec `g`.
- `String.prototype.match(regexp)` : si `g`, renvoie toutes les correspondances ; sinon renvoie captures.
- `String.prototype.matchAll(regexp)` : renvoie un itérable de correspondances (avec captures) — très utile pour extraire tous les groupes.
- `String.prototype.replace(regexp, replacement)` : remplace les correspondances ; `replacement` peut être une fonction.
- `String.prototype.search(regexp)` : index de la première correspondance ou `-1`.
- `String.prototype.split(regexp)` : divise la chaîne selon le motif.

Exemples :

```javascript
// test
const re = /abc/i;
re.test('Abc'); // true

// exec (boucle avec g)
const r = /t(e)(st(ing)?)/g;
let m;
while ((m = r.exec('test testing'))) {
  console.log(m[0], m[1], m[2]);
}

// matchAll
const matches = [...'a1b2c3'.matchAll(/(\d)/g)];
// matches contient chaque chiffre capturé

// replace avec fonction
'2021-01-02'.replace(/(\d{4})-(\d{2})-(\d{2})/, (m, y, mo, d) => `${d}/${mo}/${y}`);
// '02/01/2021'

// constructeur RegExp (motif dynamique)
const word = 'ab+'; // attention aux caractères spéciaux
const safe = new RegExp(word.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&'));

```

## Exemples pratiques

- Valider un email (version simple, pas parfaite) :

```javascript
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
emailRe.test('utilisateur@example.com'); // true
```

- Extraire le domaine d'une URL :

```javascript
const url = 'https://example.com/path';
const m = url.match(/^https?:\/\/([^\/\s]+)\/?.*$/i);
const domain = m ? m[1] : null; // 'example.com'
```

- Nettoyer les espaces multiples :

```javascript
'  ceci   est  un test '.replace(/\s+/g, ' ').trim();
```

## Conseils & bonnes pratiques

- Toujours échapper les entrées utilisateur lorsque vous construisez dynamiquement un RegExp.
- Préférez des motifs clairs et lisibles plutôt que de tout mettre dans une seule ligne complexe.
- Pour valider complètement une chaîne, utilisez `^...$`.
- Évitez les motifs susceptibles de provoquer un "catastrophic backtracking" (groupes imbriqués avec quantificateurs ambigus) — testez sur des cas limites.
- Utilisez `matchAll` pour itérer proprement sur toutes les correspondances avec captures.

## Ressources

- MDN RegExp : https://developer.mozilla.org/fr/docs/Web/JavaScript/Guide/Regular_expressions
- regex101 (outil interactif) : https://regex101.com/

---

Si vous voulez, je peux :
- ajouter des exemples spécifiques (emails, téléphones, URL, etc.),
- proposer des exercices d'entraînement,
- ou intégrer cette page dans un sommaire.
