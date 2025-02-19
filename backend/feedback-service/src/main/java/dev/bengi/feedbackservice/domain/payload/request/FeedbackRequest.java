package dev.bengi.feedbackservice.domain.payload.request;

import dev.bengi.feedbackservice.domain.payload.response.UserDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FeedbackRequest {
    @NotBlank(message = "Title is required")
    @Size(max = 255)
    private String title;

    @Size(max = 1000)
    private String description;

    @NotNull(message = "Project ID is required")
    private Long projectId;

    @NotNull(message = "Question IDs are required")
    @Size(min = 1, message = "At least one question is required")
    private List<Long> questionIds;

    @NotNull(message = "Start date is required")
    private LocalDateTime startDate;

    @NotNull(message = "End date is required")
    private LocalDateTime endDate;

    @NotNull(message = "Allowed user IDs are required")
    @Size(min = 1, message = "At least one user must be allowed")
    private Set<String> allowedUserIds;
}