package com.projet.glpi.controller; // <-- Modifié ici

import com.projet.glpi.model.Produit; // <-- Import mis à jour
import com.projet.glpi.service.ProduitService; // <-- Import mis à jour
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/produits")
public class ProduitController {

    private final ProduitService produitService;

    public ProduitController(ProduitService produitService) {
        this.produitService = produitService;
    }

    @PostMapping
    public ResponseEntity<Produit> creerProduit(@RequestBody Produit produit) {
        Produit nouveauProduit = produitService.enregistrerProduit(produit);
        return ResponseEntity.ok(nouveauProduit);
    }

    @GetMapping
    public List<Produit> listerProduits() {
        return produitService.recupererTousLesProduits();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Produit> obtenirProduit(@PathVariable Long id) {
        return produitService.recupererProduitParId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Produit> modifierProduit(@PathVariable Long id, @RequestBody Produit produitDetails) {
        return produitService.recupererProduitParId(id)
                .map(produitExistant -> {
                    produitExistant.setNom(produitDetails.getNom());
                    produitExistant.setPrix(produitDetails.getPrix());
                    Produit produitMisAJour = produitService.enregistrerProduit(produitExistant);
                    return ResponseEntity.ok(produitMisAJour);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimerProduit(@PathVariable Long id) {
        if (produitService.recupererProduitParId(id).isPresent()) {
            produitService.supprimerProduit(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}