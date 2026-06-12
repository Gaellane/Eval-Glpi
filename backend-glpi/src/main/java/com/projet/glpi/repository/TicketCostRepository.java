package com.projet.glpi.repository; // <-- Modifié ici

import com.projet.glpi.model.TicketCost; // <-- Import mis à jour

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface TicketCostRepository extends JpaRepository<TicketCost, Integer> {
   @Query("SELECT t FROM TicketCost t WHERE t.ticketId=:ticketId ORDER BY t.id DESC")
   List <TicketCost> findByTicketId(@Param("ticketId")Integer ticketId);
}