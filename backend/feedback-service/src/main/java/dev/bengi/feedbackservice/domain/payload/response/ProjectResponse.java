package dev.bengi.feedbackservice.domain.payload.response;

import lombok.Builder;
import lombok.Data;
import java.time.Instant;

@Data
@Builder
public class ProjectResponse {
    private Long id;
    private String name;
    private String description;
    private Integer totalEmployees;
    private Instant feedbackStartDate;
    private Instant feedbackEndDate;
    private Instant createdAt;
    private Instant updatedAt;
}
