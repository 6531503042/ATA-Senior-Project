package dev.bengi.main.modules.user.service;

import dev.bengi.main.exception.ErrorCode;
import dev.bengi.main.exception.GlobalServiceException;
import dev.bengi.main.modules.user.dto.JwtResponse;
import dev.bengi.main.modules.user.dto.LoginRequest;
import dev.bengi.main.modules.user.dto.RegisterRequest;
import dev.bengi.main.modules.user.dto.TokenValidationResponse;
import dev.bengi.main.modules.user.model.User;
import dev.bengi.main.modules.user.repository.UserRepository;
import dev.bengi.main.security.JwtProvider;
import dev.bengi.main.security.SecurityAuditService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Mono;

import java.util.List;
import java.time.LocalDateTime;
import dev.bengi.main.common.pagination.PageRequest;
import dev.bengi.main.common.pagination.PageResponse;
import dev.bengi.main.common.pagination.PaginationService;
import dev.bengi.main.modules.user.dto.UserResponseDto;
import dev.bengi.main.modules.user.dto.DepartmentSummaryDto;
import reactor.core.publisher.Flux;
import java.util.HashSet;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;
    private final SecurityAuditService auditService;
    private final PaginationService paginationService;

    public Mono<JwtResponse> login(LoginRequest login) {
        return login(login, "unknown");
    }

    public Mono<JwtResponse> login(LoginRequest login, String clientIp) {
        return userRepository.findByUsername(login.username())
                .switchIfEmpty(Mono.defer(() -> {
                    auditService.logFailedAuthentication(login.username(), clientIp, "User not found");
                    return Mono.error(new GlobalServiceException(ErrorCode.UNAUTHORIZED, "Invalid credentials"));
                }))
                .flatMap(user -> userRepository.findRoleNamesByUsername(user.getUsername()).collectList()
                        .map(roleNames -> {
                            user.setRoles(new java.util.HashSet<>(roleNames));
                            return user;
                        }))
                .flatMap(user -> {
                    if (!passwordEncoder.matches(login.password(), user.getPassword())) {
                        auditService.logFailedAuthentication(login.username(), clientIp, "Invalid password");
                        return Mono.error(new GlobalServiceException(ErrorCode.UNAUTHORIZED, "Invalid credentials"));
                    }
                    
                    // Update last login time
                    user.setLastLoginAt(LocalDateTime.now());
                    
                    List<String> roles = user.getRoles().isEmpty() ? List.of("USER") : user.getRoles().stream().toList();
                    String access = jwtProvider.createToken(user.getUsername(), roles);
                    String refresh = jwtProvider.createRefreshToken(user.getUsername());
                    
                    // Log successful authentication
                    auditService.logSuccessfulAuthentication(user.getUsername(), clientIp);
                    log.info("User {} logged in successfully from IP: {}", user.getUsername(), clientIp);
                    
                    return userRepository.save(user)
                            .map(savedUser -> new JwtResponse(access, refresh, savedUser.getId(), savedUser.getUsername(), savedUser.getEmail(), roles));
                });
    }

    @Transactional
    public Mono<Void> register(RegisterRequest register) {
        return userRepository.existsByUsername(register.username())
                .flatMap(exists -> exists
                        ? Mono.error(new GlobalServiceException(ErrorCode.CONFLICT, "Username already exists"))
                        : Mono.just(Boolean.FALSE))
                .then(userRepository.existsByEmail(register.email()))
                .flatMap(exists -> exists
                        ? Mono.error(new GlobalServiceException(ErrorCode.CONFLICT, "Email already exists"))
                        : Mono.just(Boolean.FALSE))
                .then(Mono.defer(() -> {
                    User user = new User();
                    user.setUsername(register.username());
                    user.setEmail(register.email());
                    user.setPassword(passwordEncoder.encode(register.password()));
                    return userRepository.save(user).then();
                }));
    }

    public Mono<TokenValidationResponse> validate(String bearerToken) {
        if (bearerToken == null || !bearerToken.startsWith("Bearer ")) {
            return Mono.just(new TokenValidationResponse(false, null, null, List.of(), "Missing token"));
        }
        String token = bearerToken.substring(7);
        if (!jwtProvider.validateToken(token)) {
            return Mono.just(new TokenValidationResponse(false, null, null, List.of(), "Invalid token"));
        }
        String username = jwtProvider.getUsernameFromToken(token);
        List<String> roles = jwtProvider.getRoles(token);
        return userRepository.findByUsername(username)
                .map(u -> new TokenValidationResponse(true, u.getId(), u.getUsername(), roles, "OK"))
                .switchIfEmpty(Mono.just(new TokenValidationResponse(false, null, username, roles, "User not found")));
    }

    public Mono<JwtResponse> refreshToken(String refreshToken) {
        if (refreshToken == null || refreshToken.isEmpty()) {
            return Mono.error(new GlobalServiceException(ErrorCode.BAD_REQUEST, "Refresh token is required"));
        }

        if (!jwtProvider.validateToken(refreshToken)) {
            return Mono.error(new GlobalServiceException(ErrorCode.UNAUTHORIZED, "Invalid refresh token"));
        }

        String username = jwtProvider.getUsernameFromToken(refreshToken);
        
        return userRepository.findByUsername(username)
                .switchIfEmpty(Mono.error(new GlobalServiceException(ErrorCode.NOT_FOUND, "User not found")))
                .flatMap(user -> userRepository.findRoleNamesByUsername(user.getUsername()).collectList()
                        .map(roleNames -> {
                            user.setRoles(new java.util.HashSet<>(roleNames));
                            return user;
                        }))
                .map(user -> {
                    List<String> roles = user.getRoles().isEmpty() ? List.of("USER") : user.getRoles().stream().toList();
                    String newAccessToken = jwtProvider.createToken(user.getUsername(), roles);
                    String newRefreshToken = jwtProvider.createRefreshToken(user.getUsername());
                    
                    log.info("Token refreshed successfully for user: {}", user.getUsername());
                    return new JwtResponse(newAccessToken, newRefreshToken, user.getId(), user.getUsername(), user.getEmail(), roles);
                });
    }

    public Mono<PageResponse<UserResponseDto>> getUsersByDepartmentId(Long departmentId, PageRequest pageRequest) {
        return userRepository.findByDepartmentId(departmentId)
                .map(this::mapToUserResponseDto)
                .collectList()
                .flatMap(users -> paginationService.paginateInMemory(Flux.fromIterable(users), pageRequest))
                .doOnSuccess(d -> log.info("Found {} users for department {}", 
                    d.getContent().size(), departmentId));
    }

    private UserResponseDto mapToUserResponseDto(User user) {
        // Create a DepartmentSummaryDto for the user's department
        Set<DepartmentSummaryDto> departments = new HashSet<>();
        if (user.getDepartmentId() != null) {
            departments.add(new DepartmentSummaryDto(user.getDepartmentId(), "Department"));
        }

        return new UserResponseDto(
            user.getId(),
            user.getUsername(),
            user.getEmail(),
            user.getFirstName(),
            user.getLastName(),
            user.getPhone(),
            departments,
            user.getRoles(),
            user.isActive(),
            user.getLastLoginAt(),
            user.getCreatedAt(),
            user.getUpdatedAt()
        );
    }

    public Mono<Void> assignUserToDepartment(Long userId, Long departmentId) {
        return userRepository.findById(userId)
                .switchIfEmpty(Mono.error(new GlobalServiceException(ErrorCode.NOT_FOUND, "User not found")))
                .flatMap(user -> {
                    user.setDepartmentId(departmentId);
                    return userRepository.save(user);
                })
                .doOnSuccess(v -> log.info("User {} assigned to department {}", userId, departmentId))
                .then();
    }
}



