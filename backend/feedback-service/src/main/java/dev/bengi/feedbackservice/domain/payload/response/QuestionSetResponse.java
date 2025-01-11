package dev.bengi.feedbackservice.domain.payload.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class QuestionSetResponse {
    private Long id;
    private String title;
    private String description;
    private List<Long> questions;
}
