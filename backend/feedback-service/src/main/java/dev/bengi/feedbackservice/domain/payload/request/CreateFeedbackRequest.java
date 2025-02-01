package dev.bengi.feedbackservice.domain.payload.request;

import java.time.ZonedDateTime;
import java.util.List;

import dev.bengi.feedbackservice.domain.enums.PrivacyLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateFeedbackRequest {
    private Long projectId;
    private Long userId;
    private List<Long> questionIds;
    private String title;
    private String description;
    private String category;
    private PrivacyLevel privacyLevel;
    private String additionalComments;
    private ZonedDateTime feedbackStartDate;
    private ZonedDateTime feedbackEndDate;
}
