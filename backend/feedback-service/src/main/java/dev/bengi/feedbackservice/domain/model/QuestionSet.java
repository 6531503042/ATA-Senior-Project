package dev.bengi.feedbackservice.domain.model;

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
@Table(name = "question_sets")
public class QuestionSet {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private ZonedDateTime createdAt;
    private ZonedDateTime updatedAt;

    @OneToMany(mappedBy = "questionSet", cascade = CascadeType.ALL)
    @Builder.Default
    @JsonManagedReference
    private List<Question> questions = new ArrayList<>();

    public void addQuestion(Question question) {
        questions.add(question);
        question.setQuestionSet(this);
    }
}