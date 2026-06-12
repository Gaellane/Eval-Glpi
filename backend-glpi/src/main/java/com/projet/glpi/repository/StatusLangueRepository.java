package com.projet.glpi.repository; // <-- Modifié ici

import com.projet.glpi.model.StatusLangue; // <-- Import mis à jour

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StatusLangueRepository extends JpaRepository<StatusLangue, Integer> {
    List<StatusLangue> findByStatusId(Integer statusId);
    StatusLangue findByStatusIdAndLangueId(Integer statusId, Integer langueId);
    List<StatusLangue> findByLangueId(Integer langueId);
}