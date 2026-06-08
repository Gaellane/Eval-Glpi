# Validation et Gestion Globale des Erreurs (Spring Boot)

Une bonne API doit valider les données reçues et renvoyer un format d'erreur clair et consistant (code HTTP 400 pour des données invalides, 404 si introuvable, etc.).

## 1. Validation de la donnée reçue (`spring-boot-starter-validation`)

Il faut d'abord que l'application puisse valider les DTO ou les Entités.

### Le Modèle / DTO

On utilise des annotations comme `@NotBlank`, `@Size`, `@Min`, `@Email` sur les variables :

```java
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class InscriptionDemande {

    @NotBlank(message = "Le nom ne peut pas être vide")
    @Size(min = 2, max = 50, message = "Le nom doit contenir entre 2 et 50 caractères")
    private String nom;

    @Email(message = "Le format de l'adresse email est invalide")
    private String email;

    // Getters et Setters...
}
```

### Le Contrôleur

Pour forcer Spring à effectuer la validation, on utilise `@Valid` (ou `@Validated`) juste devant l'objet du corps de la requête.

```java
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @PostMapping("/inscription")
    public ResponseEntity<String> inscription(@Valid @RequestBody InscriptionDemande demande) {
        // Le code ici n'est exécuté QUE SI la validation a réussi !
        return ResponseEntity.ok("Inscription réussie pour " + demande.getNom());
    }
}
```

## 2. Intercepter Globalement les Erreurs (`@ControllerAdvice`)

Si une validation échoue, Spring lève par défaut une exception (`MethodArgumentNotValidException`) très "laide" (pleine de stacktrace en JSON). L'intercepteur global permet de formater l'erreur pour le client HTTP.

```java
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

// Cette classe intercepte TOUTES les exceptions levées par tous les contrôleurs
@RestControllerAdvice
public class GestionErreurGlobale {

    // On indique ici l'Exception spécifique qu'on veut "capturer"
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST) // Force le statut HTTP 400
    public Map<String, String> gererExceptionsValidation(MethodArgumentNotValidException ex) {
        
        Map<String, String> erreurs = new HashMap<>();
        
        // Parcours tous les champs en erreur
        ex.getBindingResult().getFieldErrors().forEach(error -> {
            erreurs.put(error.getField(), error.getDefaultMessage());
        });
        
        return erreurs; // Renvoie un joli JSON: { "nom": "Le nom ne peut pas être vide" }
    }

    // Capture d'une Exception personnalisée (ex: Ressource introuvable)
    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND) // Statut 404
    public Map<String, String> gererIllegalArgument(IllegalArgumentException ex) {
        Map<String, String> erreur = new HashMap<>();
        erreur.put("erreur", ex.getMessage());
        return erreur;
    }
}
```
