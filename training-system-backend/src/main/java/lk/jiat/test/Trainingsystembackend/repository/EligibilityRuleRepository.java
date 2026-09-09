package lk.jiat.test.Trainingsystembackend.repository;

import lk.jiat.test.Trainingsystembackend.Entity.EligibilityRule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EligibilityRuleRepository extends JpaRepository<EligibilityRule, Long> {
    List<EligibilityRule> findByProgramme_ProgrammeId(Long programmeId);
}