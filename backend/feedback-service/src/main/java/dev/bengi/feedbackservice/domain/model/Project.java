package dev.bengi.feedbackservice.domain.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;
import java.time.Instant;
import java.util.ArrayList;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "projects")
public class Project {
    @Id
    private Long id;

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Question> questions = new ArrayList<>();

    private String name;
    private String description;
    private Integer totalEmployees;
    private Instant createdAt;
    private Instant updatedAt;
    private Instant feedbackStartDate;
    private Instant feedbackEndDate;
}
