package dev.bengi.feedbackservice.domain.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

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

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JoinColumn(name = "project_id")
    @Builder.Default
    private List<Question> questions = new ArrayList<>();

    @Column(unique = true)
    private String name;
    private String description;
    
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "project_members", 
        joinColumns = @JoinColumn(name = "project_id"))
    @Column(name = "member_id")
    @Builder.Default
    private Set<Long> memberIds = new HashSet<>();

    @Column(name = "project_start_date")
    private ZonedDateTime projectStartDate;

    @Column(name = "project_end_date")
    private ZonedDateTime projectEndDate;

    @Column(name = "created_at", updatable = false)
    private ZonedDateTime createdAt;

    @Column(name = "updated_at")
    private ZonedDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        if (projectStartDate == null) {
            projectStartDate = ZonedDateTime.now(ZoneId.of("Asia/Bangkok"));
        }
        if (projectEndDate == null) {
            projectEndDate = ZonedDateTime.now(ZoneId.of("Asia/Bangkok"));
        }
        createdAt = ZonedDateTime.now(ZoneId.of("Asia/Bangkok"));
        updatedAt = ZonedDateTime.now(ZoneId.of("Asia/Bangkok"));
        if (memberIds == null) {
            memberIds = new HashSet<>();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = ZonedDateTime.now(ZoneId.of("Asia/Bangkok"));
    }
}
