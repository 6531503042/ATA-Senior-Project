package dev.bengi.feedbackservice.domain.model;

import dev.bengi.feedbackservice.domain.enums.QuestionCategory;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.Map;

@Data
@Entity
@Table(name = "feedback_scores")
public class FeedbackScore {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "submission_id", nullable = false)
    private FeedbackSubmission submission;

    @ElementCollection
    @CollectionTable(name = "question_scores", 
        joinColumns = @JoinColumn(name = "score_id"))
    @MapKeyColumn(name = "question_id")
    @Column(name = "score")
    private Map<Long, Double> questionScores;

    @ElementCollection
    @CollectionTable(name = "category_scores",
        joinColumns = @JoinColumn(name = "score_id"))
    @MapKeyColumn(name = "category")
    @Column(name = "score")
    @MapKeyEnumerated(EnumType.STRING)
    private Map<QuestionCategory, Double> categoryScores;

    @ElementCollection
    @CollectionTable(name = "sentiment_scores",
        joinColumns = @JoinColumn(name = "score_id"))
    @MapKeyColumn(name = "question_id")
    @Column(name = "sentiment_score")
    private Map<Long, Double> sentimentScores;

    @Column(name = "satisfaction_score")
    private Double satisfactionScore;

    @Column(name = "priority_score")
    private Double priorityScore;

    @Column(name = "total_score")
    private Double totalScore;

    @Column(name = "admin_comments")
    private String adminComments;

    @Column(name = "scored_by")
    private String scoredBy;

    @Column(name = "scored_at")
    private LocalDateTime scoredAt;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        scoredAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
        scoredAt = LocalDateTime.now();
    }
} 