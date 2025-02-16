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
public class ProjectResponse {
    private Long id;
    private String name;
    private String description;
    private List<Long> memberIds;
    private ZonedDateTime projectStartDate;
    private ZonedDateTime projectEndDate;
    private ZonedDateTime createdAt;
    private ZonedDateTime updatedAt;
}
