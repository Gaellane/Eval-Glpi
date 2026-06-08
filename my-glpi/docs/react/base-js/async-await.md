# Async / Await

**Async/Await** est la syntaxe moderne pour gérer le code **asynchrone** en JavaScript (appels API, lectures de fichiers, timers…). C'est du sucre syntaxique par-dessus les **Promises**, rendu beaucoup plus lisible.

---

## Le problème : le code asynchrone

JavaScript est **mono-thread**. Les opérations longues (appels réseau, timers) ne doivent pas bloquer l'exécution. On utilise donc du code asynchrone.

```js
console.log("1 — Début");

setTimeout(() => {
  console.log("2 — Après 2 secondes");
}, 2000);

console.log("3 — Fin");

// Affiche :
// 1 — Début
// 3 — Fin
// 2 — Après 2 secondes (2s plus tard)
```

---

## Les Promises (rappel rapide)

Une **Promise** représente une valeur qui sera disponible **plus tard** :

```js
const promesse = fetch("https://jsonplaceholder.typicode.com/users/1");

promesse
  .then(response => response.json())  // quand la réponse arrive
  .then(data => console.log(data))     // quand le JSON est parsé
  .catch(error => console.error(error)); // si erreur
```

C'est fonctionnel, mais **l'enchaînement de `.then()` devient vite illisible** avec plusieurs appels.

---

## Async / Await : la solution

### `async` — Déclarer une fonction asynchrone

Le mot-clé `async` devant une fonction indique qu'elle retourne **toujours** une Promise :

```js
async function saluer() {
  return "Bonjour";
}

saluer().then(message => console.log(message)); // "Bonjour"
```

### `await` — Attendre le résultat d'une Promise

`await` **met en pause** l'exécution de la fonction `async` jusqu'à ce que la Promise soit résolue :

```js
async function chargerUtilisateur() {
  const response = await fetch("https://jsonplaceholder.typicode.com/users/1");
  const data = await response.json();
  console.log(data);
}

chargerUtilisateur();
```

C'est **exactement la même chose** que la version avec `.then()`, mais beaucoup plus lisible.

### Comparaison directe

```js
// ❌ Avec .then() — callback hell potentiel
function chargerDonnees() {
  fetch("/api/utilisateur")
    .then(res => res.json())
    .then(user => fetch(`/api/posts/${user.id}`))
    .then(res => res.json())
    .then(posts => console.log(posts))
    .catch(err => console.error(err));
}

// ✅ Avec async/await — lecture linéaire
async function chargerDonnees() {
  const resUser = await fetch("/api/utilisateur");
  const user = await resUser.json();

  const resPosts = await fetch(`/api/posts/${user.id}`);
  const posts = await resPosts.json();

  console.log(posts);
}
```

---

## Gestion des erreurs : `try/catch`

Avec les Promises, on utilise `.catch()`. Avec async/await, on utilise **`try/catch`** :

```js
async function chargerUtilisateur() {
  try {
    const response = await fetch("https://api.example.com/user/1");

    if (!response.ok) {
      throw new Error(`Erreur HTTP : ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("Impossible de charger l'utilisateur :", error.message);
  }
}
```

### `finally` — Code exécuté dans tous les cas

```js
async function chargerDonnees() {
  try {
    const res = await fetch("/api/data");
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Erreur :", error);
  } finally {
    console.log("Chargement terminé (succès ou échec)");
  }
}
```

---

## Exécution en parallèle : `Promise.all`

Par défaut, `await` attend **séquentiellement**. Si les appels sont indépendants, on peut les lancer **en parallèle** :

```js
// ❌ Séquentiel — lent (appel 1 fini, puis appel 2, puis appel 3)
async function chargerTout() {
  const users = await fetch("/api/users").then(r => r.json());
  const posts = await fetch("/api/posts").then(r => r.json());
  const comments = await fetch("/api/comments").then(r => r.json());
  // Temps total ≈ temps1 + temps2 + temps3
}

// ✅ Parallèle — rapide (tous lancés en même temps)
async function chargerTout() {
  const [users, posts, comments] = await Promise.all([
    fetch("/api/users").then(r => r.json()),
    fetch("/api/posts").then(r => r.json()),
    fetch("/api/comments").then(r => r.json()),
  ]);
  // Temps total ≈ max(temps1, temps2, temps3)
}
```

### `Promise.allSettled` — Ne pas échouer si une promesse échoue

```js
async function chargerTout() {
  const resultats = await Promise.allSettled([
    fetch("/api/users").then(r => r.json()),
    fetch("/api/posts").then(r => r.json()),
  ]);

  resultats.forEach(r => {
    if (r.status === "fulfilled") {
      console.log("Succès :", r.value);
    } else {
      console.error("Échec :", r.reason);
    }
  });
}
```

---

## Arrow functions async

On peut combiner `async` avec les arrow functions :

```js
// Fonction classique
async function charger() { ... }

// Arrow function async
const charger = async () => { ... };

// Avec paramètres
const chargerUser = async (id) => {
  const res = await fetch(`/api/users/${id}`);
  return res.json();
};
```

---

## En contexte React

### Appel API dans `useEffect`

```jsx
const ListeUtilisateurs = () => {
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);

  useEffect(() => {
    // On crée une fonction async à l'intérieur de useEffect
    // car useEffect ne peut PAS être async directement
    const charger = async () => {
      try {
        const response = await fetch("https://jsonplaceholder.typicode.com/users");

        if (!response.ok) {
          throw new Error(`Erreur ${response.status}`);
        }

        const data = await response.json();
        setUtilisateurs(data);
      } catch (err) {
        setErreur(err.message);
      } finally {
        setChargement(false);
      }
    };

    charger();
  }, []); // [] = exécuter une seule fois au montage

  if (chargement) return <p>Chargement...</p>;
  if (erreur) return <p>Erreur : {erreur}</p>;

  return (
    <ul>
      {utilisateurs.map(u => (
        <li key={u.id}>{u.name}</li>
      ))}
    </ul>
  );
};
```

> ⚠️ **`useEffect` ne peut PAS être `async`** directement. Il faut déclarer une fonction async à l'intérieur, puis l'appeler.

### Handler async (soumission de formulaire)

```jsx
const FormulaireContact = () => {
  const [message, setMessage] = useState("");
  const [envoi, setEnvoi] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnvoi(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) throw new Error("Erreur d'envoi");

      alert("Message envoyé !");
      setMessage("");
    } catch (err) {
      alert(`Erreur : ${err.message}`);
    } finally {
      setEnvoi(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button disabled={envoi}>
        {envoi ? "Envoi..." : "Envoyer"}
      </button>
    </form>
  );
};
```

### Charger plusieurs ressources en parallèle

```jsx
useEffect(() => {
  const chargerTout = async () => {
    try {
      const [users, posts] = await Promise.all([
        fetch("/api/users").then(r => r.json()),
        fetch("/api/posts").then(r => r.json()),
      ]);
      setUsers(users);
      setPosts(posts);
    } catch (err) {
      setErreur(err.message);
    }
  };

  chargerTout();
}, []);
```

---

## Résumé

| Concept | Syntaxe | Rôle |
|---|---|---|
| `async` | `async function f() {}` | Déclare une fonction asynchrone |
| `await` | `const x = await promise` | Attend le résultat d'une Promise |
| `try/catch` | `try { await ... } catch(e) {}` | Gérer les erreurs |
| `Promise.all` | `await Promise.all([...])` | Exécution en parallèle |
| `Promise.allSettled` | `await Promise.allSettled([...])` | Parallèle sans échec global |

> **Règles en React** :
> - Utilise `async/await` plutôt que `.then()` pour la lisibilité.
> - N'oublie **jamais** le `try/catch` pour les appels réseau.
> - `useEffect` ne peut pas être `async` → crée une fonction async dedans.
> - Utilise `Promise.all` quand tu as des appels indépendants à lancer en parallèle.
