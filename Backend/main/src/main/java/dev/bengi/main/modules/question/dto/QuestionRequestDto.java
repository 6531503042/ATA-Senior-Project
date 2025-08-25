package dev.bengi.main.modules.question.dto;

import dev.bengi.main.modules.question.enums.QuestionType;
import dev.bengi.main.modules.question.enums.QuestionCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record QuestionRequestDto(
        @NotBlank String text,
        String description,
        @NotNull QuestionType questionType,
        QuestionCategory category,
        boolean required,
        String validationRules
) {}


