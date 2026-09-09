package lk.jiat.test.Trainingsystembackend.controller;

import lk.jiat.test.Trainingsystembackend.Entity.TrainingProgramme;
import lk.jiat.test.Trainingsystembackend.repository.TrainingProgrammeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
}