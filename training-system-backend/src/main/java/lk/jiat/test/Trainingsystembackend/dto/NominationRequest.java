package lk.jiat.test.Trainingsystembackend.dto;

public class NominationRequest {

    private Long programmeId;
    private Long officerId;
    private String nominatingDepartment;

    // Default constructor (required for JSON deserialization)
    public NominationRequest() {
    }

    public NominationRequest(Long programmeId, Long officerId, String nominatingDepartment) {
        this.programmeId = programmeId;
        this.officerId = officerId;
        this.nominatingDepartment = nominatingDepartment;
    }

    public Long getProgrammeId() {
        return programmeId;
    }

    public void setProgrammeId(Long programmeId) {
        this.programmeId = programmeId;
    }

    public Long getOfficerId() {
        return officerId;
    }

    public void setOfficerId(Long officerId) {
        this.officerId = officerId;
    }

    public String getNominatingDepartment() {
        return nominatingDepartment;
    }

    public void setNominatingDepartment(String nominatingDepartment) {
        this.nominatingDepartment = nominatingDepartment;
    }
}