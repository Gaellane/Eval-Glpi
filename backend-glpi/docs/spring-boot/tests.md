# Les Tests sous Spring Boot

Tester son code permet de garantir qu'une fonctionnalité est valide avant de la livrer, et qu'elle n'est pas "cassée" par une évolution ultérieure. Spring Boot intègre d'office **JUnit 5** et **Mockito** via la dépendance `spring-boot-starter-test`.

## 1. Différence Unitaire vs Intégration

* **Test Unitaire** : On teste une seule méthode / une seule classe en l'isolant. Si cette classe a besoin d'autres classes (ex: un Service qui appelle un Repository), on simule ce que vont répondre les dépendances (on appelle cela un "Mock").
* **Test d'Intégration** (`@SpringBootTest`) : L'application démarre (quasi) complétement (comme en production) pour voir si toutes les couches (Contrôleur -> Service -> BDD) fonctionnent bien ensemble. C'est plus lent que le test unitaire.

## 2. Test Unitaire avec Mockito (Couche Service)

Ici nous voulons tester notre `UtilisateurService` de manière ultra rapide sans jamais toucher à une vraie base de données.

```java
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

// Active Mockito pour ce test
@ExtendWith(MockitoExtension.class)
class UtilisateurServiceTest {

    // On "simule" le repository
    @Mock
    private UtilisateurRepository repository;

    // On injecte le "Faux" repository directement dans le vrai service
    @InjectMocks
    private UtilisateurService service;

    @Test
    void trouverUtilisateur_DoitRetournerLUtilisateur_SiIlExiste() {
        // 1. Arrange (Préparation)
        Utilisateur mockUtilisateur = new Utilisateur(1L, "Alice");
        
        // On dicte au faussaire quoi répondre : 
        // "Quand on appelle findById(1), retourne notre mockUtilisateur"
        when(repository.findById(1L)).thenReturn(Optional.of(mockUtilisateur));

        // 2. Act (Action)
        Utilisateur resultat = service.trouverParId(1L);

        // 3. Assert (Vérification)
        assertNotNull(resultat);
        assertEquals("Alice", resultat.getNom());
        
        // Vérifie que la méthode findById a bien été appelée 1 seule fois
        verify(repository, times(1)).findById(1L);
    }
}
```

## 3. Test d'intégration (Couche RestController / HTTP)

Ici nous utilisons `@SpringBootTest` qui lance le contexte de l'application, et `MockMvc` pour simuler un appel HTTP (un POSTman de l'intérieur).

```java
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest // Charge tout l'application context
@AutoConfigureMockMvc // Initialise MockMvc pour faire des requêtes fausses HTTP
class UtilisateurControllerTest {

    @Autowired
    private MockMvc mockMvc; // L'outil pour générer nos requêtes

    @Test
    void quandAppelSurApi_alorsRetourneStatut200() throws Exception {
        
        // On effectue simulacre de requête HTTP GET
        mockMvc.perform(get("/api/utilisateurs/1")
                        .accept(MediaType.APPLICATION_JSON)) // On s'attend à du JSON
                // On vérifie les réponses
                .andExpect(status().isOk()) // Réponse HTTP 200 attendue
                .andExpect(jsonPath("$.nom").exists()); // on regarde si le json "nom" existe.
    }
}
```
