package dev.bengi.feedbackservice.domain.payload.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.ZonedDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FeedbackResponse {
    private Long id;
    private String name;
    private Long projectId;
    private List<Long> questionIds;
    private String description;
    private ZonedDateTime feedbackStartDate;
    private ZonedDateTime feedbackEndDate;
    private List<Long> memberIds;
    private ZonedDateTime createdAt;
    private ZonedDateTime updatedAt;
}
