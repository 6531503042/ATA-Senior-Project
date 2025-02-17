package dev.bengi.feedbackservice.domain.model;

import dev.bengi.feedbackservice.domain.enums.PrivacyLevel;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "feedback_submissions")
public class FeedbackSubmission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "feedback_id", nullable = false)
    private Feedback feedback;

    @Column(name = "submitted_by", nullable = false)
    private String submittedBy;

    @ElementCollection
    @CollectionTable(name = "feedback_submission_responses",
            joinColumns = @JoinColumn(name = "submission_id"))
    @MapKeyColumn(name = "question_id")
    @Column(name = "response")
    private Map<Long, String> responses;

    @Column(name = "overall_comments", nullable = false, length = 1000)
    private String overallComments;

    @Enumerated(EnumType.STRING)
    @Column(name = "privacy_level", nullable = false)
    private PrivacyLevel privacyLevel;

    @Column(name = "submitted_at", nullable = false)
    private LocalDateTime submittedAt;

    @Column(name = "reviewed")
    private boolean reviewed;

    @Column(name = "scored")
    private boolean scored;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        submittedAt = LocalDateTime.now();
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
} 