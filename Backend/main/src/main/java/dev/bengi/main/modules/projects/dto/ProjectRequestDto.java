package dev.bengi.main.modules.projects.dto;

import jakarta.validation.constraints.NotBlank;

import java.time.LocalDateTime;
import java.util.List;

public record ProjectRequestDto(
        @NotBlank String name,
        String description,
        LocalDateTime startDate,
        LocalDateTime endDate,
        boolean active,
        List<Long> members
) {}


