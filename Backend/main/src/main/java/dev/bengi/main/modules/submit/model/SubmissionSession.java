package dev.bengi.main.modules.submit.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table("submission_sessions")
public class SubmissionSession {
    @Id
    private Long id;

    @Column("feedback_id")
    private Long feedbackId;

    @Column("submission_id")
    private Long submissionId;

    @Column("user_id")
    private String userId;

    @Column("started_at")
    private LocalDateTime startedAt;

    @Column("ended_at")
    private LocalDateTime endedAt;

    @Column("duration_seconds")
    private Long durationSeconds;

    @Column("created_at")
    private LocalDateTime createdAt;

    @Column("updated_at")
    private LocalDateTime updatedAt;
}


