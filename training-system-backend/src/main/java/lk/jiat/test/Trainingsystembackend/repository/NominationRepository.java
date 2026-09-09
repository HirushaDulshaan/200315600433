package lk.jiat.test.Trainingsystembackend.repository;

import lk.jiat.test.Trainingsystembackend.Entity.Nomination;
import lk.jiat.test.Trainingsystembackend.Entity.NominationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface NominationRepository extends JpaRepository<Nomination, Long> {

    Optional<Nomination> findByProgramme_ProgrammeIdAndOfficer_OfficerId(Long programmeId, Long officerId);

    List<Nomination> findByProgramme_ProgrammeId(Long programmeId);

    // Count how many are already CONFIRMED for a programme
    long countByProgramme_ProgrammeIdAndStatus(Long programmeId, NominationStatus status);

    // Get the earliest WAITING nomination for a programme (FCFS order)
    Optional<Nomination> findFirstByProgramme_ProgrammeIdAndStatusOrderByNominatedDateAsc(
            Long programmeId, NominationStatus status);

    List<Nomination> findByProgramme_ProgrammeIdAndStatusOrderByNominatedDateAsc(
            Long programmeId, NominationStatus status);

    // existing file එකට මේ method එක add කරන්න
    List<Nomination> findByOfficer_OfficerIdAndStatusAndProgramme_Title(
            Long officerId, NominationStatus status, String title);

}