package dev.bengi.main.modules.question.dto;

import dev.bengi.main.modules.question.enums.QuestionType;
import java.time.LocalDateTime;

public record QuestionResponseDto(
        Long id,
        String text,
        String description,
        QuestionType questionType,
        String category,
        boolean required,
        String validationRules,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}


