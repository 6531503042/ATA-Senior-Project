package dev.bengi.main.modules.department.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.List;

public record DepartmentRequestDto(
        @NotBlank String name,
        String description,
        boolean active,
        List<Long> memberIds
) {}
