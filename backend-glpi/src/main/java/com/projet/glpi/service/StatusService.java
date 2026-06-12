package com.projet.glpi.service;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.projet.glpi.dto.StatusTraduction;
import com.projet.glpi.dto.TraductionReceive;
import com.projet.glpi.model.Langue;
import com.projet.glpi.model.Status;
import com.projet.glpi.model.StatusLangue;
import com.projet.glpi.repository.LangueRepository;
import com.projet.glpi.repository.StatusLangueRepository;
import com.projet.glpi.repository.StatusRepository;

import java.util.stream.Collectors;

@Service
public class StatusService {
    private final StatusRepository statusRepository;
    private final StatusLangueRepository statusLangueRepository;
    private final LangueRepository langueRepository;

    public StatusService(StatusRepository statusRepository, StatusLangueRepository statusLangueRepository,
            LangueRepository langueRepository) {
        this.statusRepository = statusRepository;
        this.statusLangueRepository = statusLangueRepository;
        this.langueRepository = langueRepository;
    }

    public List<Status> getAll() {
        return statusRepository.findAll();
    }

    public Status getByValue(Integer value) {
        return statusRepository.findByValue(value);
    }

    public Status save(Status status) {
        return statusRepository.save(status);
    }

    public void deleteStatus(Integer id) {
        statusRepository.deleteById(id);
    }

    public List<TraductionReceive> getAllTraductionByValue(Integer value) {

        Status status = statusRepository.findByValue(value);

        if (status == null) {
            return List.of();
        }

        return statusLangueRepository.findByStatusId(status.getId())
                .stream()
                .map(sl -> new TraductionReceive(
                        sl.getLangue().getId(),
                        sl.getTraduction()))
                .toList();
    }

    public void updateTraductions(Integer value, String color, List<TraductionReceive> traductions) {
        Status status = statusRepository.findByValue(value);
        status.setColor(color);
        statusRepository.save(status);
        traductions.forEach((traduction) -> {
            StatusLangue existing = statusLangueRepository.findByStatusIdAndLangueId(status.getId(), traduction.langue);
            if (existing != null) {
                existing.setTraduction(traduction.traduction);
                statusLangueRepository.save(existing);
            } else {
                statusLangueRepository.save(new StatusLangue(null, status,
                        langueRepository.findById(traduction.langue).orElse(null), traduction.traduction));
            }
        });
    }

    public void deleteTraductions(Integer value) {
        Status status = statusRepository.findByValue(value);
        List<StatusLangue> existingTraductions = statusLangueRepository.findByStatusId(status.getId());
        statusLangueRepository.deleteAll(existingTraductions);
        status.setColor(null);
        statusRepository.save(status);
    }


    public Map<Integer, String> getAllTraductionsByLangue(Integer langue) {
        List<StatusLangue> statusLangues = statusLangueRepository.findByLangueId(langue);
        return statusLangues.stream()
                .collect(Collectors.toMap(
                        sl -> sl.getStatus().getValue(),
                        StatusLangue::getTraduction
                ));
    }
}
