package dev.bengi.main.modules.role.dto;

import dev.bengi.main.modules.role.enums.roleName;

public record RoleRequestCreate(
        roleName name,
        String description
) {}