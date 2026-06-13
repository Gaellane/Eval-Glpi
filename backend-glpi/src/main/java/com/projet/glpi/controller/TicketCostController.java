package com.projet.glpi.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.projet.glpi.model.Langue;
import com.projet.glpi.model.Status;
import com.projet.glpi.model.TicketCost;
import com.projet.glpi.repository.TicketCostRepository;
import com.projet.glpi.service.LangueService;
import com.projet.glpi.service.StatusService;
import com.projet.glpi.service.TicketCostService;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

@RestController
@RequestMapping("/api/ticketcosts")

public class TicketCostController {
    
    private final TicketCostService ticketCostService;
    private final TicketCostRepository ticketCostRepository;

    public TicketCostController(TicketCostService ticketCostService , TicketCostRepository ticketCostRepository) {
        this.ticketCostService = ticketCostService;
        this.ticketCostRepository=ticketCostRepository;
    }

    @GetMapping("/{ticketId}")
    public ResponseEntity<Double> getByTicketId(@PathVariable Integer ticketId) {
        Double langues = ticketCostService.getByTicketId(ticketId);
        return ResponseEntity.ok(langues);
    }

    @GetMapping("/ouverture/{ticketId}")
    public ResponseEntity<Double> getOuverture(@PathVariable Integer ticketId) {
        Double langues = ticketCostService.getOuverture(ticketId);
        return ResponseEntity.ok(langues);
    }

    @PostMapping
    public ResponseEntity<Map<String,Object>> saveTicketCost(@RequestBody Map<String,Object> body) {
        TicketCost cost = new TicketCost();
        cost.setTicketId((Integer)body.get("ticketId"));
        if(body.get("superCost")!=null)
            cost.setSuperCost(Double.parseDouble((String)body.get("superCost")));
        if(body.get("ouverture")!=null)
            cost.setOuverture(Double.parseDouble((String)body.get("ouverture")));
        TicketCost t = ticketCostService.saveTickeCost(cost);
        
        return ResponseEntity.ok(Map.of(
                "success", true));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String , Object>> deleteTicket(@PathVariable Integer id) {
        ticketCostService.deleteTicketCost(id);
        return ResponseEntity.ok(Map.of(
                "success", true));
    }

    @DeleteMapping
    public ResponseEntity<Map<String , Object>> deleteAll() {
        ticketCostRepository.deleteAllInBatch();
        return ResponseEntity.ok(Map.of(
                "success", true));
    }
    
}
