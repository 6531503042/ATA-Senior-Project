package dev.bengi.main.modules.question.dto;

import dev.bengi.main.modules.question.enums.QuestionType;
import java.util.List;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record QuestionRequestDto(
        @NotBlank String text,
        String description,
        @NotNull QuestionType questionType,
        String category,
        boolean required,
        String validationRules,
        List<QuestionOptionDto> options
) {}


