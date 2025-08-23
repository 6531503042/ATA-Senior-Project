package dev.bengi.main.modules.feedback.dto;

import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

public record FeedbackUpdateRequestDto(
        @Size(max = 200)
        String title,

        @Size(max = 2000)
        String description,

        Long projectId,

        LocalDateTime startDate,

        LocalDateTime endDate,

        Boolean active
) {}
