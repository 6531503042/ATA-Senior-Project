package dev.bengi.main.modules.user.dto;

import java.util.List;

public record TokenValidationResponse(
        boolean valid,
        Long userId,
        String username,
        List<String> roles,
        String message
) {}


