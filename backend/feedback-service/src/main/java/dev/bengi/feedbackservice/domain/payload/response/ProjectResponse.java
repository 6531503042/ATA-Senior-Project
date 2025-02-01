package dev.bengi.feedbackservice.domain.payload.response;

import dev.bengi.feedbackservice.domain.model.Project;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.ZonedDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProjectResponse {
    private Long id;
    private String name;
    private String description;
    private ZonedDateTime projectStartDate;
    private ZonedDateTime projectEndDate;
    private ZonedDateTime createdAt;
    private ZonedDateTime updatedAt;
}
