package dev.bengi.feedbackservice.domain.model;

import dev.bengi.feedbackservice.domain.enums.AnswerType;
import dev.bengi.feedbackservice.domain.enums.QuestionCategory;
import dev.bengi.feedbackservice.domain.enums.QuestionType;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.ZonedDateTime;
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
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String text;
    private String content;
    private boolean required;
    private ZonedDateTime createdAt;
    private ZonedDateTime updatedAt;

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @Builder.Default
    @JsonManagedReference
    private List<Answer> answers = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_set_id")
    @JsonBackReference
    private QuestionSet questionSet;

    @Enumerated(EnumType.STRING)
    private QuestionType type;

    @Enumerated(EnumType.STRING)
    private QuestionCategory category;

    @Enumerated(EnumType.STRING)
    private AnswerType answerType;
}