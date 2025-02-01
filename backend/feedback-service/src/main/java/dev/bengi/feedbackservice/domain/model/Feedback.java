package dev.bengi.feedbackservice.domain.model;

import dev.bengi.feedbackservice.domain.enums.PrivacyLevel;
import dev.bengi.feedbackservice.domain.enums.QuestionCategory;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonFormat;

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

    @Column(name = "question_ids")
    private List<Long> questionIds;

    private String title;
    private String description;
    private String additionalComments;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ssXXX", timezone = "Asia/Bangkok")
    private ZonedDateTime feedbackStartDate;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ssXXX", timezone = "Asia/Bangkok")
    private ZonedDateTime feedbackEndDate;

    @Enumerated(EnumType.STRING)
    private QuestionCategory category;

    @Enumerated(EnumType.STRING)
    private PrivacyLevel privacyLevel;

    @ElementCollection
    @CollectionTable(name = "feedback_answers",
            joinColumns = @JoinColumn(name = "feedback_id"))
    @MapKeyColumn(name = "question_id")
    @Column(name = "answer")
    private Map<Long, String> answers;

    private ZonedDateTime submittedAt;

    @PrePersist
    protected void onCreate() {
        submittedAt = ZonedDateTime.now(ZoneId.of("Asia/Bangkok")); // Bangkok timezone
        feedbackStartDate = ZonedDateTime.now(ZoneId.of("Asia/Bangkok"));
        feedbackEndDate = ZonedDateTime.now(ZoneId.of("Asia/Bangkok"));
    }


    public void removeAnswer(Answer answer) {
        answers.remove(answer.getQuestion().getId());
    }


}
