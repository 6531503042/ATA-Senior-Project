package dev.bengi.feedbackservice.domain.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@Entity
@Table(name = "projects")
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id")
    @Builder.Default
    private List<Question> questions = new ArrayList<>();

    @Column(unique = true)
    private String name;
    private String description;
    
    @ElementCollection
    @CollectionTable(name = "project_member_ids",
            joinColumns = @JoinColumn(name = "project_id"))
    @Column(name = "member_ids")
    @Builder.Default
    private List<Long> memberIds = new ArrayList<>();

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ssXXX", timezone = "Asia/Bangkok")
    @Column(name = "project_start_date")
    private ZonedDateTime projectStartDate;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ssXXX", timezone = "Asia/Bangkok")
    @Column(name = "project_end_date")
    private ZonedDateTime projectEndDate;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ssXXX", timezone = "Asia/Bangkok")
    @Column(name = "created_at")
    private ZonedDateTime createdAt;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ssXXX", timezone = "Asia/Bangkok")
    @Column(name = "updated_at")
    private ZonedDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        projectStartDate = ZonedDateTime.now(ZoneId.of("Asia/Bangkok"));
        projectEndDate = ZonedDateTime.now(ZoneId.of("Asia/Bangkok"));
        createdAt = ZonedDateTime.now(ZoneId.of("Asia/Bangkok"));
        updatedAt = ZonedDateTime.now(ZoneId.of("Asia/Bangkok"));
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = ZonedDateTime.now(ZoneId.of("Asia/Bangkok"));
    }
}
