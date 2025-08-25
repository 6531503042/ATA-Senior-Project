package dev.bengi.main.modules.question.dto;

import dev.bengi.main.modules.question.enums.QuestionType;
import dev.bengi.main.modules.question.enums.QuestionCategory;
import java.time.LocalDateTime;

public record QuestionResponseDto(
        Long id,
        String text,
        String description,
        QuestionType questionType,
        QuestionCategory category,
        boolean required,
        String validationRules,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}


