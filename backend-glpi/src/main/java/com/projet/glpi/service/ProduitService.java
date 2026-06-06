package com.projet.glpi.service; // <-- Modifié ici

import com.projet.glpi.model.Produit; // <-- Import mis à jour
import com.projet.glpi.repository.ProduitRepository; // <-- Import mis à jour
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ProduitService {

    private final ProduitRepository produitRepository;

    public ProduitService(ProduitRepository produitRepository) {
        this.produitRepository = produitRepository;
    }

    public Produit enregistrerProduit(Produit produit) {
        return produitRepository.save(produit);
    }

    public List<Produit> recupererTousLesProduits() {
        return produitRepository.findAll();
    }

    public Optional<Produit> recupererProduitParId(Long id) {
        return produitRepository.findById(id);
    }

    public void supprimerProduit(Long id) {
        produitRepository.deleteById(id);
    }
}