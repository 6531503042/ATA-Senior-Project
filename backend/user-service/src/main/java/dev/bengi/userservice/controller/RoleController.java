package dev.bengi.userservice.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import jakarta.validation.Valid;

import dev.bengi.userservice.domain.enums.RoleName;
import dev.bengi.userservice.domain.model.Role;
import dev.bengi.userservice.domain.payload.request.CreateRoleRequest;
import dev.bengi.userservice.domain.payload.response.ResponseMessage;
import dev.bengi.userservice.http.HeaderGenerator;
import dev.bengi.userservice.service.RoleService;
import dev.bengi.userservice.security.RequirePermissions;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;

@Slf4j
@RestController
@RequestMapping("/api/roles")
@RequiredArgsConstructor
@Tag(name = "Role Management", description = "APIs for managing roles")
@CrossOrigin(origins = "*", maxAge = 3600)
public class RoleController {
    
    private final RoleService roleService;
    private final HeaderGenerator headerGenerator;

    @PostMapping("/create")
    @RequirePermissions("roles:create")
    @Operation(summary = "Create new role", description = "Create a new role with permissions")
    public Mono<ResponseEntity<Role>> createRole(@Valid @RequestBody CreateRoleRequest request) {
        log.info("Creating new role: {}", request.getName());

        Role role = Role.builder()
                .name(request.getName())
                .permissions(request.getPermissions())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        return roleService.createRole(role)
                .map(savedRole -> ResponseEntity.status(HttpStatus.CREATED)
                        .headers(headerGenerator.getHeadersForSuccessPostMethod(savedRole.getId()))
                        .body(savedRole))
                .doOnError(error -> log.error("Error creating role: {}", error.getMessage()));
    }


    @GetMapping("/list")
    @RequirePermissions("roles:read")
    @Operation(summary = "Get all roles", description = "Retrieve all roles in the system")
    public Mono<ResponseEntity<List<Role>>> getAllRoles() {
        log.info("Fetching all roles");
        return roleService.findAllRoles()
                .collectList()
                .map(roles -> ResponseEntity.ok()
                        .headers(headerGenerator.getHeadersForSuccessGetMethod())
                        .body(roles))
                .doOnError(error -> log.error("Error fetching roles: {}", error.getMessage()));
    }
    
    @GetMapping("/{roleName}")
    @RequirePermissions("roles:read")
    @Operation(summary = "Get role by name", description = "Retrieve a role by its name")
    public Mono<ResponseEntity<Role>> getRoleByName(
            @Parameter(description = "Role name to retrieve")
            @PathVariable String roleName) {
        log.info("Fetching role with name: {}", roleName);
        return roleService.findByName(roleName)
                    .map(role -> ResponseEntity.ok()
                            .headers(headerGenerator.getHeadersForSuccessGetMethod())
                            .body(role))
            .switchIfEmpty(Mono.just(ResponseEntity.notFound().build()))
            .doOnError(error -> log.error("Error fetching role: {}", error.getMessage()));
    }
    
    @PutMapping("/{roleName}/permissions")
    @RequirePermissions("roles:update")
    @Operation(summary = "Update role permissions", description = "Update permissions for a role")
    public Mono<ResponseEntity<Role>> updateRolePermissions(
            @PathVariable String roleName,
            @RequestBody Set<String> permissions) {
        log.info("Updating permissions for role: {}", roleName);
        return roleService.updateRolePermissions(roleName, permissions)
            .map(updatedRole -> ResponseEntity.ok()
                                .headers(headerGenerator.getHeadersForSuccessGetMethod())
                .body(updatedRole))
            .switchIfEmpty(Mono.just(ResponseEntity.notFound().build()))
            .doOnError(error -> log.error("Error updating role permissions: {}", error.getMessage()));
    }
    
    @DeleteMapping("/{roleName}")
    @RequirePermissions("roles:delete")
    @Operation(summary = "Delete role", description = "Delete a role by name")
    public Mono<ResponseEntity<Void>> deleteRole(@PathVariable String roleName) {
        log.info("Deleting role: {}", roleName);
        return roleService.deleteRole(roleName)
            .then(Mono.just(ResponseEntity.noContent().<Void>build()))
            .doOnError(error -> log.error("Error deleting role: {}", error.getMessage()));
    }
    
    @GetMapping("/search")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Search roles by description", description = "Find roles with description containing specified text")
    public Mono<ResponseEntity<List<Role>>> searchRolesByDescription(
            @Parameter(description = "Text to search for in role descriptions")
            @RequestParam(name = "text") String text) {
        log.info("Searching for roles with description containing: {}", text);
        
        return roleService.findRolesWithDescriptionContaining(text)
                .collectList()
                .map(roles -> ResponseEntity.ok()
                        .headers(headerGenerator.getHeadersForSuccessGetMethod())
                        .body(roles))
                .onErrorResume(error -> {
                    log.error("Error searching roles: {}", error.getMessage());
                    return Mono.just(ResponseEntity.badRequest().build());
                });
    }
    
    @PostMapping("/assign")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Assign role to user", description = "Assign a role to a user by user ID and role name")
    public Mono<ResponseEntity<ResponseMessage>> assignRoleToUser(
            @Parameter(description = "User ID to assign role to")
            @RequestParam(name = "userId") Long userId,
            @Parameter(description = "Role name to assign")
            @RequestParam(name = "roleName") String roleName) {
        log.info("Assigning role {} to user with ID: {}", roleName, userId);
        
        return roleService.assignRole(userId, roleName)
                .map(assigned -> {
                    if (assigned) {
                        return ResponseEntity.ok()
                                .headers(headerGenerator.getHeadersForSuccessGetMethod())
                                .body(new ResponseMessage("Role assigned successfully"));
                    } else {
                        return ResponseEntity.ok()
                                .headers(headerGenerator.getHeadersForSuccessGetMethod())
                                .body(new ResponseMessage("Role was already assigned to user"));
                    }
                })
                .onErrorResume(error -> {
                    log.error("Error assigning role: {}", error.getMessage());
                    return Mono.just(ResponseEntity.badRequest()
                            .body(new ResponseMessage("Error assigning role: " + error.getMessage())));
                });
    }
    
    @DeleteMapping("/revoke")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Revoke role from user", description = "Revoke a role from a user by user ID and role name")
    public Mono<ResponseEntity<ResponseMessage>> revokeRoleFromUser(
            @Parameter(description = "User ID to revoke role from")
            @RequestParam(name = "userId") Long userId,
            @Parameter(description = "Role name to revoke")
            @RequestParam(name = "roleName") String roleName) {
        log.info("Revoking role {} from user with ID: {}", roleName, userId);
        
        return roleService.revokeRole(userId, roleName)
                .map(revoked -> {
                    if (revoked) {
                        return ResponseEntity.ok()
                                .headers(headerGenerator.getHeadersForSuccessGetMethod())
                                .body(new ResponseMessage("Role revoked successfully"));
                    } else {
                        return ResponseEntity.ok()
                                .headers(headerGenerator.getHeadersForSuccessGetMethod())
                                .body(new ResponseMessage("User did not have the specified role"));
                    }
                })
                .onErrorResume(error -> {
                    log.error("Error revoking role: {}", error.getMessage());
                    return Mono.just(ResponseEntity.badRequest()
                            .body(new ResponseMessage("Error revoking role: " + error.getMessage())));
                });
    }
    
    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_USER')")
    @Operation(summary = "Get user roles", description = "Get roles associated with a user by user ID")
    public Mono<ResponseEntity<List<String>>> getUserRoles(
            @Parameter(description = "User ID to get roles for")
            @PathVariable Long userId) {
        log.info("Fetching roles for user with ID: {}", userId);
        
        return roleService.getUserRoles(userId)
                .map(roles -> ResponseEntity.ok()
                        .headers(headerGenerator.getHeadersForSuccessGetMethod())
                        .body(roles))
                .onErrorResume(error -> {
                    log.error("Error fetching user roles: {}", error.getMessage());
                    return Mono.just(ResponseEntity.badRequest().build());
                });
    }
} 