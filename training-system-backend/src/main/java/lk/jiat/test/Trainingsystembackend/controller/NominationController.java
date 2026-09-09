package lk.jiat.test.Trainingsystembackend.controller;

import lk.jiat.test.Trainingsystembackend.dto.NominationRequest;
import lk.jiat.test.Trainingsystembackend.Entity.Nomination;
import lk.jiat.test.Trainingsystembackend.Entity.Officer;
import lk.jiat.test.Trainingsystembackend.Entity.TrainingProgramme;
import lk.jiat.test.Trainingsystembackend.repository.NominationRepository;
import lk.jiat.test.Trainingsystembackend.repository.OfficerRepository;
import lk.jiat.test.Trainingsystembackend.repository.TrainingProgrammeRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/nominations")
@CrossOrigin(origins = "http://localhost:5173")
public class NominationController {

    @Autowired
    private NominationRepository nominationRepository;
    @Autowired
    private OfficerRepository officerRepository;
    @Autowired
    private TrainingProgrammeRepository programmeRepository;

    @PostMapping
    public ResponseEntity<?> addNomination(@RequestBody NominationRequest request) {
        Map<String, Object> response = new HashMap<>();

        // Step 1: Validate officer exists
        Optional<Officer> officerOpt = officerRepository.findById(request.getOfficerId());
        if (officerOpt.isEmpty()) {
            response.put("success", false);
            response.put("message", "Officer with ID " + request.getOfficerId() + " does not exist.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        // Step 2: Validate programme exists
        Optional<TrainingProgramme> programmeOpt = programmeRepository.findById(request.getProgrammeId());
        if (programmeOpt.isEmpty()) {
            response.put("success", false);
            response.put("message", "Training programme with ID " + request.getProgrammeId() + " does not exist.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        // Step 3: Check for existing nomination (duplicate check)
        Optional<Nomination> existing = nominationRepository
                .findByProgramme_ProgrammeIdAndOfficer_OfficerId(
                        request.getProgrammeId(), request.getOfficerId());

        if (existing.isPresent()) {
            response.put("success", false);
            response.put("message", "Duplicate nomination: This officer was already nominated for this programme by "
                    + existing.get().getNominatingDepartment() + ".");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        }

        // Step 4: Save
        Nomination nomination = new Nomination();
        nomination.setOfficer(officerOpt.get());
        nomination.setProgramme(programmeOpt.get());
        nomination.setNominatingDepartment(request.getNominatingDepartment());

        nominationRepository.save(nomination);

        response.put("success", true);
        response.put("message", "Nomination added successfully.");
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{programmeId}")
    public List<Nomination> getNominations(@PathVariable Long programmeId) {
        return nominationRepository.findByProgramme_ProgrammeId(programmeId);
    }
}