package dev.bengi.feedbackservice.domain.payload.response;

import dev.bengi.feedbackservice.domain.enums.QuestionCategory;
import dev.bengi.feedbackservice.domain.enums.QuestionType;
import dev.bengi.feedbackservice.domain.enums.SentimentType;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class QuestionResponse {

    private Long id;
    private String text;
    private String content;
    private QuestionType type;
    private QuestionCategory category;
    private SentimentType sentimentType;
    private Long projectId;
}
