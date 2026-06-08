# Java 8+ : Streams et Lambdas

L'API Stream, introduite dans Java 8, et les expressions Lambda permettent de traiter les collections de données (filtrer, trier, transformer) de manière fonctionnelle (plus proche de ce qu'on fait en JavaScript, Python...).

## 1. Expressions Lambda

Une expression Lambda est une manière courte d'écrire une fonction anonyme.

```java
import java.util.List;

public class LambdaExemple {
    public static void main(String[] args) {
        List<String> fruits = List.of("Pomme", "Banane", "Cerise");
        
        // Ancienne méthode (boucle for-each)
        for(String fruit : fruits) {
            System.out.println(fruit);
        }
        
        // Avec Lambda et method reference
        fruits.forEach(fruit -> System.out.println(fruit));
        
        // Encore plus court (Reference de méthode)
        fruits.forEach(System.out::println);
    }
}
```

## 2. L'API Stream

Un Stream est un flux de données (qui ne modifie pas la source d'origine). Un traitement via Stream comprend 3 étapes :
1. **La source** (ex: `liste.stream()`)
2. **Les opérations intermédiaires** (ex: `filter()`, `map()`, `sorted()`)
3. **L'opération terminale** (ex: `toList()`, `collect()`, `count()`)

### Filtrer (filter) et Transformer (map)

```java
import java.util.List;
import java.util.stream.Collectors;

public class StreamAchat {
    public static void main(String[] args) {
        List<Integer> prixUnitaire = List.of(10, 50, 120, 15, 200, 5);

        // On veut les prix supérieurs à 20, en y ajoutant 20% de TVA
        List<Double> prixTtc = prixUnitaire.stream()
                .filter(prix -> prix > 20)           // Garde 50, 120, 200
                .map(prix -> prix * 1.20)            // Applique la TVA
                // .sorted()                         // Optionnel: pour trier
                .toList();                           // (toList est dispo en Java 16+, 
                                                     // sinon .collect(Collectors.toList()))

        System.out.println(prixTtc);
    }
}
```

## 3. La classe Optional

L'`Optional` est fait pour éviter la fameuse `NullPointerException`. C'est une boîte qui contient soit un objet, soit rien du tout. C'est massivement utilisé dans Spring Data (ex: `findById(id)` retourne un `Optional`).

```java
import java.util.Optional;

public class OptionalExemple {
    
    // Méthode qui peut ne rien renvoyer
    public static Optional<String> trouverNom(boolean trouve) {
        if (trouve) return Optional.of("Alice");
        else return Optional.empty();
    }

    public static void main(String[] args) {
        Optional<String> resultat = trouverNom(false);
        
        // Vérifier si une valeur est présente avant de l'utiliser
        if (resultat.isPresent()) {
            System.out.println("Nom: " + resultat.get());
        }
        
        // Mieux : fournir une valeur par défaut
        String nomFinal = resultat.orElse("Inconnu");
        System.out.println("Bonjour " + nomFinal); // Affiche "Bonjour Inconnu"
        
        // Lancer une exception personnalisée si rien n'est trouvé
        // String nomObligatoire = resultat.orElseThrow(() -> new RuntimeException("Introuvable!"));
    }
}
```
