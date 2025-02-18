package dev.bengi.feedbackservice.domain.model;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.HashSet;
import java.util.ArrayList;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "feedbacks")
public class Feedback {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, length = 1000)
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Project project;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "feedback_questions",
            joinColumns = @JoinColumn(name = "feedback_id"))
    @Column(name = "question_id")
    @Builder.Default
    private List<Long> questionIds = new ArrayList<>();

    @Column(name = "start_date", nullable = false)
    private LocalDateTime startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDateTime endDate;

    @Column(name = "created_by", nullable = false)
    private String createdBy;

    @Column(nullable = false)
    @Builder.Default
    private boolean active = true;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "allow_anonymous")
    @Builder.Default
    private boolean allowAnonymous = true;

    @ElementCollection
    @CollectionTable(name = "feedback_confidential_users",
            joinColumns = @JoinColumn(name = "feedback_id"))
    @Column(name = "user_id")
    @Builder.Default
    private Set<Long> confidentialUserIds = new HashSet<>();

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (questionIds == null) questionIds = new ArrayList<>();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    @Transient
    public Set<Long> getAllowedUserIds() {
        return project != null ? project.getMemberIds() : new HashSet<>();
    }
}
