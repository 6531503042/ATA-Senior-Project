package dev.bengi.feedbackservice.domain.payload.response;

import dev.bengi.feedbackservice.domain.enums.QuestionType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuestionDetailsResponse {
    private Long id;
    private String text;
    private String description;
    private QuestionType questionType;
    private String category;
    private List<String> choices;
    private String response;
} 