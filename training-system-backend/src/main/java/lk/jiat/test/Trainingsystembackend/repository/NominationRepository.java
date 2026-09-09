package lk.jiat.test.Trainingsystembackend.repository;

import lk.jiat.test.Trainingsystembackend.Entity.Nomination;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface NominationRepository extends JpaRepository<Nomination, Long> {
    Optional<Nomination> findByProgramme_ProgrammeIdAndOfficer_OfficerId(Long programmeId, Long officerId);
    List<Nomination> findByProgramme_ProgrammeId(Long programmeId);
}