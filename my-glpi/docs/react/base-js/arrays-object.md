# Arrays et Objects en JavaScript

Ce document présente les notions essentielles sur les tableaux (arrays) et les objets (objects) en JavaScript, puis fournit un utilitaire pour mesurer la "taille" des attributs d'un objet (y compris de façon récursive pour les attributs qui sont eux-mêmes des objets).

**Arrays**

- **Définition** : Les arrays sont des objets indexés numériquement, utilisables pour stocker des listes ordonnées.
- **Création** : `const a = []; const b = [1, 2, 3]; new Array(5)`
- **Vérifier** : `Array.isArray(value)`
- **Propriétés importantes** :
	- `length` : nombre d'éléments (la "taille" d'un array).
	- Méthodes mutatives : `push`, `pop`, `shift`, `unshift`, `splice`, `sort`, `reverse`.
	- Méthodes non-mutatives : `slice`, `concat`, `map`, `filter`, `reduce`, `flat`, `flatMap`.

Exemple :

```js
const arr = [1, 2, 3];
arr.push(4); // arr.length === 4
const doubled = arr.map(x => x * 2);
```

Conseil : pour préserver l'immuabilité dans les apps React, préférez `[...]`, `map`/`filter`/`concat` plutôt que de muter l'array en place.

**Objects**

- **Définition** : collection de paires clé/valeur. Les clés sont des chaînes (ou Symbols) et les valeurs peuvent être de n'importe quel type.
- **Création** : `{}`, `Object.create(null)`, `new MyClass()`
- **Accès** : `obj.key` ou `obj['key']`
- **Itération** : `Object.keys(obj)`, `Object.values(obj)`, `Object.entries(obj)`
- **Copie (shallow)** : `{ ...obj }` ou `Object.assign({}, obj)`
- **Propriété utile** : `Object.keys(obj).length` donne le nombre d'attributs directs d'un objet.

Exemple :

```js
const o = { name: 'Alice', age: 30 };
console.log(Object.keys(o).length); // 2
```

**Taille (size) — règles pratiques**

- `string` → `value.length` (caractères)
- `array` → `array.length`
- `object` (objet littéral) → `Object.keys(obj).length` (attributs directs)
- `Map` / `Set` → `.size`
- `null` / `undefined` → 0
- types primitifs (`number`, `boolean`, `symbol`, `bigint`) → considéré comme taille 1

Pour les objets imbriqués (nested objects), on peut vouloir mesurer la taille récursive de chaque attribut. Ci-dessous un utilitaire prêt à l'emploi pour produire un rapport décrivant la "taille" et, lorsque l'attribut est un objet (ou contient des objets), le détail récursif.

**Utilitaire : getAttributeSizes**

Le fichier utilitaire est disponible dans : [src/services/utils/sizeUtils.js](src/services/utils/sizeUtils.js)

Exemple d'utilisation :

```js
import { getAttributeSizes } from 'src/services/utils/sizeUtils';

const data = {
	title: 'Rapport',
	tags: ['bug', 'frontend'],
	metadata: {
		author: 'Bob',
		stats: { views: 120, likes: 10 }
	}
};

console.log(JSON.stringify(getAttributeSizes(data), null, 2));

/* Exemple de sortie :
{
	"title": { "type": "string", "size": 6 },
	"tags": { "type": "array", "size": 2 },
	"metadata": {
		"type": "object",
		"size": 2,
		"nested": {
			"author": { "type": "string", "size": 3 },
			"stats": { "type": "object", "size": 2, "nested": { "views": {"type":"number","size":1}, "likes": {"type":"number","size":1} } }
		}
	}
}
*/
```

Ce rapport est utile pour analyser rapidement la "taille" des propriétés, détecter des objets volumineux ou pour préparer des règles d'import/export (par ex. lors d'un import CSV/JSON).

---

Si vous voulez, je peux :
- ajouter des tests unitaires pour `getAttributeSizes`;
- fournir une version TypeScript;
- intégrer une commande de debug dans l'application pour afficher le rapport d'un objet en runtime.



.push() : ajoute un élément à la fin.

.pop() : retire le dernier élément.

.map() : crée un nouveau tableau en transformant chaque élément.

.filter() : crée un nouveau tableau avec uniquement les éléments qui respectent une condition.

.reduce() : Permet de "réduire" un tableau à une seule valeur (comme une somme ou un objet cumulé).

.find() : Retourne la première valeur qui satisfait une condition donnée (très pratique pour chercher un élément précis).

.every() / .some() : Permettent de vérifier si tous les éléments ou au moins un élément respectent une condition (retournent true ou false).

```js
const total = panier.reduce((accumulateur, plus) => {
  return accumulateur + plus;
}, 0); // <-- Voici la valeur initiale

const total = panier.reduce((accumulateur, produit) => {
  return accumulateur + produit.prix;
}, 0); // <-- Voici la valeur initiale

```

Object.keys(monObjet) : Retourne un tableau contenant uniquement les clés (les propriétés).

Object.values(monObjet) : Retourne un tableau contenant uniquement les valeurs.

Object.entries(monObjet) : Retourne un tableau de tableaux, où chaque sous-tableau contient une paire [clé, valeur].