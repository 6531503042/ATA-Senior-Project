package dev.bengi.feedbackservice.domain.payload.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuestionSetResponse {
    private Long id;
    private String name;
    private String description;
    @Builder.Default
    private List<Long> questionIds = new ArrayList<>();
    private ZonedDateTime createdAt;
    private ZonedDateTime updatedAt;
}
