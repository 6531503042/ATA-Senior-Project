package dev.bengi.main.modules.feedback.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.List;

public record FeedbackCreateRequestDto(
        @NotBlank
        @Size(max = 200)
        String title,

        @Size(max = 2000)
        String description,

        @NotNull
        Long projectId,

        LocalDateTime startDate,

        LocalDateTime endDate,

        Boolean active,

        List<Long> questionIds,

        List<Long> targetUserIds,

        List<Long> targetDepartmentIds
) {}
