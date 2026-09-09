package lk.jiat.test.Trainingsystembackend.service;

import lk.jiat.test.Trainingsystembackend.Entity.*;
import lk.jiat.test.Trainingsystembackend.repository.EligibilityRuleRepository;
import lk.jiat.test.Trainingsystembackend.repository.NominationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Period;
import java.util.Arrays;
import java.util.List;

@Service
public class EligibilityService {

    @Autowired
    private EligibilityRuleRepository eligibilityRuleRepository;

    @Autowired
    private NominationRepository nominationRepository;

    public static class EligibilityResult {
        public final boolean eligible;
        public final String reason;
        public EligibilityResult(boolean eligible, String reason) {
            this.eligible = eligible;
            this.reason = reason;
        }
    }

    public EligibilityResult checkEligibility(Officer officer, TrainingProgramme programme) {

        // 1. Data-driven rules attached to this programme
        List<EligibilityRule> rules = eligibilityRuleRepository.findByProgramme_ProgrammeId(programme.getProgrammeId());

        for (EligibilityRule rule : rules) {
            switch (rule.getRuleType()) {

                case DEPARTMENT -> {
                    List<String> allowedDepartments = Arrays.asList(rule.getRuleValue().split("\\s*,\\s*"));
                    if (officer.getDepartment() == null || !allowedDepartments.contains(officer.getDepartment())) {
                        return new EligibilityResult(false,
                                "Officer's department (" + officer.getDepartment() + ") is not eligible for this programme. Allowed: " + rule.getRuleValue());
                    }
                }

                case GRADE -> {
                    List<String> allowedGrades = Arrays.asList(rule.getRuleValue().split("\\s*,\\s*"));
                    if (officer.getGrade() == null || !allowedGrades.contains(officer.getGrade())) {
                        return new EligibilityResult(false,
                                "Officer's grade (" + officer.getGrade() + ") does not meet the requirement. Allowed: " + rule.getRuleValue());
                    }
                }

                case MIN_YEARS_SERVICE -> {
                    if (officer.getDateJoined() == null) {
                        return new EligibilityResult(false, "Officer's date of joining is not recorded, cannot verify years of service.");
                    }
                    int requiredYears = Integer.parseInt(rule.getRuleValue().trim());
                    int actualYears = Period.between(officer.getDateJoined(), LocalDate.now()).getYears();
                    if (actualYears < requiredYears) {
                        return new EligibilityResult(false,
                                "Officer needs at least " + requiredYears + " years of service (has " + actualYears + ").");
                    }
                }
            }
        }

        // 2. Built-in rule: no repeat within 12 months of the same programme title
        List<Nomination> pastConfirmed = nominationRepository
                .findByOfficer_OfficerIdAndStatusAndProgramme_Title(
                        officer.getOfficerId(), NominationStatus.CONFIRMED, programme.getTitle());

        LocalDate newDate = programme.getTrainingDate();
        for (Nomination past : pastConfirmed) {
            LocalDate pastDate = past.getProgramme().getTrainingDate();
            if (pastDate != null && newDate != null) {
                long monthsBetween = Period.between(pastDate, newDate).toTotalMonths();
                if (Math.abs(monthsBetween) < 12) {
                    return new EligibilityResult(false,
                            "Officer already participated in \"" + programme.getTitle() + "\" within the last 12 months (" + pastDate + ").");
                }
            }
        }

        return new EligibilityResult(true, "Eligible.");
    }
}