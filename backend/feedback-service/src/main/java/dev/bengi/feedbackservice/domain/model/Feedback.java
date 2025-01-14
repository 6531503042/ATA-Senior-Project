package dev.bengi.feedbackservice.domain.model;

import dev.bengi.feedbackservice.domain.enums.PrivacyLevel;
import dev.bengi.feedbackservice.domain.enums.QuestionCategory;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.Map;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Getter
@Setter
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
    private String additionalComments;

    @Enumerated(EnumType.STRING)
    private QuestionCategory category;

    @Enumerated(EnumType.STRING)
    private PrivacyLevel privacyLevel;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id")
    private Question question;

    @ManyToOne
    @JoinColumn(name = "question_set_id")
    private QuestionSet questionSet;

    @ElementCollection
    @CollectionTable(name = "feedback_answers",
            joinColumns = @JoinColumn(name = "feedback_id"))
    @MapKeyColumn(name = "question_id")
    @Column(name = "answer")
    private Map<Long, String> answers;

    private Instant submittedAt;

    public void addAnswer(Answer answer) {
        answers.put(answer.getQuestion().getId(), String.valueOf(answer.getValue()));

        if (this.question == null) {
            this.question = answer.getQuestion();
        }
    }

    public void removeAnswer(Answer answer) {
        answers.remove(answer.getQuestion().getId());
    }


}
