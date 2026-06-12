package com.projet.glpi.repository; // <-- Modifié ici

import com.projet.glpi.model.Status; // <-- Import mis à jour
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StatusRepository extends JpaRepository<Status, Integer> {

    public Status findByValue(Integer value);
    
}