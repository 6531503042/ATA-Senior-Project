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

import java.util.ArrayList;
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
    @CollectionTable(name = "question_answers",
            joinColumns = @JoinColumn(name = "question_id"))
    private List<String> answers = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    private QuestionType type;

    @Enumerated(EnumType.STRING)
    private QuestionCategory category;

    @Enumerated(EnumType.STRING)
    private AnswerType answerType;

    public void addAnswer(Answer answer) {
        if (answers == null) {
            answers = new ArrayList<>();
        }

        answers.add(String.valueOf(answer));
        answer.setQuestion(this);

    }

}
