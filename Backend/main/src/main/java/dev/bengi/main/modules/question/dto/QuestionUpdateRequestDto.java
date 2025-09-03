package dev.bengi.main.modules.question.dto;

import dev.bengi.main.modules.question.enums.QuestionType;
import java.util.List;

public record QuestionUpdateRequestDto(
        String text,
        String description,
        QuestionType questionType,
        String category,
        Boolean required,
        String validationRules,
        List<QuestionOptionDto> options
) {}


