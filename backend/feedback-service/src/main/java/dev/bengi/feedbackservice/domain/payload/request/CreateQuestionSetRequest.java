package dev.bengi.feedbackservice.domain.payload.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CreateQuestionSetRequest {
    private String name;
    private String description;
    private List<Long> questionIds; // question id
}
