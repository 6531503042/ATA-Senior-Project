package dev.bengi.main.modules.submit.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record SubmissionAnalysisDto(
        @NotNull
        @Min(0)
        @Max(10)
        Double rating,
        
        String analysisNotes,
        
        String sentiment, // positive, neutral, negative
        
        @NotNull
        LocalDateTime analyzedAt,
        
        String analyzedBy
) {}
