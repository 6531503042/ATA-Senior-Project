package dev.bengi.feedbackservice.service;

import dev.bengi.feedbackservice.domain.payload.response.UserDto;
import reactor.core.publisher.Mono;

public interface UserService {
    Mono<UserDto> getUserById(String userId);
    Mono<Boolean> validateUser(String userId);
    Mono<Boolean> validateUsers(Iterable<String> userIds);
} 