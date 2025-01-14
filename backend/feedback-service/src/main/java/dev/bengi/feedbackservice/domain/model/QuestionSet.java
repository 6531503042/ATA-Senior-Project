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

    @Column(name = "project_id")
    private Long projectId;

    private String name;
    private String description;

    @ElementCollection
    @CollectionTable(name = "question_options",
            joinColumns = @JoinColumn(name = "question_set_id"))
    private List<String> options = new ArrayList<>();

    @OneToMany(mappedBy = "questionSet", cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "question_set_id")
    private List<Question> questions;


}
