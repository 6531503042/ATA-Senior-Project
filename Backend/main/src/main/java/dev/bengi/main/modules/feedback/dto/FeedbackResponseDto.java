package dev.bengi.main.modules.feedback.dto;

import java.time.LocalDateTime;
import java.util.List;

public record FeedbackResponseDto(
        Long id,
        String title,
        String description,
        Long projectId,
        String projectName,
        LocalDateTime startDate,
        LocalDateTime endDate,
        boolean active,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        List<Long> questionIds,
        List<String> questionTitles,
        List<Long> targetUserIds,
        List<String> targetUsernames,
        List<Long> targetDepartmentIds,
        List<String> targetDepartmentNames,
        Long submissionCount,
        boolean canSubmit // Based on timing and user permissions
) {}
