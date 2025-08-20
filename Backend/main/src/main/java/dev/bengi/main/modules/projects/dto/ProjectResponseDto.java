package dev.bengi.main.modules.projects.dto;

import java.time.LocalDateTime;

public record ProjectResponseDto(
        Long id,
        String name,
        String description,
        LocalDateTime startDate,
        LocalDateTime endDate,
        String status,
        Long departmentId,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}


