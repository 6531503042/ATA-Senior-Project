package dev.bengi.feedbackservice.domain.model;

import dev.bengi.feedbackservice.domain.enums.AnswerType;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Builder
@Getter
@Setter
@Table(name = "answers")
public class Answer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String text;
    private String value;
    private AnswerType type;

    @ElementCollection
    private List<AnswerOption> answers; // This stores multiple-choice options

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id")
    private Question question;  // The reference to the parent Question
}