package dev.bengi.feedbackservice.domain.payload.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FeedbackDetailsResponse {
    private Long id;
    private String title;
    private String description;
    private String projectName;
    private List<QuestionResponse> questions;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private boolean active;
    private boolean alreadySubmitted;
    private Map<String, Object> validationRules;
} 