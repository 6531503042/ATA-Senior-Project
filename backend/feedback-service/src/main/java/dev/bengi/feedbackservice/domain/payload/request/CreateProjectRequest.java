package dev.bengi.feedbackservice.domain.payload.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateProjectRequest {

    @NotBlank(message = "Project name cannot be empty")
    private String name;

    private String description;

    @Min(value = 1, message = "Total employees cannot be less than 1")
    private Integer totalEmployees;

    @NotNull(message = "Feedback start date cannot be empty")
    private Instant feedbackStartDate;

    @NotNull(message = "Feedback end date cannot be empty")
    private Instant feedbackEndDate;

}
