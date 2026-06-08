# Spring Data JPA et Hibernate

Spring Data JPA est un pont qui simplifie l'interaction avec la base de données (qui en arrière-plan est souvent gérée par **Hibernate**). Vous n'avez plus besoin d'écrire le SQL à la main (JDBC) la grande majorité du temps.

## 1. Configurer la base de données
Dans le fichier `src/main/resources/application.properties` (ou `.yml`) :

```properties
# Connexion à une base de données MySQL
spring.datasource.url=jdbc:mysql://localhost:3306/ma_base
spring.datasource.username=root
spring.datasource.password=monmotdepasse
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# Demander à Hibernate de générer/mettre à jour les tables automatiquement
spring.jpa.hibernate.ddl-auto=update

# Afficher les requêtes SQL dans la console (pratique pour débugger)
spring.jpa.show-sql=true
```

## 2. Définir une Entité (`@Entity`)
Une Entité représente une table de votre base de données en tant qu'objet Java.

```java
import jakarta.persistence.*;

@Entity
@Table(name = "utilisateurs") // Optionnel: force le nom de la table
public class Utilisateur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // Auto-incrémenté

    @Column(nullable = false, unique = true)
    private String email;

    private String nom;
    private int age;

    // /!\ Les getters, setters, et un constructeur vide sont obligatoires /!\
    public Utilisateur() {}
    
    // ... Getters et Setters
}
```

## 3. Le Repository (Interface)
Il suffit de créer une interface et d'étendre `JpaRepository`. Spring génèrera **automatiquement** le code pour faire des requêtes (CRUD : Create, Read, Update, Delete).

```java
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UtilisateurRepository extends JpaRepository<Utilisateur, Long> {
    
    // Spring Boot comprend ce que vous voulez grâce au nom de la méthode !!
    // L'implémentation est magique.
    List<Utilisateur> findByAgeGreaterThan(int age);
    
    Utilisateur findByEmail(String email);
}
```

## 4. Utilisation

Dans votre Service, vous appelez simplement les méthodes de ce Repository:

```java
@Service
public class UtilisateurService {

    private final UtilisateurRepository repository;

    public UtilisateurService(UtilisateurRepository repository) {
        this.repository = repository;
    }

    public void demontrerCrud() {
        // Create
        Utilisateur u = new Utilisateur();
        u.setNom("Alice");
        repository.save(u); // INSERT INTO ...

        // Read
        List<Utilisateur> tous = repository.findAll(); // SELECT * FROM utilisateurs

        // Delete
        repository.deleteById(1L); // DELETE FROM utilisateurs WHERE id=1
    }
}
```
