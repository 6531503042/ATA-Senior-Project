package dev.bengi.main.modules.user.dto;

import java.util.List;

public record JwtResponse(
        String accessToken,
        String refreshToken,
        Long userId,
        String username,
        String email,
        List<String> roles
) {}


