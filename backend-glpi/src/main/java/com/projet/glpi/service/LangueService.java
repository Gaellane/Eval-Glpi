package com.projet.glpi.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.projet.glpi.model.Langue;
import com.projet.glpi.repository.LangueRepository;

@Service
public class LangueService {
    private final LangueRepository langueRepository;

    public LangueService(LangueRepository langueRepository) {
        this.langueRepository = langueRepository;
    }

    public List<Langue> getAll() {
        return langueRepository.findAll();
    }

    
}
