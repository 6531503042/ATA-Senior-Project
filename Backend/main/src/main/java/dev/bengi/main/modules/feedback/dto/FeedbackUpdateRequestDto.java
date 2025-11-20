package dev.bengi.main.modules.feedback.dto;

import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.List;

public record FeedbackUpdateRequestDto(
        @Size(max = 200)
        String title,

        @Size(max = 2000)
        String description,

        Long projectId,

        LocalDateTime startDate,

        LocalDateTime endDate,

        Boolean active,
        
        String status,
        
        List<Long> questionIds,
        
        List<Long> targetUserIds,
        
        List<Long> targetDepartmentIds
) {}
