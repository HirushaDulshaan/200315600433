package lk.jiat.test.Trainingsystembackend.controller;

import lk.jiat.test.Trainingsystembackend.dto.NominationRequest;
import lk.jiat.test.Trainingsystembackend.Entity.Nomination;
import lk.jiat.test.Trainingsystembackend.Entity.NominationStatus;
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

        // Step 3: Check for duplicate nomination
        Optional<Nomination> existing = nominationRepository
                .findByProgramme_ProgrammeIdAndOfficer_OfficerId(
                        request.getProgrammeId(), request.getOfficerId());

        if (existing.isPresent()) {
            response.put("success", false);
            response.put("message", "Duplicate nomination: This officer was already nominated for this programme by "
                    + existing.get().getNominatingDepartment() + ".");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        }

        TrainingProgramme programme = programmeOpt.get();
        Officer officer = officerOpt.get();

        // Step 4: Check capacity - decide CONFIRMED or WAITING
        long confirmedCount = nominationRepository
                .countByProgramme_ProgrammeIdAndStatus(programme.getProgrammeId(), NominationStatus.CONFIRMED);

        Nomination nomination = new Nomination();
        nomination.setOfficer(officer);
        nomination.setProgramme(programme);
        nomination.setNominatingDepartment(request.getNominatingDepartment());

        if (confirmedCount < programme.getMaxParticipants()) {
            nomination.setStatus(NominationStatus.CONFIRMED);
        } else {
            nomination.setStatus(NominationStatus.WAITING);
        }

        nominationRepository.save(nomination);

        response.put("success", true);
        response.put("status", nomination.getStatus());
        if (nomination.getStatus() == NominationStatus.CONFIRMED) {
            response.put("message", "Nomination confirmed successfully.");
        } else {
            response.put("message", "Programme is full. Nomination added to the waiting list.");
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // Cancel a confirmed nomination -> auto-promote first waiting person
    @DeleteMapping("/{nominationId}")
    public ResponseEntity<?> cancelNomination(@PathVariable Long nominationId) {
        Map<String, Object> response = new HashMap<>();

        Optional<Nomination> nominationOpt = nominationRepository.findById(nominationId);
        if (nominationOpt.isEmpty()) {
            response.put("success", false);
            response.put("message", "Nomination not found.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        Nomination cancelled = nominationOpt.get();
        Long programmeId = cancelled.getProgramme().getProgrammeId();
        boolean wasConfirmed = cancelled.getStatus() == NominationStatus.CONFIRMED;

        nominationRepository.delete(cancelled);

        // If a CONFIRMED seat was freed, promote the earliest WAITING nomination
        if (wasConfirmed) {
            Optional<Nomination> nextInLine = nominationRepository
                    .findFirstByProgramme_ProgrammeIdAndStatusOrderByNominatedDateAsc(
                            programmeId, NominationStatus.WAITING);

            if (nextInLine.isPresent()) {
                Nomination promoted = nextInLine.get();
                promoted.setStatus(NominationStatus.CONFIRMED);
                nominationRepository.save(promoted);

                response.put("promoted", promoted.getOfficer().getName());
                response.put("message", "Nomination cancelled. " + promoted.getOfficer().getName()
                        + " has been promoted from the waiting list.");
            } else {
                response.put("message", "Nomination cancelled. No one on the waiting list to promote.");
            }
        } else {
            response.put("message", "Waiting-list nomination cancelled.");
        }

        response.put("success", true);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{programmeId}")
    public List<Nomination> getNominations(@PathVariable Long programmeId) {
        return nominationRepository.findByProgramme_ProgrammeId(programmeId);
    }
}