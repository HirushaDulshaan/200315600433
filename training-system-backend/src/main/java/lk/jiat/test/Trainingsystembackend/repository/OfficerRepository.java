package lk.jiat.test.Trainingsystembackend.repository;

import lk.jiat.test.Trainingsystembackend.Entity.Officer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OfficerRepository extends JpaRepository<Officer, Long> {
}