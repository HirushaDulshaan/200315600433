package lk.jiat.test.Trainingsystembackend.Entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "officers")
public class Officer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long officerId;
    private String name;
    private String nic;
    private String department;
    private String grade;          // e.g. "Junior", "Senior", "Assistant Director"
    private LocalDate dateJoined;  // used to calculate years of service
}