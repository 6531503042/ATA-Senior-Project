package dev.bengi.feedbackservice.domain.model;

import dev.bengi.feedbackservice.domain.enums.PrivacyLevel;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.Map;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "feedbacks")
public class Feedback {
    @Id
    private Long id;

    @Column(name = "project_id")
    private Long projectId;

    @Column(name = "user_id")
    private Long userId;

    private String title;
    private String description;
    private String category;

    @Enumerated(EnumType.STRING)
    private PrivacyLevel privacyLevel;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "question_id")
    private Question question;

    @ElementCollection
    @CollectionTable(name = "feedback_answers",
            joinColumns = @JoinColumn(name = "feedback_id"))
    @MapKeyColumn(name = "question_id")
    @Column(name = "answer")
    private Map<Long, String> answers;

    private Instant submittedAt;



}
