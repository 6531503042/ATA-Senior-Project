package dev.bengi.main.modules.projects.dto;

import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public record ProjectMembersRequestDto(
        @NotEmpty List<Long> memberIds
) {}


