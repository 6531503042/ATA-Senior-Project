package dev.bengi.main.modules.submit.dto;

import dev.bengi.main.modules.submit.enums.PrivacyLevel;
import java.time.LocalDateTime;
import java.util.Map;

public record SubmitResponseDto(
        Long id,
        Long feedbackId,
        String submittedBy,
        Map<Long, String> responses,
        String overallComments,
        PrivacyLevel privacyLevel,
        LocalDateTime submittedAt,
        LocalDateTime updatedAt,
        Double adminRating,
        String adminSentiment,
        String analysisNotes,
        LocalDateTime analyzedAt,
        String analyzedBy
) {}


