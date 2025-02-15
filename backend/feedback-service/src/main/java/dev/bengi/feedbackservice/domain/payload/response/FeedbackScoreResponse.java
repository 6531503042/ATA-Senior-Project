package dev.bengi.feedbackservice.domain.payload.response;

import dev.bengi.feedbackservice.domain.enums.QuestionCategory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FeedbackScoreResponse {
    private Long id;
    private Long submissionId;
    private Map<Long, Double> questionScores;
    private Map<Long, Double> sentimentScores;
    private Map<QuestionCategory, Double> categoryScores;
    private Double totalScore;
    private Double satisfactionScore;
    private Double priorityScore;
    private String adminComments;
    private String scoredBy;
    private ZonedDateTime scoredAt;
    private ZonedDateTime createdAt;
    private ZonedDateTime updatedAt;
    
    // Additional fields for detailed view
    private String feedbackTitle;
    private String submittedBy;
    private List<QuestionResponse> questions; // Detailed question information
    private Map<Long, String> responses; // Map of questionId to user's response
    private boolean scored;
} 