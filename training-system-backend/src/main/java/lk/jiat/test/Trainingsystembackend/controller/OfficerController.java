package lk.jiat.test.Trainingsystembackend.controller;

import lk.jiat.test.Trainingsystembackend.Entity.Officer;
import lk.jiat.test.Trainingsystembackend.repository.OfficerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/officers")
@CrossOrigin(origins = "http://localhost:5173")
public class OfficerController {

    @Autowired
    private OfficerRepository officerRepository;

    @GetMapping
    public List<Officer> getAllOfficers() {
        return officerRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> addOfficer(@RequestBody Officer officer) {
        Map<String, Object> response = new HashMap<>();

        // Check NIC duplicate
        boolean nicExists = officerRepository.findAll().stream()
                .anyMatch(o -> o.getNic().equalsIgnoreCase(officer.getNic()));

        if (nicExists) {
            response.put("success", false);
            response.put("message", "An officer with this NIC already exists.");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        }

        officerRepository.save(officer);

        response.put("success", true);
        response.put("message", "Officer added successfully.");
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}