package lk.jiat.test.Trainingsystembackend.controller;

import lk.jiat.test.Trainingsystembackend.Entity.EligibilityRule;
import lk.jiat.test.Trainingsystembackend.Entity.EligibilityRuleType;
import lk.jiat.test.Trainingsystembackend.Entity.TrainingProgramme;
import lk.jiat.test.Trainingsystembackend.dto.EligibilityRuleRequest;
import lk.jiat.test.Trainingsystembackend.repository.EligibilityRuleRepository;
import lk.jiat.test.Trainingsystembackend.repository.TrainingProgrammeRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/eligibility-rules")
@CrossOrigin(origins = "http://localhost:5173")
public class EligibilityRuleController {

    @Autowired
    private EligibilityRuleRepository eligibilityRuleRepository;

    @Autowired
    private TrainingProgrammeRepository programmeRepository;

    // Get all rules for a specific programme
    @GetMapping("/{programmeId}")
    public List<EligibilityRule> getRulesForProgramme(@PathVariable Long programmeId) {
        return eligibilityRuleRepository.findByProgramme_ProgrammeId(programmeId);
    }

    // Get all rules (all programmes) - useful for an admin overview page
    @GetMapping
    public List<EligibilityRule> getAllRules() {
        return eligibilityRuleRepository.findAll();
    }

    // Add a new rule
    @PostMapping
    public ResponseEntity<?> addRule(@RequestBody EligibilityRuleRequest request) {
        Map<String, Object> response = new HashMap<>();

        if (request.getProgrammeId() == null) {
            response.put("success", false);
            response.put("message", "Programme ID is required.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        Optional<TrainingProgramme> programmeOpt = programmeRepository.findById(request.getProgrammeId());
        if (programmeOpt.isEmpty()) {
            response.put("success", false);
            response.put("message", "Training programme with ID " + request.getProgrammeId() + " does not exist.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        EligibilityRuleType ruleType;
        try {
            ruleType = EligibilityRuleType.valueOf(request.getRuleType());
        } catch (IllegalArgumentException | NullPointerException e) {
            response.put("success", false);
            response.put("message", "Invalid rule type. Must be one of: DEPARTMENT, MIN_YEARS_SERVICE, GRADE.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        if (request.getRuleValue() == null || request.getRuleValue().isBlank()) {
            response.put("success", false);
            response.put("message", "Rule value is required.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        String trimmedValue = request.getRuleValue().trim();

        // --- Type-specific validation so bad data can never reach EligibilityService ---
        switch (ruleType) {

            case MIN_YEARS_SERVICE -> {
                try {
                    int years = Integer.parseInt(trimmedValue);
                    if (years < 0) {
                        response.put("success", false);
                        response.put("message", "MIN_YEARS_SERVICE must be zero or a positive whole number.");
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
                    }
                } catch (NumberFormatException e) {
                    response.put("success", false);
                    response.put("message", "MIN_YEARS_SERVICE value must be a whole number, e.g. \"3\".");
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
                }
            }

            case DEPARTMENT, GRADE -> {
                List<String> values = Arrays.stream(trimmedValue.split(","))
                        .map(String::trim)
                        .filter(v -> !v.isEmpty())
                        .toList();
                if (values.isEmpty()) {
                    response.put("success", false);
                    response.put("message", ruleType + " value must contain at least one non-empty entry, comma-separated.");
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
                }
                // normalize back so we don't store stray commas/whitespace, e.g. "Finance,, Budget"
                trimmedValue = String.join(",", values);
            }
        }

        // trimmedValue may have been reassigned above (DEPARTMENT/GRADE normalization),
        // so copy it into a final variable before using it inside a lambda.
        final String finalRuleValue = trimmedValue;

        // Optional: prevent adding the exact same rule twice for a programme
        boolean duplicate = eligibilityRuleRepository.findByProgramme_ProgrammeId(request.getProgrammeId())
                .stream()
                .anyMatch(r -> r.getRuleType() == ruleType && r.getRuleValue().equalsIgnoreCase(finalRuleValue));
        if (duplicate) {
            response.put("success", false);
            response.put("message", "This exact rule already exists for the selected programme.");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        }

        EligibilityRule rule = new EligibilityRule();
        rule.setProgramme(programmeOpt.get());
        rule.setRuleType(ruleType);
        rule.setRuleValue(finalRuleValue);

        eligibilityRuleRepository.save(rule);

        response.put("success", true);
        response.put("message", "Eligibility rule added successfully.");
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // Delete a rule
    @DeleteMapping("/{ruleId}")
    public ResponseEntity<?> deleteRule(@PathVariable Long ruleId) {
        Map<String, Object> response = new HashMap<>();

        Optional<EligibilityRule> ruleOpt = eligibilityRuleRepository.findById(ruleId);
        if (ruleOpt.isEmpty()) {
            response.put("success", false);
            response.put("message", "Eligibility rule not found.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        eligibilityRuleRepository.delete(ruleOpt.get());

        response.put("success", true);
        response.put("message", "Eligibility rule removed successfully.");
        return ResponseEntity.ok(response);
    }
}