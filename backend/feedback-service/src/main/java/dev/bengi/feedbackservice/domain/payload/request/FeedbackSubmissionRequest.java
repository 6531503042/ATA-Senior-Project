package dev.bengi.feedbackservice.domain.payload.request;

import jakarta.validation.constraints.NotBlank;
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
public class FeedbackSubmissionRequest {
    @NotNull(message = "Feedback ID is required")
    private Long feedbackId;

    private String userId;

    @NotNull(message = "Responses are required")
    private Map<Long, String> responses; // Map of questionId to response

    @NotBlank(message = "Overall comments are required")
    private String overallComments;
}
