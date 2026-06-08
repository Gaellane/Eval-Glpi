# Fondamentaux de Spring Boot

Spring Boot simplifie considérablement la création d'applications Java basées sur le framework Spring. 

## 1. Architecture Multicouches
Une application Spring Boot classique respecte une architecture en couches :
1. **Controller (Contrôleur)** : Gère les requêtes HTTP (L'interface API).
2. **Service** : Contient la logique métier ("Business logic").
3. **Repository** : Gère l'accès aux données de la base de données.

## 2. Annotations Essentielles

### `@SpringBootApplication`
Placée sur la classe principale (contenant le `main`), elle active la configuration automatique de Spring Boot et scanne votre projet pour trouver d'autres composants.

### Logique d'injection de dépendances (Beans)
L'IOC (Inversion of Control) de Spring permet d'instancier automatiquement des classes.
* `@Component` : Indique génériquement que cette classe est un 'Bean' Spring.
* `@Service` : Version spécialisée de `@Component` pour la couche métier.
* `@Repository` : Version spécialisée pour la couche de données.

### `@Autowired` ou l'Injection par Constructeur
Permet à Spring de fournir (injecter) automatiquement un composant à un autre. Il est aujourd'hui fortement recommandé d'utiliser l'**injection par constructeur** (sans l'annotation `@Autowired` forcément requise si vous avez un seul constructeur).

```java
@Service
public class UtilisateurService {
    
    private final UtilisateurRepository repository;

    // L'injection se fait ici automatiquement
    public UtilisateurService(UtilisateurRepository repository) {
        this.repository = repository;
    }
}
```

## 3. Créer une API REST (Controllers)

* `@RestController` : Indique que la classe sert des points de terminaisons web (API).
* `@RequestMapping("/api/...")` : Définit la route de base (URL).
* `@GetMapping`, `@PostMapping`, `@PutMapping`, `@DeleteMapping` : Définissent les méthodes HTTP.

```java
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/utilisateurs")
public class UtilisateurController {

    private final UtilisateurService service;

    public UtilisateurController(UtilisateurService service) {
        this.service = service;
    }

    // Capture GET /api/utilisateurs
    @GetMapping
    public List<Utilisateur> getAll() {
        return service.recupererTous();
    }

    // Capture POST /api/utilisateurs
    @PostMapping
    public Utilisateur create(@RequestBody Utilisateur nouvelUtilisateur) {
        return service.sauvegarder(nouvelUtilisateur);
    }
}
```
