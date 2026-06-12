# Collections en Java

Les collections sont un ensemble d'interfaces et de classes permettant de stocker et manipuler des groupes d'objets de manière dynamique.

Le framework Collections est situé dans le package :

```java
import java.util.*;
```

---

# 1. Les Listes (List)

Une `List` est une collection ordonnée qui autorise les doublons.

Caractéristiques :

* Conserve l'ordre d'insertion.
* Accès possible par index.
* Autorise les doublons.

## ArrayList

C'est l'implémentation la plus utilisée. Elle repose sur un tableau dynamique.

```java
import java.util.ArrayList;
import java.util.List;

List<String> prenoms = new ArrayList<>();

prenoms.add("Alice");
prenoms.add("Bob");
prenoms.add("Charlie");

System.out.println(prenoms.get(0));

prenoms.set(1, "David");

prenoms.remove("Alice");
prenoms.remove(0);

System.out.println(prenoms.size());

for (String prenom : prenoms) {
    System.out.println(prenom);
}
```

### Méthodes importantes

```java
list.add(element);
list.get(index);
list.set(index, element);
list.remove(index);
list.remove(element);
list.contains(element);
list.isEmpty();
list.clear();
list.size();
```

---

## LinkedList

Utilise une liste chaînée.

```java
import java.util.LinkedList;
import java.util.List;

List<String> noms = new LinkedList<>();

noms.add("Alice");
noms.add("Bob");

noms.remove("Alice");
```

### Avantages

* Insertion rapide.
* Suppression rapide.

### Inconvénients

* Accès par index plus lent.

---

# 2. Les Ensembles (Set)

Un `Set` est une collection qui n'autorise pas les doublons.

Caractéristiques :

* Pas de doublons.
* Recherche rapide.
* Pas d'accès par index.

---

## HashSet

Le plus performant.

```java
import java.util.HashSet;
import java.util.Set;

Set<Integer> nombres = new HashSet<>();

nombres.add(1);
nombres.add(2);
nombres.add(1);

System.out.println(nombres);
```

### Méthodes importantes

```java
set.add(element);
set.remove(element);
set.contains(element);
set.size();
set.clear();
```

---

## LinkedHashSet

Conserve l'ordre d'insertion.

```java
Set<String> noms = new LinkedHashSet<>();

noms.add("Alice");
noms.add("Bob");
noms.add("Charlie");
```

Résultat :

```text
[Alice, Bob, Charlie]
```

---

## TreeSet

Trie automatiquement les éléments.

```java
import java.util.TreeSet;

TreeSet<Integer> nombres = new TreeSet<>();

nombres.add(5);
nombres.add(1);
nombres.add(3);

System.out.println(nombres);
```

Résultat :

```text
[1, 3, 5]
```

---

# 3. Les Dictionnaires (Map)

Une `Map` associe une clé à une valeur.

Caractéristiques :

* Clés uniques.
* Valeurs éventuellement dupliquées.
* Recherche rapide via la clé.

---

## HashMap

```java
import java.util.HashMap;
import java.util.Map;

Map<String, Integer> ages = new HashMap<>();

ages.put("Alice", 25);
ages.put("Bob", 30);

System.out.println(ages.get("Alice"));

if (ages.containsKey("Bob")) {
    System.out.println("Bob existe");
}
```

### Parcours

```java
for (Map.Entry<String, Integer> entry : ages.entrySet()) {
    System.out.println(
        entry.getKey() + " -> " +
        entry.getValue()
    );
}
```

### Méthodes importantes

```java
map.put(cle, valeur);
map.get(cle);
map.remove(cle);
map.containsKey(cle);
map.containsValue(valeur);
map.size();
map.clear();
```

---

## LinkedHashMap

Conserve l'ordre d'insertion.

```java
Map<Integer, String> map = new LinkedHashMap<>();

map.put(1, "Premier");
map.put(2, "Deuxieme");
map.put(3, "Troisieme");
```

---

## TreeMap

Trie automatiquement les clés.

```java
Map<String, Integer> notes = new TreeMap<>();

notes.put("Bob", 15);
notes.put("Alice", 18);
notes.put("Charlie", 12);

System.out.println(notes);
```

Résultat :

```text
{Alice=18, Bob=15, Charlie=12}
```

---

# 4. Conversion entre Collections

## List vers Set

Permet de supprimer les doublons.

```java
List<String> liste = List.of(
    "A",
    "B",
    "A"
);

Set<String> set = new HashSet<>(liste);
```

---

## Set vers List

```java
Set<String> set = Set.of(
    "A",
    "B",
    "C"
);

List<String> liste = new ArrayList<>(set);
```

---

## Map vers List de clés

```java
Map<Integer, String> map = new HashMap<>();

List<Integer> cles =
        new ArrayList<>(map.keySet());
```

---

## Map vers List de valeurs

```java
List<String> valeurs =
        new ArrayList<>(map.values());
```

---

## Map vers List d'entrées

```java
List<Map.Entry<Integer, String>> entries =
        new ArrayList<>(map.entrySet());
```

---

# 5. Streams

Les Streams permettent de filtrer, transformer et agréger des collections.

---

## Filtrer

```java
List<Integer> nombres =
        List.of(1,2,3,4,5,6);

List<Integer> pairs =
        nombres.stream()
               .filter(n -> n % 2 == 0)
               .toList();
```

Résultat :

```text
[2,4,6]
```

---

## Transformer

```java
List<String> noms =
        List.of("alice", "bob");

List<String> majuscules =
        noms.stream()
            .map(String::toUpperCase)
            .toList();
```

Résultat :

```text
[ALICE, BOB]
```

---

## Transformer une liste d'objets

```java
List<String> noms =
        users.stream()
             .map(User::getNom)
             .toList();
```

---

## Trier

```java
List<Integer> nombres =
        List.of(5,1,8,2,3);

List<Integer> tries =
        nombres.stream()
               .sorted()
               .toList();
```

Résultat :

```text
[1,2,3,5,8]
```

---

## Compter

```java
long total =
        nombres.stream()
               .count();
```

---

## Rechercher

```java
Optional<Integer> resultat =
        nombres.stream()
               .filter(n -> n > 3)
               .findFirst();
```

---

# 6. Lambda Expressions

Les lambdas simplifient l'écriture du code.

```java
List<String> noms =
        List.of("Alice", "Bob");

noms.forEach(nom -> {
    System.out.println(nom);
});
```

---

# 7. Parcours des Collections

## Boucle for-each

```java
for (String nom : noms) {
    System.out.println(nom);
}
```

---

## Iterator

```java
Iterator<String> it =
        noms.iterator();

while (it.hasNext()) {
    System.out.println(it.next());
}
```

---

## forEach

```java
noms.forEach(System.out::println);
```

---

# 8. Complexité approximative

| Structure  | Recherche | Insertion | Suppression |
| ---------- | --------- | --------- | ----------- |
| ArrayList  | O(1)      | O(1)      | O(n)        |
| LinkedList | O(n)      | O(1)      | O(1)        |
| HashSet    | O(1)      | O(1)      | O(1)        |
| TreeSet    | O(log n)  | O(log n)  | O(log n)    |
| HashMap    | O(1)      | O(1)      | O(1)        |
| TreeMap    | O(log n)  | O(log n)  | O(log n)    |

---

# 9. Quand utiliser quoi ?

| Besoin                                    | Collection recommandée |
| ----------------------------------------- | ---------------------- |
| Liste classique                           | ArrayList              |
| Beaucoup d'insertions/suppressions        | LinkedList             |
| Éviter les doublons                       | HashSet                |
| Garder l'ordre d'insertion sans doublons  | LinkedHashSet          |
| Trier automatiquement                     | TreeSet                |
| Associer clé/valeur                       | HashMap                |
| Associer clé/valeur en conservant l'ordre | LinkedHashMap          |
| Associer clé/valeur triées                | TreeMap                |

---

# Conclusion

Les collections Java permettent de gérer efficacement des groupes de données :

* `List` : données ordonnées avec doublons.
* `Set` : données uniques.
* `Map` : association clé/valeur.
* `Stream` : traitement moderne des collections.
* `Lambda` : simplification du code.

Le choix de la collection dépend principalement du besoin en ordre, unicité, rapidité de recherche et tri.


