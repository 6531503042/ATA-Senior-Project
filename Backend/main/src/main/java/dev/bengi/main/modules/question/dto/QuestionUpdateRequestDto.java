package dev.bengi.main.modules.question.dto;

import dev.bengi.main.modules.question.enums.QuestionType;
import dev.bengi.main.modules.question.enums.QuestionCategory;

public record QuestionUpdateRequestDto(
        String text,
        String description,
        QuestionType questionType,
        QuestionCategory category,
        Boolean required,
        String validationRules
) {}


