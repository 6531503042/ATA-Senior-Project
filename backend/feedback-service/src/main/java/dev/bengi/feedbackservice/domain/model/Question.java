package dev.bengi.feedbackservice.domain.model;

import dev.bengi.feedbackservice.domain.enums.AnswerType;
import dev.bengi.feedbackservice.domain.enums.QuestionCategory;
import dev.bengi.feedbackservice.domain.enums.QuestionType;
import dev.bengi.feedbackservice.domain.enums.SentimentType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "questions")
public class Question {
    @Id
    private Long id;

    private String text;
    private String content;
    private boolean required;

    @ElementCollection
    @CollectionTable(name = "question_options",
            joinColumns = @JoinColumn(name = "question_id"))
    @Column(name = "option")
    private List<String> options;

    @Enumerated(EnumType.STRING)
    private SentimentType sentimentType;

    @Enumerated(EnumType.STRING)
    private QuestionType type;

    @Enumerated(EnumType.STRING)
    private QuestionCategory category;

    @Enumerated(EnumType.STRING)
    private AnswerType answerType;

}
