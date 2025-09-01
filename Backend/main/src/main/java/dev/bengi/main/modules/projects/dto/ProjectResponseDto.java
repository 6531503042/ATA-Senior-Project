package dev.bengi.main.modules.projects.dto;

import java.time.LocalDateTime;

public record ProjectResponseDto(
        Long id,
        String name,
        String description,
        String category,
        LocalDateTime startDate,
        LocalDateTime endDate,
        boolean active,
        Long departmentId,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        Long memberCount
) {}


