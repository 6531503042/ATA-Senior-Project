package dev.bengi.feedbackservice.domain.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
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

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "project_id")
    private List<Question> questions = new ArrayList<>();

    private String name;
    private String description;
    private Integer totalEmployees;

    private ZonedDateTime feedbackStartDate;
    private ZonedDateTime feedbackEndDate;
    private ZonedDateTime createdAt;
    private ZonedDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        feedbackStartDate = ZonedDateTime.now(ZoneId.of("Asia/Bangkok")); // Bangkok timezone
        feedbackEndDate = ZonedDateTime.now(ZoneId.of("Asia/Bangkok"));
        createdAt = ZonedDateTime.now(ZoneId.of("Asia/Bangkok")); // Bangkok timezone
        updatedAt = ZonedDateTime.now(ZoneId.of("Asia/Bangkok"));
    }
}
