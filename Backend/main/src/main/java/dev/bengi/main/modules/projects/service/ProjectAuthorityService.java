package dev.bengi.main.modules.projects.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import dev.bengi.main.exception.ErrorCode;
import dev.bengi.main.exception.GlobalServiceException;
import dev.bengi.main.modules.projects.dto.ProjectAuthorityDto.*;
import dev.bengi.main.modules.projects.model.ProjectRole;
import dev.bengi.main.modules.projects.model.ProjectMemberRole;
import dev.bengi.main.modules.projects.repository.ProjectRepository;
import dev.bengi.main.modules.projects.repository.ProjectRoleRepository;
import dev.bengi.main.modules.projects.repository.ProjectMemberRoleRepository;
import dev.bengi.main.modules.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.r2dbc.core.DatabaseClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProjectAuthorityService {
    
    private final ProjectRepository projectRepository;
    private final ProjectRoleRepository projectRoleRepository;
    private final ProjectMemberRoleRepository projectMemberRoleRepository;
    private final UserRepository userRepository;
    private final DatabaseClient databaseClient;
    private final ObjectMapper objectMapper;
    
    // Default project permissions
    private static final Set<String> OWNER_PERMISSIONS = Set.of(
        "project.read", "project.write", "project.delete",
        "members.read", "members.write", "members.delete",
        "feedback.read", "feedback.write", "feedback.delete",
        "authority.manage"
    );
    
    private static final Set<String> MANAGER_PERMISSIONS = Set.of(
        "project.read", "project.write",
        "members.read", "members.write",
        "feedback.read", "feedback.write"
    );
    
    private static final Set<String> CONTRIBUTOR_PERMISSIONS = Set.of(
        "project.read", "feedback.read", "feedback.write"
    );
    
    private static final Set<String> VIEWER_PERMISSIONS = Set.of(
        "project.read", "feedback.read"
    );
    
    @Transactional
    public Mono<Void> initializeDefaultRoles() {
        return createDefaultRoleIfNotExists("Owner", "Project owner with full permissions", OWNER_PERMISSIONS, false)
                .then(createDefaultRoleIfNotExists("Manager", "Project manager with management permissions", MANAGER_PERMISSIONS, false))
                .then(createDefaultRoleIfNotExists("Contributor", "Project contributor with read/write access", CONTRIBUTOR_PERMISSIONS, true))
                .then(createDefaultRoleIfNotExists("Viewer", "Project viewer with read-only access", VIEWER_PERMISSIONS, false))
                .then();
    }
    
    private Mono<ProjectRole> createDefaultRoleIfNotExists(String name, String description, Set<String> permissions, boolean isDefault) {
        return projectRoleRepository.existsByName(name)
                .flatMap(exists -> {
                    if (exists) {
                        return Mono.empty();
                    }
                    
                    ProjectRole role = new ProjectRole();
                    role.setName(name);
                    role.setDescription(description);
                    role.setPermissions(serializePermissions(permissions));
                    role.setDefault(isDefault);
                    
                    return projectRoleRepository.save(role);
                });
    }
    
    public Flux<ProjectRoleResponseDto> getAllRoles() {
        return projectRoleRepository.findAllOrderByDefault()
                .map(this::mapToRoleResponseDto);
    }
    
    public Mono<ProjectRoleResponseDto> getRoleById(Long roleId) {
        return projectRoleRepository.findById(roleId)
                .switchIfEmpty(Mono.error(new GlobalServiceException(ErrorCode.NOT_FOUND, "Project role not found")))
                .map(this::mapToRoleResponseDto);
    }
    
    @Transactional
    public Mono<ProjectRoleResponseDto> createRole(ProjectRoleResponseDto request) {
        return projectRoleRepository.existsByName(request.name())
                .flatMap(exists -> {
                    if (exists) {
                        return Mono.error(new GlobalServiceException(ErrorCode.CONFLICT, "Role name already exists"));
                    }
                    
                    ProjectRole role = new ProjectRole();
                    role.setName(request.name());
                    role.setDescription(request.description());
                    role.setPermissions(serializePermissions(request.permissions()));
                    role.setDefault(request.isDefault());
                    
                    return projectRoleRepository.save(role);
                })
                .map(this::mapToRoleResponseDto);
    }
    
    @Transactional
    public Mono<Void> assignUserRole(Long projectId, Long userId, String roleName, Long assignedBy) {
        return validateProjectExists(projectId)
                .then(validateUserExists(userId))
                .then(projectRoleRepository.findByName(roleName)
                        .switchIfEmpty(Mono.error(new GlobalServiceException(ErrorCode.NOT_FOUND, "Role not found"))))
                .flatMap(role -> {
                    // Deactivate existing roles for this user in this project
                    return projectMemberRoleRepository.deactivateByProjectAndUser(projectId, userId)
                            .then(createProjectMemberRole(projectId, userId, role.getId(), assignedBy));
                })
                .then();
    }
    
    @Transactional
    public Mono<Void> bulkAssignRoles(Long projectId, BulkRoleAssignmentDto request, Long assignedBy) {
        return validateProjectExists(projectId)
                .then(projectRoleRepository.findByName(request.roleName())
                        .switchIfEmpty(Mono.error(new GlobalServiceException(ErrorCode.NOT_FOUND, "Role not found"))))
                .flatMap(role -> Flux.fromIterable(request.userIds())
                        .concatMap(userId -> assignUserRole(projectId, userId, role.getName(), assignedBy))
                        .then());
    }
    
    @Transactional
    public Mono<Void> removeUserFromProject(Long projectId, Long userId) {
        return validateProjectExists(projectId)
                .then(projectMemberRoleRepository.deactivateByProjectAndUser(projectId, userId));
    }
    
    public Flux<ProjectMemberWithRole> getProjectMembers(Long projectId) {
        String query = """
            SELECT 
                u.id as user_id,
                u.username,
                u.email,
                u.first_name,
                u.last_name,
                pr.name as role_name,
                pmr.assigned_at as joined_at,
                pmr.is_active
            FROM project_member_roles pmr
            JOIN users u ON pmr.user_id = u.id
            JOIN project_roles pr ON pmr.role_id = pr.id
            WHERE pmr.project_id = :projectId AND pmr.is_active = true
            ORDER BY pr.name, u.username
            """;
        
        return databaseClient.sql(query)
                .bind("projectId", projectId)
                .map((row, meta) -> new ProjectMemberWithRole(
                        row.get("user_id", Long.class),
                        row.get("username", String.class),
                        row.get("email", String.class),
                        row.get("first_name", String.class),
                        row.get("last_name", String.class),
                        row.get("role_name", String.class),
                        row.get("joined_at", LocalDateTime.class),
                        Boolean.TRUE.equals(row.get("is_active", Boolean.class))
                ))
                .all();
    }
    
    public Mono<Boolean> hasPermission(Long projectId, Long userId, String permission) {
        return projectMemberRoleRepository.findActiveByProjectAndUser(projectId, userId)
                .flatMap(memberRole -> projectRoleRepository.findById(memberRole.getRoleId()))
                .map(role -> {
                    Set<String> permissions = deserializePermissions(role.getPermissions());
                    return permissions.contains(permission);
                })
                .defaultIfEmpty(false);
    }
    
    public Flux<ProjectAuthorityOverviewDto> getProjectAuthorityOverview() {
        String query = """
            SELECT 
                p.id as project_id,
                p.name as project_name,
                COUNT(DISTINCT pmr.user_id) as total_members,
                COUNT(DISTINCT CASE WHEN pr.name = 'Owner' THEN pmr.user_id END) as owners,
                COUNT(DISTINCT CASE WHEN pr.name = 'Manager' THEN pmr.user_id END) as managers,
                COUNT(DISTINCT CASE WHEN pr.name = 'Contributor' THEN pmr.user_id END) as contributors,
                COUNT(DISTINCT CASE WHEN pr.name = 'Viewer' THEN pmr.user_id END) as viewers,
                MAX(pmr.assigned_at) as last_activity_at
            FROM projects p
            LEFT JOIN project_member_roles pmr ON p.id = pmr.project_id AND pmr.is_active = true
            LEFT JOIN project_roles pr ON pmr.role_id = pr.id
            GROUP BY p.id, p.name
            ORDER BY total_members DESC, p.name
            """;
        
        return databaseClient.sql(query)
                .map((row, meta) -> new ProjectAuthorityOverviewDto(
                        row.get("project_id", Long.class),
                        row.get("project_name", String.class),
                        Optional.ofNullable(row.get("total_members", Long.class)).orElse(0L),
                        Optional.ofNullable(row.get("owners", Long.class)).orElse(0L),
                        Optional.ofNullable(row.get("managers", Long.class)).orElse(0L),
                        Optional.ofNullable(row.get("contributors", Long.class)).orElse(0L),
                        Optional.ofNullable(row.get("viewers", Long.class)).orElse(0L),
                        Optional.ofNullable(row.get("last_activity_at", LocalDateTime.class))
                                .map(LocalDateTime::toString)
                                .orElse("No activity")
                ))
                .all();
    }
    
    public Flux<ProjectPermissionDto> getAllPermissions() {
        List<ProjectPermissionDto> permissions = Arrays.asList(
                new ProjectPermissionDto("project.read", "View project details", "Project"),
                new ProjectPermissionDto("project.write", "Edit project details", "Project"),
                new ProjectPermissionDto("project.delete", "Delete project", "Project"),
                new ProjectPermissionDto("members.read", "View project members", "Members"),
                new ProjectPermissionDto("members.write", "Add/Edit project members", "Members"),
                new ProjectPermissionDto("members.delete", "Remove project members", "Members"),
                new ProjectPermissionDto("feedback.read", "View project feedback", "Feedback"),
                new ProjectPermissionDto("feedback.write", "Create/Edit feedback", "Feedback"),
                new ProjectPermissionDto("feedback.delete", "Delete feedback", "Feedback"),
                new ProjectPermissionDto("authority.manage", "Manage project roles and permissions", "Authority")
        );
        
        return Flux.fromIterable(permissions);
    }
    
    // Helper methods
    
    private Mono<Void> validateProjectExists(Long projectId) {
        return projectRepository.existsById(projectId)
                .flatMap(exists -> exists ? Mono.empty() : 
                        Mono.error(new GlobalServiceException(ErrorCode.NOT_FOUND, "Project not found")));
    }
    
    private Mono<Void> validateUserExists(Long userId) {
        return userRepository.existsById(userId)
                .flatMap(exists -> exists ? Mono.empty() : 
                        Mono.error(new GlobalServiceException(ErrorCode.NOT_FOUND, "User not found")));
    }
    
    private Mono<ProjectMemberRole> createProjectMemberRole(Long projectId, Long userId, Long roleId, Long assignedBy) {
        ProjectMemberRole memberRole = new ProjectMemberRole();
        memberRole.setProjectId(projectId);
        memberRole.setUserId(userId);
        memberRole.setRoleId(roleId);
        memberRole.setAssignedBy(assignedBy);
        memberRole.setActive(true);
        
        return projectMemberRoleRepository.save(memberRole);
    }
    
    private ProjectRoleResponseDto mapToRoleResponseDto(ProjectRole role) {
        return new ProjectRoleResponseDto(
                role.getId(),
                role.getName(),
                role.getDescription(),
                deserializePermissions(role.getPermissions()),
                role.isDefault()
        );
    }
    
    private String serializePermissions(Set<String> permissions) {
        try {
            return objectMapper.writeValueAsString(permissions);
        } catch (JsonProcessingException e) {
            log.error("Error serializing permissions: {}", permissions, e);
            return "[]";
        }
    }
    
    private Set<String> deserializePermissions(String permissionsJson) {
        try {
            return objectMapper.readValue(permissionsJson, new TypeReference<Set<String>>() {});
        } catch (JsonProcessingException e) {
            log.error("Error deserializing permissions: {}", permissionsJson, e);
            return Set.of();
        }
    }
}
