package dev.bengi.feedbackservice.domain.model;

import dev.bengi.feedbackservice.domain.enums.QuestionCategory;
import dev.bengi.feedbackservice.domain.enums.QuestionType;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.annotation.Transient;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
@Table("questions")
public class Question {
    @Id
    private Long id;

    @Column("text")
    private String text;  // This will store the title/question text

    @Column("description")
    private String description;

    @Column("question_type")
    private QuestionType questionType; // Changed from type to questionType to match service calls

    @Column("category")
    private QuestionCategory category;

    // Using @Transient since R2DBC doesn't support @ElementCollection
    @Transient
    @Builder.Default
    private List<String> choices = new ArrayList<>();

    @Column("required")
    @Builder.Default
    private boolean required = true;

    @Column("validation_rules")
    private String validationRules;

    @Column("created_at")
    @CreatedDate
    private LocalDateTime createdAt;

    @Column("updated_at")
    @LastModifiedDate
    private LocalDateTime updatedAt;
}