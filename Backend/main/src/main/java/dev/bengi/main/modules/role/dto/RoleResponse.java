package dev.bengi.main.modules.role.dto;

import java.time.LocalDateTime;

public record RoleResponse(
    Long id,
    String name,
    String description,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}