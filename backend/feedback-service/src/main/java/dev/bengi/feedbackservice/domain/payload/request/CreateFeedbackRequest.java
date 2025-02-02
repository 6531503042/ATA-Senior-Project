package dev.bengi.feedbackservice.domain.payload.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
public class CreateFeedbackRequest {
    @NotBlank(message = "Name is required")
    private String name;

    @NotNull(message = "Project ID is required")
    private Long projectId;

    private List<Long> questionIds;

    private String description;

    @NotNull(message = "Feedback start date is required")
    private ZonedDateTime feedbackStartDate;

    @NotNull(message = "Feedback end date is required")
    private ZonedDateTime feedbackEndDate;
}
