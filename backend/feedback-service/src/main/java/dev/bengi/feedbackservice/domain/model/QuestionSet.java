package dev.bengi.feedbackservice.domain.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
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
    private List<String> answers = new ArrayList<>();

    @OneToMany(mappedBy = "questionSet", cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "question_set_id")
    private List<Question> questions;


    public void addQuestion(Question question) {
        questions.add(question);
    }
}
