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
import java.util.Objects;
import java.util.Optional;

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

    @GetMapping("/{officerId}")
    public ResponseEntity<?> getOfficerById(@PathVariable Long officerId) {
        Optional<Officer> officerOpt = officerRepository.findById(officerId);
        if (officerOpt.isEmpty()) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Officer not found.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
        return ResponseEntity.ok(officerOpt.get());
    }

    @PostMapping
    public ResponseEntity<?> addOfficer(@RequestBody Officer officer) {
        Map<String, Object> response = new HashMap<>();

        if (officer.getNic() == null || officer.getNic().isBlank()) {
            response.put("success", false);
            response.put("message", "NIC is required.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        if (officer.getName() == null || officer.getName().isBlank()) {
            response.put("success", false);
            response.put("message", "Officer name is required.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        boolean nicExists = officerRepository.findAll().stream()
                .anyMatch(o -> o.getNic() != null && o.getNic().equalsIgnoreCase(officer.getNic()));

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

    // NEW: Update an existing officer (e.g. set/change grade, dateJoined, department)
    @PutMapping("/{officerId}")
    public ResponseEntity<?> updateOfficer(@PathVariable Long officerId, @RequestBody Officer updatedOfficer) {
        Map<String, Object> response = new HashMap<>();

        Optional<Officer> officerOpt = officerRepository.findById(officerId);
        if (officerOpt.isEmpty()) {
            response.put("success", false);
            response.put("message", "Officer with ID " + officerId + " does not exist.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        if (updatedOfficer.getNic() == null || updatedOfficer.getNic().isBlank()) {
            response.put("success", false);
            response.put("message", "NIC is required.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        if (updatedOfficer.getName() == null || updatedOfficer.getName().isBlank()) {
            response.put("success", false);
            response.put("message", "Officer name is required.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        // Check NIC uniqueness against OTHER officers (excluding this one)
        // Objects.equals(...) used throughout so a null NIC on either side never throws NPE.
        boolean nicClash = officerRepository.findAll().stream()
                .anyMatch(o -> !Objects.equals(o.getOfficerId(), officerId)
                        && o.getNic() != null
                        && o.getNic().equalsIgnoreCase(updatedOfficer.getNic()));
        if (nicClash) {
            response.put("success", false);
            response.put("message", "Another officer already uses this NIC.");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        }

        Officer officer = officerOpt.get();
        officer.setName(updatedOfficer.getName());
        officer.setNic(updatedOfficer.getNic());
        officer.setDepartment(updatedOfficer.getDepartment());
        officer.setGrade(updatedOfficer.getGrade());
        officer.setDateJoined(updatedOfficer.getDateJoined());

        officerRepository.save(officer);

        response.put("success", true);
        response.put("message", "Officer updated successfully.");
        return ResponseEntity.ok(response);
    }
}