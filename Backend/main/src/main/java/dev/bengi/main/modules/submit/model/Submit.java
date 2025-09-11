package dev.bengi.main.modules.submit.model;

import dev.bengi.main.modules.submit.enums.PrivacyLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.annotation.Transient;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table("submissions")
public class Submit {
    @Id
    private Long id;
    @Column("feedback_id")
    private Long feedbackId;
    @Column("user_id")
    private String userId;
    @Column("is_anonymous")
    private boolean anonymous;
    @Column("is_reviewed")
    private boolean reviewed;
    @Column("privacy_level")
    private PrivacyLevel privacyLevel;
    @Column("overall_comments")
    private String overallComments;
    @CreatedDate
    @Column("submitted_at")
    private LocalDateTime submittedAt;
    @LastModifiedDate
    @Column("updated_at")
    private LocalDateTime updatedAt;

    @Transient
    private Map<Long, String> responses = new HashMap<>();

    // Analysis fields
    @Column("admin_rating")
    private Double adminRating;
    
    @Column("admin_sentiment")
    private String adminSentiment;
    
    @Column("analysis_notes")
    private String analysisNotes;
    
    @Column("analyzed_at")
    private LocalDateTime analyzedAt;
    
    @Column("analyzed_by")
    private String analyzedBy;
}


