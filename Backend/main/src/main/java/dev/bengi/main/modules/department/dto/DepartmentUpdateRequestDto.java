package dev.bengi.main.modules.department.dto;

public record DepartmentUpdateRequestDto(
    String name,
    String description,
    boolean active
) {}
