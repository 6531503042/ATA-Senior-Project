package dev.bengi.feedbackservice.domain.model;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Embeddable
public class AnswerOption {
    private String text;
    private int value;
    public String getText() {
        return text;
    }

    public int getValue() {
        return value;
    }
}
