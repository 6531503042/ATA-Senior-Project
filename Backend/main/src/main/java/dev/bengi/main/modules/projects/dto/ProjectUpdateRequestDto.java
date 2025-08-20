package dev.bengi.main.modules.projects.dto;

import java.time.LocalDateTime;

public record ProjectUpdateRequestDto(
        String name,
        String description,
        LocalDateTime startDate,
        LocalDateTime endDate,
        String status,
        Long departmentId
) {}


