package dev.bengi.main.modules.submit.dto;

import dev.bengi.main.modules.submit.enums.PrivacyLevel;
import jakarta.validation.constraints.NotNull;

import java.util.Map;

public record SubmitRequestDto(
        @NotNull Long feedbackId,
        @NotNull Map<Long, String> responses,
        String overallComments,
        @NotNull PrivacyLevel privacyLevel
) {}


