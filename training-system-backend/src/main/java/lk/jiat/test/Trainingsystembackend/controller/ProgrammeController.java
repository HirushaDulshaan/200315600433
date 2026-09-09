package lk.jiat.test.Trainingsystembackend.controller;

import lk.jiat.test.Trainingsystembackend.Entity.TrainingProgramme;
import lk.jiat.test.Trainingsystembackend.repository.TrainingProgrammeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/programmes")
@CrossOrigin(origins = "http://localhost:5173")
public class ProgrammeController {

    @Autowired
    private TrainingProgrammeRepository programmeRepository;

    @GetMapping
    public List<TrainingProgramme> getAllProgrammes() {
        return programmeRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> addProgramme(@RequestBody TrainingProgramme programme) {
        Map<String, Object> response = new HashMap<>();

        if (programme.getTitle() == null || programme.getTitle().isBlank()) {
            response.put("success", false);
            response.put("message", "Programme title is required.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        if (programme.getMaxParticipants() == null || programme.getMaxParticipants() <= 0) {
            response.put("success", false);
            response.put("message", "Max participants must be a positive number.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        programmeRepository.save(programme);

        response.put("success", true);
        response.put("message", "Training programme added successfully.");
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}