package dev.bengi.feedbackservice.domain.payload.response;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

import dev.bengi.feedbackservice.domain.enums.AnswerType;
import dev.bengi.feedbackservice.domain.enums.QuestionCategory;
import dev.bengi.feedbackservice.domain.enums.QuestionType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuestionResponse {

    private Long id;
    private String text;
    private String content;
    private boolean required;
    private QuestionType type;
    private QuestionCategory category;
    private AnswerType answerType;
    @Builder.Default
    private List<AnswerOptionResponse> answers = new ArrayList<>();
    private ZonedDateTime createdAt;
    private ZonedDateTime updatedAt;
    private String description;
    private String validationRules;
}
