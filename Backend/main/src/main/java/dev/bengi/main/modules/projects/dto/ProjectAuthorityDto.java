package dev.bengi.main.modules.projects.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.Set;

public class ProjectAuthorityDto {
    
    public record ProjectMemberWithRole(
            Long userId,
            String username,
            String email,
            String firstName,
            String lastName,
            String roleName,
            LocalDateTime joinedAt,
            boolean isActive
    ) {}
    
    public record ProjectRoleRequestDto(
            @NotNull Long userId,
            @NotBlank String roleName
    ) {}
    
    public record ProjectRoleResponseDto(
            Long id,
            String name,
            String description,
            Set<String> permissions,
            boolean isDefault
    ) {}
    
    public record ProjectPermissionDto(
            String name,
            String description,
            String category
    ) {}
    
    public record BulkRoleAssignmentDto(
            @NotNull Set<Long> userIds,
            @NotBlank String roleName
    ) {}
    
    public record ProjectAuthorityOverviewDto(
            Long projectId,
            String projectName,
            Long totalMembers,
            Long owners,
            Long managers,
            Long contributors,
            Long viewers,
            String lastActivityAt
    ) {}
}
