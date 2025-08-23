package dev.bengi.main.modules.user.dto;

import java.time.LocalDateTime;
import java.util.Set;

public record UserResponseDto(
        Long id,
        String username,
        String email,
        String firstName,
        String lastName,
        String phone,
        Long departmentId,
        String departmentName,
        Set<String> roles,
        boolean active,
        LocalDateTime lastLoginAt,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}
