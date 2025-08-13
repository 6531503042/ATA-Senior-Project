package dev.bengi.main.modules.department.dto;

import jakarta.validation.constraints.NotBlank;

public record DepartmentRequestDto(
        @NotBlank String name,
        String description,
        boolean active
) {}
