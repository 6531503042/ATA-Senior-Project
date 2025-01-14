package dev.bengi.feedbackservice.domain.payload.response;

import dev.bengi.feedbackservice.domain.enums.AnswerType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubmitFeedbackResponse {
    private AnswerType type;
    private Integer value;
}
