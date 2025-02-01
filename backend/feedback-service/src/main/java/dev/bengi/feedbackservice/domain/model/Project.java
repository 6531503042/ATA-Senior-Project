package dev.bengi.feedbackservice.domain.model;

import com.fasterxml.jackson.annotation.JsonFormat;
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
@Builder(toBuilder = true)
@Entity
@Table(name = "projects")
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)  // Auto-increment ID
    private Long id;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "project_id")
    @Builder.Default
    private List<Question> questions = new ArrayList<>();

    private String name;
    private String description;
    
    @ElementCollection
    private List<Long> memberIds; // Store user IDs instead of User objects

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ssXXX", timezone = "Asia/Bangkok")
    private ZonedDateTime projectStartDate;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ssXXX", timezone = "Asia/Bangkok")
    private ZonedDateTime projectEndDate;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ssXXX", timezone = "Asia/Bangkok")
    private ZonedDateTime createdAt;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ssXXX", timezone = "Asia/Bangkok")
    private ZonedDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        projectStartDate = ZonedDateTime.now(ZoneId.of("Asia/Bangkok"));
        projectEndDate = ZonedDateTime.now(ZoneId.of("Asia/Bangkok"));
        createdAt = ZonedDateTime.now(ZoneId.of("Asia/Bangkok"));
        updatedAt = ZonedDateTime.now(ZoneId.of("Asia/Bangkok"));
    }
}
