package lk.jiat.test.Trainingsystembackend.Entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "eligibility_rules")
public class EligibilityRule {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long ruleId;

    @ManyToOne
    @JoinColumn(name = "programme_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private TrainingProgramme programme;

    @Enumerated(EnumType.STRING)
    private EligibilityRuleType ruleType;

    // Comma-separated values, e.g. "Finance,Budget,Planning" or "3"
    private String ruleValue;

    public Long getRuleId() { return ruleId; }
    public void setRuleId(Long ruleId) { this.ruleId = ruleId; }

    public TrainingProgramme getProgramme() { return programme; }
    public void setProgramme(TrainingProgramme programme) { this.programme = programme; }

    public EligibilityRuleType getRuleType() { return ruleType; }
    public void setRuleType(EligibilityRuleType ruleType) { this.ruleType = ruleType; }

    public String getRuleValue() { return ruleValue; }
    public void setRuleValue(String ruleValue) { this.ruleValue = ruleValue; }
}