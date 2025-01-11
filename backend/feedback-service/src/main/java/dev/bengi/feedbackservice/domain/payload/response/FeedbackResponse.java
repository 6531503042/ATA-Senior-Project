package dev.bengi.feedbackservice.domain.payload.response;

import dev.bengi.feedbackservice.domain.enums.PrivacyLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.Instant;

import java.util.Map;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FeedbackResponse {
    private Long id;
    private Long projectId;
    private Long userId;
    private String title;
    private String description;
    private String category;
    private PrivacyLevel privacyLevel;
    private QuestionResponse question;
    private Map<Long, String> answers; // question id -> answer
    private Instant submittedAt;
}
