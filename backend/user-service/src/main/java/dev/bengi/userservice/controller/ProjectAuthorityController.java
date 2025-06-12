package dev.bengi.userservice.controller;

import java.util.Set;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import dev.bengi.userservice.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;

@Slf4j
@RestController
@RequestMapping("/api/project-authorities")
@RequiredArgsConstructor
public class ProjectAuthorityController {

    private final UserService userService;

    @PostMapping("/{userId}/{projectId}")
    @PreAuthorize("hasRole('ADMIN')")
    public Mono<ResponseEntity<Boolean>> addProjectAuthority(
            @PathVariable Long userId,
            @PathVariable Long projectId) {
        log.info("Adding project authority: User ID {} for Project ID {}", userId, projectId);
        return userService.addProjectAuthority(userId, projectId)
                .map(ResponseEntity::ok);
    }

    @DeleteMapping("/{userId}/{projectId}")
    @PreAuthorize("hasRole('ADMIN')")
    public Mono<ResponseEntity<Boolean>> removeProjectAuthority(
            @PathVariable Long userId,
            @PathVariable Long projectId) {
        log.info("Removing project authority: User ID {} for Project ID {}", userId, projectId);
        return userService.removeProjectAuthority(userId, projectId)
                .map(ResponseEntity::ok);
    }

    @GetMapping("/user/{userId}")
    public Mono<ResponseEntity<Set<Long>>> getUserProjectAuthorities(
            @PathVariable Long userId) {
        log.info("Getting project authorities for User ID {}", userId);
        return userService.getUserProjectAuthorities(userId)
                .map(ResponseEntity::ok);
    }

    @GetMapping("/project/{projectId}")
    public Mono<ResponseEntity<Set<dev.bengi.userservice.domain.model.User>>> getUsersByProjectId(
            @PathVariable Long projectId) {
        log.info("Getting users for Project ID {}", projectId);
        return userService.getUsersByProjectId(projectId)
                .map(ResponseEntity::ok);
    }

    @GetMapping("/check/{userId}/{projectId}")
    public Mono<ResponseEntity<Boolean>> hasProjectAuthority(
            @PathVariable Long userId,
            @PathVariable Long projectId) {
        log.info("Checking if User ID {} has authority for Project ID {}", userId, projectId);
        return userService.hasProjectAuthority(userId, projectId)
                .map(ResponseEntity::ok);
    }
} 