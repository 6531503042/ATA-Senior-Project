package dev.bengi.feedbackservice.domain.payload.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AnswerResponse {
    private String text;
    private Integer value;
}
