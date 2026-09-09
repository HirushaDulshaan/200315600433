package lk.jiat.test.Trainingsystembackend.controller;

import lk.jiat.test.Trainingsystembackend.Entity.Officer;
import lk.jiat.test.Trainingsystembackend.repository.OfficerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    @GetMapping("/departments")
    public List<String> getAllDepartments() {
        return officerRepository.findAll()
                .stream()
                .map(Officer::getDepartment)
                .distinct()
                .toList();
    }
}