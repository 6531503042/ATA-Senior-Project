package dev.bengi.main.modules.projects.dto;

import java.time.LocalDateTime;
import java.util.List;

public record ProjectUpdateRequestDto(
        String name,
        String description,
        LocalDateTime startDate,
        LocalDateTime endDate,
        boolean active,
        Long departmentId,
        List<Long> members,
        List<Long> existingMembers
) {}


