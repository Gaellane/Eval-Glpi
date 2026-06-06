package com.projet.glpi.repository; // <-- Modifié ici

import com.projet.glpi.model.Produit; // <-- Import mis à jour
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProduitRepository extends JpaRepository<Produit, Long> {
}