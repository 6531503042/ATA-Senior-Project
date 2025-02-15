package dev.bengi.feedbackservice.service.impl;

import dev.bengi.feedbackservice.domain.payload.response.UserDto;
import dev.bengi.feedbackservice.foreign.UserClient;
import dev.bengi.feedbackservice.service.UserService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final WebClient userServiceWebClient;
    private final UserClient userClient;
    private static final Logger log = LoggerFactory.getLogger(UserServiceImpl.class);

    @Override
    public Mono<UserDto> getUserById(String userId) {
        log.debug("Getting user details for ID: {}", userId);
        try {
            Long id = Long.parseLong(userId);
            return Mono.just(userClient.getUserById(id))
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
            // First try to validate as a numeric ID
            Long id = Long.parseLong(userId);
            return Mono.just(userClient.checkUserExists(id).getBody())
                    .doOnSuccess(exists -> log.debug("User {} exists: {}", userId, exists))
                    .doOnError(error -> log.error("Error validating user {}: {}", userId, error.getMessage()));
        } catch (NumberFormatException e) {
            // If not a numeric ID, try as username
            return Mono.just(userClient.checkUsernameExists(userId).getBody())
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