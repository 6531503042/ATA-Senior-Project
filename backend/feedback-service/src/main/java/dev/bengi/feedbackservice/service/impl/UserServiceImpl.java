package dev.bengi.feedbackservice.service.impl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import dev.bengi.feedbackservice.client.UserClient;
import dev.bengi.feedbackservice.domain.payload.response.AuthResponse;
import dev.bengi.feedbackservice.domain.payload.response.UserDto;
import dev.bengi.feedbackservice.service.UserService;
import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserClient userClient;
    private static final Logger log = LoggerFactory.getLogger(UserServiceImpl.class);

    private UserDto mapToUserDto(AuthResponse authResponse) {
        return UserDto.builder()
                .id(authResponse.getId())
                .username(authResponse.getUsername())
                .email(authResponse.getEmail())
                .fullName(authResponse.getFullName())
                .department(authResponse.getDepartment())
                .position(authResponse.getPosition())
                .active(authResponse.isActive())
                .build();
    }

    private String getAuthToken() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getCredentials() != null) {
            return "Bearer " + authentication.getCredentials().toString();
        }
        log.error("No authentication token found in security context");
        throw new SecurityException("No authentication token available");
    }

    @Override
    public Mono<UserDto> getUserById(String userId) {
        log.debug("Getting user details for ID: {}", userId);
        try {
            Long id = Long.parseLong(userId);
            String token = getAuthToken();
            return Mono.just(userClient.getUserById(id, token))
                    .map(this::mapToUserDto)
                    .doOnSuccess(user -> log.debug("Successfully retrieved user: {}", user))
                    .doOnError(error -> log.error("Error retrieving user {}: {}", userId, error.getMessage()));
        } catch (NumberFormatException e) {
            log.error("Invalid user ID format: {}", userId);
            return Mono.empty();
        }
    }

    @Override
    public Mono<Boolean> validateUser(String userId) {
        log.debug("Validating user ID: {}", userId);
        try {
            String token = getAuthToken();
            // First try to validate as a numeric ID
            Long id = Long.parseLong(userId);
            return Mono.just(userClient.checkUserExists(id, token))
                    .doOnSuccess(exists -> log.debug("User {} exists: {}", userId, exists))
                    .doOnError(error -> log.error("Error validating user {}: {}", userId, error.getMessage()));
        } catch (NumberFormatException e) {
            // If not a numeric ID, try as username
            String token = getAuthToken();
            return Mono.just(userClient.checkUsernameExists(userId, token))
                    .doOnSuccess(exists -> log.debug("Username {} exists: {}", userId, exists))
                    .doOnError(error -> log.error("Error validating username {}: {}", userId, error.getMessage()));
        }
    }

    @Override
    public Mono<Boolean> validateUsers(Iterable<String> userIds) {
        log.debug("Validating multiple user IDs: {}", userIds);
        return Flux.fromIterable(userIds)
                .flatMap(this::validateUser)
                .all(exists -> exists)
                .doOnSuccess(allValid -> log.debug("All users valid: {}", allValid))
                .doOnError(error -> log.error("Error validating users: {}", error.getMessage()));
    }
} 