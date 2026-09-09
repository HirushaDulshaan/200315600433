package lk.jiat.test.Trainingsystembackend.Entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "nominations", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"programme_id", "officer_id"})
})
public class Nomination {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long nominationId;

    @ManyToOne
    @JoinColumn(name = "programme_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private TrainingProgramme programme;

    @ManyToOne
    @JoinColumn(name = "officer_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Officer officer;

    private String nominatingDepartment;

    @Enumerated(EnumType.STRING)
    private NominationStatus status; // CONFIRMED or WAITING

    @Column(updatable = false)
    private LocalDateTime nominatedDate = LocalDateTime.now();

    // Getters and setters
    public Long getNominationId() { return nominationId; }
    public void setNominationId(Long nominationId) { this.nominationId = nominationId; }

    public TrainingProgramme getProgramme() { return programme; }
    public void setProgramme(TrainingProgramme programme) { this.programme = programme; }

    public Officer getOfficer() { return officer; }
    public void setOfficer(Officer officer) { this.officer = officer; }

    public String getNominatingDepartment() { return nominatingDepartment; }
    public void setNominatingDepartment(String nominatingDepartment) { this.nominatingDepartment = nominatingDepartment; }

    public NominationStatus getStatus() { return status; }
    public void setStatus(NominationStatus status) { this.status = status; }

    public LocalDateTime getNominatedDate() { return nominatedDate; }
    public void setNominatedDate(LocalDateTime nominatedDate) { this.nominatedDate = nominatedDate; }
}