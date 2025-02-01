package dev.bengi.feedbackservice.domain.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "question_sets")
public class QuestionSet {
    @Id
    private Long id;

    private String name;
    private String description;

    @ElementCollection
    @CollectionTable(name = "question_set_answers",
            joinColumns = @JoinColumn(name = "question_set_id"))
    @MapKeyColumn(name = "question_id")
    @Column(name = "answer")
    @Builder.Default
    private List<String> answers = new ArrayList<>();

    @OneToMany(mappedBy = "questionSet", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Question> questions = new ArrayList<>();

    public void addQuestion(Question question) {
        questions.add(question);
    }
}