package dev.bengi.feedbackservice.client;

import dev.bengi.feedbackservice.domain.payload.response.AuthResponse;
import dev.bengi.feedbackservice.domain.payload.response.TokenValidationResponse;
import dev.bengi.feedbackservice.config.FeignConfig;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@FeignClient(
    name = "user-service", 
    url = "${services.user-service.url}", 
    configuration = FeignConfig.class
)
public interface UserClient {
    @GetMapping("/api/manager/user/{userId}")
    AuthResponse getUserById(
        @PathVariable("userId") Long id,
        @RequestHeader("Authorization") String token
    );

    @GetMapping("/api/manager/exists/{userId}")
    boolean checkUserExists(
        @PathVariable Long userId,
        @RequestHeader("Authorization") String token
    );

    @GetMapping("/api/manager/validate-username/{username}")
    boolean checkUsernameExists(
        @PathVariable String username,
        @RequestHeader("Authorization") String token
    );

    @GetMapping("/api/auth/validate")
    TokenValidationResponse validateToken(
        @RequestHeader("Authorization") String token
    );

    @PostMapping("/api/manager/project-authority/add/{userId}/{projectId}")
    boolean addProjectAuthority(
        @PathVariable Long userId,
        @PathVariable Long projectId,
        @RequestHeader("Authorization") String token
    );

    @DeleteMapping("/api/manager/project-authority/remove/{userId}/{projectId}")
    boolean removeProjectAuthority(
        @PathVariable Long userId,
        @PathVariable Long projectId,
        @RequestHeader("Authorization") String token
    );

    @GetMapping("/api/manager/project-authority/check/{userId}/{projectId}")
    boolean hasProjectAuthority(
        @PathVariable Long userId,
        @PathVariable Long projectId,
        @RequestHeader("Authorization") String token
    );

    @GetMapping("/api/manager/project-authority/users/{projectId}")
    List<AuthResponse> getUsersByProjectId(
        @PathVariable Long projectId,
        @RequestHeader("Authorization") String token
    );
} 