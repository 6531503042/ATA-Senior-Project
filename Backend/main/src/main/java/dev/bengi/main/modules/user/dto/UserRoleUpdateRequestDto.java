package dev.bengi.main.modules.user.dto;

import jakarta.validation.constraints.NotEmpty;
import java.util.Set;

public record UserRoleUpdateRequestDto(
        @NotEmpty
        Set<String> roles
) {}
