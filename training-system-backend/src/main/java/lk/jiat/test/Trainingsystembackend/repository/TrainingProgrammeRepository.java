package lk.jiat.test.Trainingsystembackend.repository;

import lk.jiat.test.Trainingsystembackend.Entity.TrainingProgramme;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TrainingProgrammeRepository extends JpaRepository<TrainingProgramme, Long> {
}