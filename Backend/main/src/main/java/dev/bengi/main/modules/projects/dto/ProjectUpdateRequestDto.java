package dev.bengi.main.modules.projects.dto;

import java.time.LocalDateTime;
import java.util.List;

public record ProjectUpdateRequestDto(
        String name,
        String description,
        LocalDateTime startDate,
        LocalDateTime endDate,
        boolean active,
        List<Long> members,
        List<Long> existingMembers
) {}


