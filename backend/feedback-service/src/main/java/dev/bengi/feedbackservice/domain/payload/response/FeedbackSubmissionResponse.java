package dev.bengi.feedbackservice.domain.payload.response;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FeedbackSubmissionResponse {
    private Long id;
    private Long feedbackId;
    private String submittedBy;
    private Map<Long, String> responses;
    private List<QuestionDetailsResponse> questionDetails;
    private String overallComments;
    private LocalDateTime submittedAt;
    private LocalDateTime updatedAt;
}
