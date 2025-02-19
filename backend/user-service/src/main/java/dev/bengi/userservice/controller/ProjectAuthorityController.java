package dev.bengi.userservice.controller;

import dev.bengi.userservice.domain.model.User;
import dev.bengi.userservice.domain.payload.response.AuthResponse;
import dev.bengi.userservice.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/manager/project-authority")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class ProjectAuthorityController {

    private final UserService userService;
    private final ModelMapper modelMapper;

    @PostMapping("/add/{userId}/{projectId}")
    public ResponseEntity<Boolean> addProjectAuthority(
            @PathVariable Long userId,
            @PathVariable Long projectId) {
        log.info("Adding project authority {} to user {}", projectId, userId);
        return ResponseEntity.ok(userService.addProjectAuthority(userId, projectId).block());
    }

    @DeleteMapping("/remove/{userId}/{projectId}")
    public ResponseEntity<Boolean> removeProjectAuthority(
            @PathVariable Long userId,
            @PathVariable Long projectId) {
        log.info("Removing project authority {} from user {}", projectId, userId);
        return ResponseEntity.ok(userService.removeProjectAuthority(userId, projectId).block());
    }

    @GetMapping("/check/{userId}/{projectId}")
    public ResponseEntity<Boolean> hasProjectAuthority(
            @PathVariable Long userId,
            @PathVariable Long projectId) {
        log.info("Checking if user {} has project authority {}", userId, projectId);
        return ResponseEntity.ok(userService.hasProjectAuthority(userId, projectId).block());
    }

    @GetMapping("/users/{projectId}")
    public ResponseEntity<List<AuthResponse>> getUsersByProjectId(
            @PathVariable Long projectId) {
        log.info("Getting users for project {}", projectId);
        Set<User> users = userService.getUsersByProjectId(projectId).block();
        List<AuthResponse> responses = users.stream()
                .map(user -> {
                    AuthResponse response = modelMapper.map(user, AuthResponse.class);
                    response.setRoles(user.getRoles().stream()
                            .map(role -> role.getName().name())
                            .collect(Collectors.toList()));
                    return response;
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }
} 