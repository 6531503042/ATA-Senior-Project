package dev.bengi.main.modules.question.model;

import dev.bengi.main.modules.question.enums.QuestionType;
import dev.bengi.main.modules.question.enums.QuestionCategory;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.annotation.Transient;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table("questions")
public class Question {
    @Id
    private Long id;
    private String text;
    private String description;
    @Column("question_type")
    private QuestionType questionType;
    private QuestionCategory category;
    private boolean required;
    @Column("validation_rules")
    private String validationRules;
    @CreatedDate
    @Column("created_at")
    private LocalDateTime createdAt;
    @LastModifiedDate
    @Column("updated_at")
    private LocalDateTime updatedAt;

    @Transient
    private List<String> choices = new ArrayList<>();
}


