package dev.bengi.main.modules.projects.controller;

import dev.bengi.main.modules.projects.dto.ProjectAuthorityDto.*;
import dev.bengi.main.modules.projects.service.ProjectAuthorityService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/projects/authority")
@RequiredArgsConstructor
public class ProjectAuthorityController {
    
    private final ProjectAuthorityService authorityService;
    
    @PostMapping("/init")
    @PreAuthorize("hasRole('ADMIN')")
    public Mono<ResponseEntity<Void>> initializeDefaultRoles() {
        return authorityService.initializeDefaultRoles()
                .thenReturn(ResponseEntity.ok().build());
    }
    
    @GetMapping("/roles")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public Flux<ProjectRoleResponseDto> getAllRoles() {
        return authorityService.getAllRoles();
    }
    
    @GetMapping("/roles/{roleId}")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public Mono<ResponseEntity<ProjectRoleResponseDto>> getRoleById(@PathVariable Long roleId) {
        return authorityService.getRoleById(roleId)
                .map(ResponseEntity::ok);
    }
    
    @PostMapping("/roles")
    @PreAuthorize("hasRole('ADMIN')")
    public Mono<ResponseEntity<ProjectRoleResponseDto>> createRole(@RequestBody @Valid ProjectRoleResponseDto request) {
        return authorityService.createRole(request)
                .map(role -> ResponseEntity.ok(role));
    }
    
    @PostMapping("/{projectId}/assign")
    @PreAuthorize("hasRole('ADMIN')")
    public Mono<ResponseEntity<Void>> assignUserRole(
            @PathVariable Long projectId,
            @RequestBody @Valid ProjectRoleRequestDto request,
            Authentication auth) {
        // In a real implementation, you'd get the current user ID from the authentication
        Long assignedBy = 1L; // Placeholder
        
        return authorityService.assignUserRole(projectId, request.userId(), request.roleName(), assignedBy)
                .thenReturn(ResponseEntity.ok().build());
    }
    
    @PostMapping("/{projectId}/bulk-assign")
    @PreAuthorize("hasRole('ADMIN')")
    public Mono<ResponseEntity<Void>> bulkAssignRoles(
            @PathVariable Long projectId,
            @RequestBody @Valid BulkRoleAssignmentDto request,
            Authentication auth) {
        Long assignedBy = 1L; // Placeholder
        
        return authorityService.bulkAssignRoles(projectId, request, assignedBy)
                .thenReturn(ResponseEntity.ok().build());
    }
    
    @DeleteMapping("/{projectId}/members/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public Mono<ResponseEntity<Void>> removeUserFromProject(
            @PathVariable Long projectId,
            @PathVariable Long userId) {
        return authorityService.removeUserFromProject(projectId, userId)
                .thenReturn(ResponseEntity.noContent().build());
    }
    
    @GetMapping("/{projectId}/members")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public Flux<ProjectMemberWithRole> getProjectMembers(@PathVariable Long projectId) {
        return authorityService.getProjectMembers(projectId);
    }
    
    @GetMapping("/{projectId}/check-permission")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public Mono<ResponseEntity<Boolean>> checkPermission(
            @PathVariable Long projectId,
            @RequestParam Long userId,
            @RequestParam String permission) {
        return authorityService.hasPermission(projectId, userId, permission)
                .map(ResponseEntity::ok);
    }
    
    @GetMapping("/overview")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public Flux<ProjectAuthorityOverviewDto> getProjectAuthorityOverview() {
        return authorityService.getProjectAuthorityOverview();
    }
    
    @GetMapping("/permissions")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public Flux<ProjectPermissionDto> getAllPermissions() {
        return authorityService.getAllPermissions();
    }
}
