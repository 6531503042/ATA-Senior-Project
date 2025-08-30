package dev.bengi.main.modules.user.controller;

import dev.bengi.main.common.pagination.PageResponse;
import dev.bengi.main.common.pagination.PaginationService;
import dev.bengi.main.modules.user.dto.UserResponseDto;
import dev.bengi.main.modules.user.dto.UserCreateRequestDto;
import dev.bengi.main.modules.user.dto.UserUpdateRequestDto;
import dev.bengi.main.modules.user.dto.ChangePasswordRequestDto;
import dev.bengi.main.modules.user.dto.UserRoleUpdateRequestDto;
import dev.bengi.main.modules.user.service.UserManagementService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.Map;

/**
 * User Management Controller
 * Handles CRUD operations for users with proper authorization
 */
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserManagementService userManagementService;
    private final PaginationService paginationService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public Mono<ResponseEntity<PageResponse<UserResponseDto>>> listUsers(ServerWebExchange exchange) {
        var pageRequest = paginationService.parsePageRequest(exchange);
        return userManagementService.findAllUsers(pageRequest)
                .map(ResponseEntity::ok);
    }

    @GetMapping("/stats")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public Mono<ResponseEntity<Map<String, Object>>> getUserStats() {
        return userManagementService.getUserStats()
                .map(ResponseEntity::ok);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or authentication.name == @userManagementService.getUsernameById(#id)")
    public Mono<ResponseEntity<UserResponseDto>> getUser(@PathVariable Long id) {
        return userManagementService.findUserById(id)
                .map(ResponseEntity::ok);
    }

    @GetMapping("/me")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public Mono<ResponseEntity<UserResponseDto>> getCurrentUser(Authentication auth) {
        String username = auth.getName();
        return userManagementService.findUserByUsername(username)
                .map(ResponseEntity::ok);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Mono<ResponseEntity<UserResponseDto>> createUser(@Valid @RequestBody UserCreateRequestDto request) {
        return userManagementService.createUser(request)
                .map(user -> ResponseEntity.status(HttpStatus.CREATED).body(user));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or authentication.name == @userManagementService.getUsernameById(#id)")
    public Mono<ResponseEntity<UserResponseDto>> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UserUpdateRequestDto request,
            Authentication auth) {
        
        // If user is updating themselves, restrict certain fields
        boolean isSelfUpdate = !auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        
        return userManagementService.updateUser(id, request, isSelfUpdate)
                .map(ResponseEntity::ok);
    }

    @PutMapping("/{id}/password")
    @PreAuthorize("hasRole('ADMIN') or authentication.name == @userManagementService.getUsernameById(#id)")
    public Mono<ResponseEntity<Void>> changePassword(
            @PathVariable Long id,
            @Valid @RequestBody ChangePasswordRequestDto request,
            Authentication auth) {
        
        boolean isSelfUpdate = !auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        
        return userManagementService.changePassword(id, request, isSelfUpdate)
                .thenReturn(ResponseEntity.ok().build());
    }

    @PutMapping("/{id}/roles")
    @PreAuthorize("hasRole('ADMIN')")
    public Mono<ResponseEntity<UserResponseDto>> updateUserRoles(
            @PathVariable Long id,
            @Valid @RequestBody UserRoleUpdateRequestDto request) {
        return userManagementService.updateUserRoles(id, request)
                .map(ResponseEntity::ok);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Mono<ResponseEntity<Void>> deleteUser(@PathVariable Long id, Authentication auth) {
        String currentUsername = auth.getName();
        return userManagementService.deleteUser(id, currentUsername)
                .thenReturn(ResponseEntity.noContent().build());
    }

    @PutMapping("/{id}/activate")
    @PreAuthorize("hasRole('ADMIN')")
    public Mono<ResponseEntity<UserResponseDto>> activateUser(@PathVariable Long id) {
        return userManagementService.activateUser(id)
                .map(ResponseEntity::ok);
    }

    @PutMapping("/{id}/deactivate")
    @PreAuthorize("hasRole('ADMIN')")
    public Mono<ResponseEntity<UserResponseDto>> deactivateUser(@PathVariable Long id) {
        return userManagementService.deactivateUser(id)
                .map(ResponseEntity::ok);
    }

    @GetMapping("/search")
    @PreAuthorize("hasRole('ADMIN')")
    public Mono<ResponseEntity<PageResponse<UserResponseDto>>> searchUsers(
            @RequestParam String query,
            ServerWebExchange exchange) {
        var pageRequest = paginationService.parsePageRequest(exchange);
        pageRequest.setSearch(query);
        return userManagementService.searchUsers(pageRequest)
                .map(ResponseEntity::ok);
    }

    @GetMapping("/by-role/{roleName}")
    @PreAuthorize("hasRole('ADMIN')")
    public Mono<ResponseEntity<PageResponse<UserResponseDto>>> getUsersByRole(
            @PathVariable String roleName,
            ServerWebExchange exchange) {
        var pageRequest = paginationService.parsePageRequest(exchange);
        return userManagementService.findUsersByRole(roleName, pageRequest)
                .map(ResponseEntity::ok);
    }
}
