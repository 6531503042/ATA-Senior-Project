package dev.bengi.feedbackservice.domain.payload.request;

import dev.bengi.feedbackservice.domain.enums.PrivacyLevel;
import dev.bengi.feedbackservice.domain.enums.QuestionCategory;
import dev.bengi.feedbackservice.domain.payload.response.FeedbackResponse;
import dev.bengi.feedbackservice.domain.payload.response.SubmitFeedbackResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SubmitFeedbackRequest {
    private Long questionSetId;
    private Long projectId;
    private String title;
    private String description;

    private QuestionCategory category;
    private PrivacyLevel privacyLevel;
    private List<SubmitFeedbackResponse> response;
    private String additionalComments;
    private Instant submittedAt;
}
