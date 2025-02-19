package dev.bengi.feedbackservice.domain.payload.request;

import jakarta.persistence.ElementCollection;
import jakarta.validation.constraints.Min;
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
public class CreateProjectRequest {

    @NotBlank(message = "Project name cannot be empty")
    private String name;

    private String description;

    private List<Long> memberIds;

    @NotNull(message = "Project start date cannot be empty")
    private ZonedDateTime projectStartDate;

    @NotNull(message = "Project end date cannot be empty")
    private ZonedDateTime projectEndDate;

}
