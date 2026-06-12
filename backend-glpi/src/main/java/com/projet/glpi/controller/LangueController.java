package com.projet.glpi.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.projet.glpi.model.Langue;
import com.projet.glpi.model.Status;
import com.projet.glpi.service.LangueService;
import com.projet.glpi.service.StatusService;

@RestController
@RequestMapping("/api/langues")

public class LangueController {
    
    private final LangueService langueService;

    public LangueController(LangueService langueService) {
        this.langueService = langueService;
    }

    @GetMapping
    public ResponseEntity<List<Langue>> getAll() {
        List<Langue> langues = langueService.getAll();
        return ResponseEntity.ok(langues);
    }

}
