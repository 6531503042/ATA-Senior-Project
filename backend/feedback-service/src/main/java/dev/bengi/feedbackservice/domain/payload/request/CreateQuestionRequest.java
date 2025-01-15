package dev.bengi.feedbackservice.domain.payload.request;

import dev.bengi.feedbackservice.domain.enums.AnswerType;
import dev.bengi.feedbackservice.domain.enums.QuestionCategory;
import dev.bengi.feedbackservice.domain.enums.QuestionType;
import dev.bengi.feedbackservice.domain.enums.SentimentType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateQuestionRequest {
    private String text;
    private String content;

    private QuestionType type;
    private QuestionCategory category;
    private AnswerType answerType;
    private List<String> answers;

}
