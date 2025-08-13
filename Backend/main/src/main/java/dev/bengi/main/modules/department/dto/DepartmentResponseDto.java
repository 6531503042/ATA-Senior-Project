package dev.bengi.main.modules.department.dto;

import java.time.LocalDateTime;

public record DepartmentResponseDto(
        Long id,
        String name,
        String description,
        boolean active,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}
