# Gestion des Exceptions

En Java, une exception est un événement qui perturbe le déroulement normal du programme (Erreur de fichier, Division par zéro, Objet null...).

## 1. La hiérarchie des Exceptions

* `Throwable` : La classe mère de toutes les erreurs et exceptions.
  * `Error` : Problèmes graves (ex: `OutOfMemoryError`). On ne les capture presque jamais.
  * `Exception` : Problèmes rattrapables.
    * `RuntimeException` (Unchecked) : Exceptions non vérifiées à la compilation (ex: `NullPointerException`, `IndexOutOfBoundsException`). Pas besoin de `try-catch` obligatoire.
    * *Autres Exceptions* (Checked) : Exceptions obligatoirement vérifiées à la compilation (ex: `IOException`, `SQLException`). Le compilateur oblige à les gérer.

## 2. Gérer une Exception (`try-catch-finally`)

```java
public class ManipulationException {
    public static void main(String[] args) {
        int[] nombres = {1, 2, 3};
        
        try {
            // Code risqué
            System.out.println(nombres[5]); // Va générer une ArrayIndexOutOfBoundsException
            int calcul = 10 / 0; // Ne sera pas exécuté
            
        } catch (ArrayIndexOutOfBoundsException e) {
            // Capture spécifique
            System.err.println("Erreur d'index : " + e.getMessage());
            
        } catch (ArithmeticException e) {
            System.err.println("Division par zéro : " + e.getMessage());
            
        } catch (Exception e) {
            // Capture générique en dernier recours
            System.err.println("Une erreur inattendue est survenue : " + e.getMessage());
            
        } finally {
            // Ce bloc s'exécute TOUJOURS, qu'il y ait eu une exception ou non.
            System.out.println("Nettoyage des ressources...");
        }
    }
}
```

## 3. Propager une Exception (`throws`)

Si une méthode ne veut pas gérer elle-même l'exception, elle peut la déléguer à la méthode qui l'a appelée.

```java
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

public class FichierUtils {
    
    // On annonce que cette méthode PEUT jeter une IOException
    public void lireFichier(String chemin) throws IOException {
        String contenu = Files.readString(Paths.get(chemin));
        System.out.println(contenu);
    }
}
```

## 4. Créer sa propre Exception et la déclencher (`throw`)

Il est très courant de créer ses propres exceptions pour la logique métier (ex: `CompteBloqueException`, `UtilisateurIntrouvableException`).

```java
// 1. Définir l'exception
public class SoldeInsuffisantException extends RuntimeException {
    public SoldeInsuffisantException(String message) {
        super(message);
    }
}

// 2. L'utiliser
public class CompteBancaire {
    private double solde = 100.0;
    
    public void retirer(double montant) {
        if (montant > solde) {
            // Le mot clé "throw" déclenche manuellement une exception
            throw new SoldeInsuffisantException("Solde insuffisant pour retirer " + montant);
        }
        solde -= montant;
        System.out.println("Retrait ok, nouveau solde : " + solde);
    }
}
```
