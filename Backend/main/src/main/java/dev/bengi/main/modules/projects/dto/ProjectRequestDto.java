package dev.bengi.main.modules.projects.dto;

import jakarta.validation.constraints.NotBlank;

import java.time.LocalDateTime;

public record ProjectRequestDto(
        @NotBlank String name,
        String description,
        LocalDateTime startDate,
        LocalDateTime endDate,
        String status,
        Long departmentId
) {}


