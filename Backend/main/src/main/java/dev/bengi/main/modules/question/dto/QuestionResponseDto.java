package dev.bengi.main.modules.question.dto;

import dev.bengi.main.modules.question.enums.QuestionType;
import java.time.LocalDateTime;
import java.util.List;

public record QuestionResponseDto(
        Long id,
        String text,
        String description,
        QuestionType questionType,
        String category,
        boolean required,
        String validationRules,
        List<String> choices,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}


