package com.projet.glpi.repository; // <-- Modifié ici

import com.projet.glpi.model.Langue; // <-- Import mis à jour
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LangueRepository extends JpaRepository<Langue, Integer> {
}