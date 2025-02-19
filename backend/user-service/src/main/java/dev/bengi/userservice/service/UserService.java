package dev.bengi.userservice.service;

import dev.bengi.userservice.domain.model.User;
import dev.bengi.userservice.domain.payload.request.AddUserRequest;
import dev.bengi.userservice.domain.payload.request.ChangePasswordRequest;
import dev.bengi.userservice.domain.payload.request.ForgotPasswordRequest;
import dev.bengi.userservice.domain.payload.request.LoginRequest;
import dev.bengi.userservice.domain.payload.request.RegisterRequest;
import dev.bengi.userservice.domain.payload.response.AuthResponse;
import dev.bengi.userservice.domain.payload.response.JwtResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Mono;

import javax.management.relation.RoleNotFoundException;
import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface UserService {
    Mono<User> register(RegisterRequest register) throws RoleNotFoundException;

    Mono<Void> deleteUser(Long userId);

    Mono<User> updateUser(Long userId, AddUserRequest request);

    Mono<User> getUserById(Long userId);

    Mono<User> addNewUser(AddUserRequest user);

    Mono<Void> logout();

    Mono<JwtResponse> login(LoginRequest loginRequest);

    Optional<User> findById(Long userId);

    Optional<User> findByUsername(String username);

    Mono<JwtResponse> refreshToken(String refreshToken);

    Mono<Page<AuthResponse>> findAllUser(Pageable pageable);

    Mono<List<User>> findAllUsers();

    String textSendEmailChangePasswordSuccessfully(String username);

    @Transactional(readOnly = true)
    Mono<Boolean> hasProjectAuthority(Long userId, Long projectId);

    Mono<Set<Long>> getUserProjectAuthorities(Long userId);
    
    Mono<Boolean> addProjectAuthority(Long userId, Long projectId);
    
    Mono<Boolean> removeProjectAuthority(Long userId, Long projectId);
    
    Mono<Set<User>> getUsersByProjectId(Long projectId);
}
