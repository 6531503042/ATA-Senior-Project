package dev.bengi.feedbackservice.domain.payload.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FeedbackScoreRequest {
    @NotNull(message = "Submission ID is required")
    private Long submissionId;

    @NotNull(message = "Question scores are required")
    private Map<Long, Double> questionScores;

    private Map<Long, Double> sentimentScores;

    @NotNull(message = "Satisfaction score is required")
    @Min(value = 1, message = "Satisfaction score must be between 1 and 5")
    @Max(value = 5, message = "Satisfaction score must be between 1 and 5")
    private Double satisfactionScore;

    @NotNull(message = "Priority score is required")
    @Min(value = 1, message = "Priority score must be between 1 and 3")
    @Max(value = 3, message = "Priority score must be between 1 and 3")
    private Double priorityScore;

    private Map<QuestionCategory, Double> categoryScores;

    private String adminComments;
} 