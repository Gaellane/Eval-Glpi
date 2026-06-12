package com.projet.glpi.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.projet.glpi.dto.StatusTraduction;
import com.projet.glpi.dto.TraductionReceive;
import com.projet.glpi.model.Status;
import com.projet.glpi.service.StatusService;

@RestController
@RequestMapping("/api/status")

public class StatusController {

    private final StatusService statusService;

    public StatusController(StatusService statusService) {
        this.statusService = statusService;
    }

    @GetMapping
    public ResponseEntity<List<Status>> getAll() {
        List<Status> statuses = statusService.getAll();
        return ResponseEntity.ok(statuses);
    }

    public ResponseEntity<Status> getStatusByValue(Integer value) {
        Status status = statusService.getByValue(value);
        if (status != null) {
            return ResponseEntity.ok(status);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/traductions/{value}")
    public ResponseEntity<List<TraductionReceive>> getAllTraductionsByValue(@PathVariable Integer value) {
        List<TraductionReceive> traductions = statusService.getAllTraductionByValue(value);
        return ResponseEntity.ok(traductions);
    }

    @PostMapping("/traductions/update/{value}")
    public ResponseEntity<Map<String, Object>> updateTraductions(
            @PathVariable Integer value,
            @RequestBody Map<String, Object> body) {

        String color = (String) body.get("color");

        List<Map<String, Object>> tradsRaw = (List<Map<String, Object>>) body.get("traductions");

        List<TraductionReceive> traductions = tradsRaw.stream()
                .map(t -> new TraductionReceive(
                        (Integer) t.get("langue"),
                        (String) t.get("traduction")))
                .toList();

        statusService.updateTraductions(value, color, traductions);

        return ResponseEntity.ok(Map.of(
                "success", true));
    }

    @DeleteMapping("/traductions/delete/{value}")
    public ResponseEntity<Map<String, Object>> deleteTraductions(@PathVariable Integer value) {
        statusService.deleteTraductions(value);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Traductions supprimées"));
    }

    @GetMapping("/{langueId}")
    public ResponseEntity<Map<Integer,String>> getAllTraductionsByLangue(@PathVariable Integer langueId) {
        Map<Integer , String> retour = statusService.getAllTraductionsByLangue(langueId);
        return ResponseEntity.ok(retour);
    }
}
