package dev.bengi.userservice.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import dev.bengi.userservice.domain.enums.RoleName;
import dev.bengi.userservice.domain.model.Role;
import dev.bengi.userservice.domain.payload.response.ResponseMessage;
import dev.bengi.userservice.http.HeaderGenerator;
import dev.bengi.userservice.service.RoleService;
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
    
    @GetMapping("/all")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
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
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Get role by name", description = "Retrieve a role by its name")
    public Mono<ResponseEntity<Role>> getRoleByName(
            @Parameter(description = "Role name to retrieve")
            @PathVariable String roleName) {
        log.info("Fetching role with name: {}", roleName);
        try {
            RoleName name = RoleName.valueOf(roleName.toUpperCase().startsWith("ROLE_") ? 
                    roleName.toUpperCase() : "ROLE_" + roleName.toUpperCase());
            
            return roleService.findByName(name)
                    .map(role -> ResponseEntity.ok()
                            .headers(headerGenerator.getHeadersForSuccessGetMethod())
                            .body(role))
                    .doOnError(error -> log.error("Error fetching role: {}", error.getMessage()));
        } catch (IllegalArgumentException e) {
            log.error("Invalid role name: {}", roleName);
            return Mono.just(ResponseEntity.badRequest().build());
        }
    }
    
    @PostMapping("/create")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Create new role", description = "Create a new role in the system")
    public Mono<ResponseEntity<Role>> createRole(
            @Parameter(description = "Role name to create")
            @RequestParam String roleName) {
        log.info("Creating new role with name: {}", roleName);
        try {
            RoleName name = RoleName.valueOf(roleName.toUpperCase().startsWith("ROLE_") ? 
                    roleName.toUpperCase() : "ROLE_" + roleName.toUpperCase());
            
            return roleService.createRole(name)
                    .map(role -> ResponseEntity.status(HttpStatus.CREATED)
                            .headers(headerGenerator.getHeadersForSuccessPostMethod(null, null))
                            .body(role))
                    .doOnError(error -> log.error("Error creating role: {}", error.getMessage()));
        } catch (IllegalArgumentException e) {
            log.error("Invalid role name: {}", roleName);
            return Mono.just(ResponseEntity.badRequest().build());
        }
    }
    
    @PutMapping("/description/{roleName}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Update role description", description = "Update a role's description by name")
    public Mono<ResponseEntity<ResponseMessage>> updateRoleDescription(
            @Parameter(description = "Role name to update")
            @PathVariable String roleName,
            @Parameter(description = "New description for the role")
            @RequestParam String description) {
        log.info("Updating description for role: {} to '{}'", roleName, description);
        
        return roleService.updateRoleDescription(roleName, description)
                .map(updated -> {
                    if (updated) {
                        return ResponseEntity.ok()
                                .headers(headerGenerator.getHeadersForSuccessGetMethod())
                                .body(new ResponseMessage("Role description updated successfully"));
                    } else {
                        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                .body(new ResponseMessage("Role not found with name: " + roleName));
                    }
                })
                .doOnError(error -> log.error("Error updating role description: {}", error.getMessage()));
    }
    
    @GetMapping("/search")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Search roles by description", description = "Find roles with description containing specified text")
    public Mono<ResponseEntity<List<Role>>> searchRolesByDescription(
            @Parameter(description = "Text to search for in role descriptions")
            @RequestParam String text) {
        log.info("Searching for roles with description containing: {}", text);
        
        return roleService.findRolesWithDescriptionContaining(text)
                .collectList()
                .map(roles -> ResponseEntity.ok()
                        .headers(headerGenerator.getHeadersForSuccessGetMethod())
                        .body(roles))
                .doOnError(error -> log.error("Error searching roles: {}", error.getMessage()));
    }
    
    @PostMapping("/assign")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Assign role to user", description = "Assign a role to a user by user ID and role name")
    public Mono<ResponseEntity<ResponseMessage>> assignRoleToUser(
            @Parameter(description = "User ID to assign role to")
            @RequestParam Long userId,
            @Parameter(description = "Role name to assign")
            @RequestParam String roleName) {
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
                .doOnError(error -> log.error("Error assigning role: {}", error.getMessage()));
    }
    
    @DeleteMapping("/revoke")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Revoke role from user", description = "Revoke a role from a user by user ID and role name")
    public Mono<ResponseEntity<ResponseMessage>> revokeRoleFromUser(
            @Parameter(description = "User ID to revoke role from")
            @RequestParam Long userId,
            @Parameter(description = "Role name to revoke")
            @RequestParam String roleName) {
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
                .doOnError(error -> log.error("Error revoking role: {}", error.getMessage()));
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
                .doOnError(error -> log.error("Error fetching user roles: {}", error.getMessage()));
    }
} 