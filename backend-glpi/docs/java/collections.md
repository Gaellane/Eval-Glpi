# Collections en Java

Les collections sont un ensemble d'interfaces et de classes permettant de stocker et manipuler des groupes d'objets.

## 1. Les Listes (List)
Une `List` est une collection ordonnée qui autorise les doublons.

### ArrayList
C'est l'implémentation la plus courante. Elle utilise un tableau dynamique en interne.
```java
import java.util.ArrayList;
import java.util.List;

List<String> prenoms = new ArrayList<>();

// Ajouter des éléments
prenoms.add("Alice");
prenoms.add("Bob");

// Accéder à un élément (index basé sur 0)
String premier = prenoms.get(0); // "Alice"

// Modifier un élément
prenoms.set(1, "Charlie");

// Supprimer un élément
prenoms.remove("Alice");
prenoms.remove(0);

// Taille de la liste
int taille = prenoms.size();

// Parcourir la liste
for (String prenom : prenoms) {
    System.out.println(prenom);
}
```

## 2. Les Ensembles (Set)
Un `Set` est une collection qui n'autorise pas les doublons.

### HashSet
Très performant, mais ne garantit aucun ordre.
```java
import java.util.HashSet;
import java.util.Set;

Set<Integer> nombres = new HashSet<>();
nombres.add(1);
nombres.add(2);
nombres.add(1); // Ignoré, car 1 est déjà présent

// Vérifier la présence
boolean contientDeux = nombres.contains(2);
```

## 3. Les Dictionnaires (Map)
Une `Map` stocke des paires Clé/Valeur. Les clés doivent être uniques.

### HashMap
```java
import java.util.HashMap;
import java.util.Map;

Map<String, Integer> ages = new HashMap<>();

// Ajouter des paires
ages.put("Alice", 25);
ages.put("Bob", 30);

// Récupérer une valeur par sa clé
int ageAlice = ages.get("Alice");

// Vérifier la présence d'une clé
if (ages.containsKey("Bob")) {
    System.out.println("L'âge de Bob est connu.");
}

// Parcourir une Map
for (Map.Entry<String, Integer> entry : ages.entrySet()) {
    System.out.println(entry.getKey() + " a " + entry.getValue() + " ans.");
}
```
