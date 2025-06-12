package dev.bengi.userservice.service;

import java.util.List;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;

import dev.bengi.userservice.domain.model.User;
import dev.bengi.userservice.domain.payload.request.user.AddUserRequest;
import dev.bengi.userservice.domain.payload.request.user.LoginRequest;
import dev.bengi.userservice.domain.payload.request.user.RegisterRequest;
import dev.bengi.userservice.domain.payload.response.JwtResponse;
import dev.bengi.userservice.domain.payload.response.UserResponse;
import dev.bengi.userservice.domain.payload.response.UserWithDepartmentDTO;
import reactor.core.publisher.Mono;

public interface UserService {
    Mono<User> findById(Long userId);

    //     Core business logic methods
    Mono<User> register(RegisterRequest register);

    @Transactional
    Mono<User> addNewUser(AddUserRequest request);

    @Transactional
    Mono<User> updateUser(Long userId, AddUserRequest request);

    @Transactional(readOnly = true)
    Mono<JwtResponse> login(LoginRequest loginRequest);

    // Additional methods
    Mono<Void> logout();
    
    Mono<Void> deleteUser(Long userId);
    
    Mono<User> getUserById(Long userId);
    
    Mono<JwtResponse> refreshToken(String refreshToken);
    
    Mono<Page<UserResponse>> findAllUser(Pageable pageable);
    
    Mono<List<UserResponse>> findAllUsers();
    
    // New virtual pop methods
    Mono<UserWithDepartmentDTO> getUserWithDepartment(Long userId);
    Mono<List<UserWithDepartmentDTO>> getAllUsersWithDepartment();
    
    @Transactional
    Mono<Boolean> addProjectAuthority(Long userId, Long projectId);
    
    @Transactional
    Mono<Boolean> removeProjectAuthority(Long userId, Long projectId);
    
    @Transactional(readOnly = true)
    Mono<Boolean> hasProjectAuthority(Long userId, Long projectId);
    
    @Transactional(readOnly = true)
    Mono<Set<Long>> getUserProjectAuthorities(Long userId);
    
    @Transactional(readOnly = true)
    Mono<Set<User>> getUsersByProjectId(Long projectId);
}
