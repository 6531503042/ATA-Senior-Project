package dev.bengi.feedbackservice.domain.model;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.HashMap;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.annotation.Transient;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import dev.bengi.feedbackservice.domain.enums.PrivacyLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
@Table("feedback_submissions")
public class FeedbackSubmission {
    @Id
    private Long id;
    
    @Column("feedback_id")
    private Long feedbackId;
    
    @Column("user_id")
    private String userId;
    
    @Column("submitted_at")
    @CreatedDate
    private LocalDateTime submittedAt;
    
    @Column("updated_at")
    @LastModifiedDate
    private LocalDateTime updatedAt;
    
    @Column("is_anonymous")
    private boolean isAnonymous;
    
    @Column("is_reviewed")
    @Builder.Default
    private boolean isReviewed = false;
    
    @Column("privacy_level")
    private PrivacyLevel privacyLevel;
    
    @Column("overall_comments")
    private String overallComments;
    
    // Using @Transient since R2DBC doesn't support complex types
    @Transient
    @Builder.Default
    private Map<Long, String> responses = new HashMap<>();
    
    @Transient
    private Feedback feedback;
    
    public String getSubmittedBy() {
        return privacyLevel == PrivacyLevel.ANONYMOUS ? null : userId;
    }
} 