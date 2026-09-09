package lk.jiat.test.Trainingsystembackend.Entity;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Data

@Entity
@Table(name = "training_programmes")
public class TrainingProgramme {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long programmeId;
    private String title;
    private LocalDate trainingDate;
    private String venue;
    private String trainer;
    private Integer maxParticipants;
    // getters and setters
}
