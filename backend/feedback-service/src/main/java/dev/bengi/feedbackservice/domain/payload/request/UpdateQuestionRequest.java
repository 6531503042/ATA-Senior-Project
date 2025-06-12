package dev.bengi.feedbackservice.domain.payload.request;

import dev.bengi.feedbackservice.domain.enums.QuestionCategory;
import dev.bengi.feedbackservice.domain.enums.QuestionType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateQuestionRequest {
    private String text;
    private String description;
    private QuestionType questionType;
    private QuestionCategory category;
    private List<String> choices;
    private Boolean required;
    private String validationRules;
} 