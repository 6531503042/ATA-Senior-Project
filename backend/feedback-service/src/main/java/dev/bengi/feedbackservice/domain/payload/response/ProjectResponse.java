package dev.bengi.feedbackservice.domain.payload.response;

import dev.bengi.feedbackservice.domain.model.Project;
import lombok.Builder;
import lombok.Data;
import java.time.Instant;
import java.time.ZonedDateTime;

@Data
@Builder
public class ProjectResponse {
    private Long id;
    private String name;
    private String description;
    private Integer totalEmployees;
    private ZonedDateTime feedbackStartDate;
    private ZonedDateTime feedbackEndDate;
    private ZonedDateTime createdAt;
    private ZonedDateTime updatedAt;
}
