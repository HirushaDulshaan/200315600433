package lk.jiat.test.Trainingsystembackend.Entity;


import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "nominations", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"programme_id", "officer_id"})
})
public class Nomination {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long nominationId;

    @ManyToOne
    @JoinColumn(name = "programme_id")
    private TrainingProgramme programme;

    @ManyToOne
    @JoinColumn(name = "officer_id")
    private Officer officer;

    private String nominatingDepartment;

    @Column(updatable = false)
    private LocalDateTime nominatedDate = LocalDateTime.now();

    // getters and setters
}
