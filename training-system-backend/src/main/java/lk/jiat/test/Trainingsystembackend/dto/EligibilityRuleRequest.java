package lk.jiat.test.Trainingsystembackend.dto;

public class EligibilityRuleRequest {

    private Long programmeId;
    private String ruleType;   // "DEPARTMENT", "MIN_YEARS_SERVICE", "GRADE"
    private String ruleValue;  // e.g. "Finance,Budget,Planning" or "3"

    public EligibilityRuleRequest() {
    }

    public Long getProgrammeId() { return programmeId; }
    public void setProgrammeId(Long programmeId) { this.programmeId = programmeId; }

    public String getRuleType() { return ruleType; }
    public void setRuleType(String ruleType) { this.ruleType = ruleType; }

    public String getRuleValue() { return ruleValue; }
    public void setRuleValue(String ruleValue) { this.ruleValue = ruleValue; }
}