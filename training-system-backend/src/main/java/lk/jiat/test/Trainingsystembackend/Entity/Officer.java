package lk.jiat.test.Trainingsystembackend.Entity;

import jakarta.persistence.*;
import lombok.Data;

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
    // getters and setters
}