package dev.bengi.feedbackservice.domain.model;

import jakarta.persistence.*;
import lombok.*;

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

    @OneToMany(mappedBy = "questionSet", cascade = CascadeType.ALL)
    private List<Question> questions;
}
