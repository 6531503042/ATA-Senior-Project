package dev.bengi.main.modules.question.dto;

import dev.bengi.main.modules.question.enums.QuestionType;

public record QuestionUpdateRequestDto(
        String text,
        String description,
        QuestionType questionType,
        String category,
        Boolean required,
        String validationRules
) {}


