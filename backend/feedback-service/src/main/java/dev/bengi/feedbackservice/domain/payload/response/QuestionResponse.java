package dev.bengi.feedbackservice.domain.payload.response;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

import dev.bengi.feedbackservice.domain.enums.QuestionCategory;
import dev.bengi.feedbackservice.domain.enums.QuestionType;
import dev.bengi.feedbackservice.domain.enums.SentimentType;
import dev.bengi.feedbackservice.domain.model.AnswerOption;
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
    private ZonedDateTime feedbackStartDate;
    private ZonedDateTime feedbackEndDate;
    private List<AnswerOption> answerOptions = new ArrayList<>();
    private List<Long> questionIds;
    private ZonedDateTime createdAt;
    private ZonedDateTime updatedAt;
}
