package dev.bengi.userservice.service;

import dev.bengi.userservice.domain.model.User;
import dev.bengi.userservice.payload.request.AddUserRequest;
import dev.bengi.userservice.payload.request.ChangePasswordRequest;
import dev.bengi.userservice.payload.request.ForgotPasswordRequest;
import dev.bengi.userservice.payload.request.LoginRequest;
import dev.bengi.userservice.payload.request.RegisterRequest;
import dev.bengi.userservice.payload.response.AuthResponse;
import dev.bengi.userservice.payload.response.JwtResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import reactor.core.publisher.Mono;

import java.util.Optional;

public interface UserService {
    Mono<User> register(RegisterRequest register);

    Mono<Void> deleteUser(Long userId);

    Mono<User> updateUser(Long userId, AddUserRequest request);

    Mono<User> getUserById(Long userId);

    Mono<User> addNewUser(AddUserRequest user);

    Mono<Void> logout();

    Mono<String> changePassword(ChangePasswordRequest request);

    Mono<JwtResponse> login(LoginRequest loginRequest);

    Mono<JwtResponse> refreshToken(String refreshToken);

    Optional<User> findById(Long userId);

    Optional<User> findByUsername(String username);

    Mono<Page<AuthResponse>> findAllUser(Pageable pageable);

    String textSendEmailChangePasswordSuccessfully(String username);

    Mono<Void> forgotPassword(ForgotPasswordRequest request);
    
    Mono<Void> resetPassword(String token, String newPassword);
}
