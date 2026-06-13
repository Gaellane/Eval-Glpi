# CRUD avec Spring Boot Data JPA

Pour gérer les entités, étendez l'interface `JpaRepository`. Elle fournit nativement toutes les méthodes pour les opérations individuelles et par lots (multiples).

---

## 1. Le Repository de base

```java
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProduitRepository extends JpaRepository<Produit, Long> {
    // Toutes les méthodes CRUD sont héritées automatiquement
}
```

---

## 2. Opérations CRUD dans le Service

### 🟢 CREATE (Création)

*   **Individuel (`save`) :** Insère un seul enregistrement.
*   **Multiple (`saveAll`) :** Insère une liste d'enregistrements en une seule fois.

```java
// Individuel
public Produit creerProduit(Produit produit) {
    return produitRepository.save(produit);
}

// Multiple
public List<Produit> creerPlusieursProduits(List<Produit> produits) {
    return produitRepository.saveAll(produits);
}
```

### 🔵 READ (Lecture)

*   **Individuel (`findById`) :** Récupère un élément par son identifiant unique.
*   **Multiple (`findAll` / `findAllById`) :** Récupère tout le contenu ou une sélection ciblée.

```java
// Individuel (Retourne un Optional pour éviter les NullPointerException)
public Optional<Produit> obtenirProduit(Long id) {
    return produitRepository.findById(id);
}

// Multiple (Tout récupérer)
public List<Produit> obtenirTousLesProduits() {
    return produitRepository.findAll();
}

// Multiple (Par liste d'IDs spécifiques)
public List<Produit> obtenirProduitsParIds(List<Long> ids) {
    return produitRepository.findAllById(ids);
}
```

### 🟡 UPDATE (Mise à jour)

*   **Individuel :** JPA utilise aussi `save()`. Si l'ID existe déjà en base, il met à jour la ligne au lieu de la créer.
*   **Multiple :** De même, `saveAll()` met à jour tous les éléments de la liste qui possèdent un ID existant.

```java
// Individuel
public Produit modifierProduit(Long id, Produit produitDetails) {
    Produit produit = produitRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Produit non trouvé"));
    
    produit.setNom(produitDetails.getNom());
    produit.setPrix(produitDetails.getPrix());
    
    return produitRepository.save(produit);
}

// Multiple
public List<Produit> modifierPlusieursProduits(List<Produit> produitsModifies) {
    // Les objets dans 'produitsModifies' doivent impérativement contenir leur ID
    return produitRepository.saveAll(produitsModifies);
}
```

### 🔴 DELETE (Suppression)

*   **Individuel (`deleteById`) :** Supprime via la clé primaire.
*   **Multiple (`deleteAllById` / `deleteAllInBatch`) :** Supprime une sélection ou nettoie intégralement la table.

```java
import org.springframework.transaction.annotation.Transactional;

@Transactional // Recommandé pour les opérations de suppression
public class ProduitService {

    // Individuel
    public void supprimerProduit(Long id) {
        produitRepository.deleteById(id);
    }

    // Multiple (Par liste d'IDs)
    public void supprimerProduitsParIds(List<Long> ids) {
        produitRepository.deleteAllById(ids);
    }

    // Multiple (Vider toute la table proprement et rapidement)
    public void viderTable() {
        produitRepository.deleteAllInBatch();
    }
}
```
