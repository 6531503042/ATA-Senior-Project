package dev.bengi.userservice.service.impl;

import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import dev.bengi.userservice.domain.mapper.UserMapper;
import dev.bengi.userservice.domain.model.Department;
import dev.bengi.userservice.domain.model.Role;
import dev.bengi.userservice.domain.model.User;
import dev.bengi.userservice.domain.payload.request.user.AddUserRequest;
import dev.bengi.userservice.domain.payload.request.user.LoginRequest;
import dev.bengi.userservice.domain.payload.request.user.RegisterRequest;
import dev.bengi.userservice.domain.payload.response.AuthResponse;
import dev.bengi.userservice.domain.payload.response.JwtResponse;
import dev.bengi.userservice.domain.payload.response.UserResponse;
import dev.bengi.userservice.domain.payload.response.UserWithDepartmentDTO;
import dev.bengi.userservice.exception.ErrorCode;
import dev.bengi.userservice.exception.GlobalServiceException;
import dev.bengi.userservice.domain.enums.RoleName;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import dev.bengi.userservice.config.security.jwt.JwtProvider;
import dev.bengi.userservice.repository.DepartmentRepository;
import dev.bengi.userservice.repository.UserRepository;
import dev.bengi.userservice.repository.RoleRepository;
import dev.bengi.userservice.service.RoleService;
import dev.bengi.userservice.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;
import org.springframework.data.r2dbc.core.R2dbcEntityTemplate;
import java.time.LocalDateTime;
import java.util.Arrays;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    //Inject via lombok
    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final RoleService roleService;
    private final JwtProvider jwtProvider;
    private final UserMapper userMapper;
    private final R2dbcEntityTemplate template;

    @Override
    public Mono<User> findById(Long userId) {
        return userRepository.findById(userId)
                .switchIfEmpty(Mono.error(new GlobalServiceException(ErrorCode.USER_NOT_FOUND)));
    }

    @Override
    @Transactional
    public Mono<User> register(RegisterRequest register) {
        return Mono.zip(
                userRepository.existsByEmail(register.getEmail()),
                selectedRole(register))
                .flatMap(tuple -> {
                    if (tuple.getT1()) {
                        return Mono.error(new GlobalServiceException(ErrorCode.EMAIL_ALREADY_EXISTS));
                    }

                    User user = User.builder()
                            .email(register.getEmail())
                            .password(passwordEncoder.encode(register.getPassword()))
                            .fullname(register.getFullname())
                            .active(true)
                            .createdAt(LocalDateTime.now())
                            .updatedAt(LocalDateTime.now())
                            .build();

                    return userRepository.save(user)
                            .flatMap(savedUser -> roleService.addRoleToUser(savedUser, tuple.getT2().getName())
                                    .thenReturn(savedUser));
                });
    }

    @Override
    @Transactional
    public Mono<User> addNewUser(AddUserRequest request) {
        log.info("Creating new user with email: {}", request.getEmail());

        return userRepository.existsByEmail(request.getEmail())
                .flatMap(exists -> {
                    if (exists) {
                        return Mono.error(new GlobalServiceException(ErrorCode.EMAIL_ALREADY_EXISTS));
                    }

                    return selectedRole(request)
                            .flatMap(role -> {
                                User user = User.builder()
                                        .email(request.getEmail())
                                        .password(passwordEncoder.encode(request.getPassword()))
                                        .fullname(request.getFullname())
                                        .departmentId(request.getDepartmentId())
                                        .roleId(role.getId())
                                        .active(true)
                                        .createdAt(LocalDateTime.now())
                                        .updatedAt(LocalDateTime.now())
                                        .build();

                                return userRepository.save(user)
                                        .flatMap(savedUser -> {
                                            savedUser.getRoles().add(role);
                                            return Mono.just(savedUser);
                                        });
                            });
                });
    }

    @Override
    @Transactional
    public Mono<User> updateUser(Long userId, AddUserRequest request) {
        return userRepository.findById(userId)
                .switchIfEmpty(Mono.error(new GlobalServiceException(ErrorCode.USER_NOT_FOUND)))
                .flatMap(user -> Mono.zip(
                        userRepository.existsByEmail(request.getEmail()),
                        selectedRole(request))
                        .flatMap(tuple -> {
                            if (!user.getEmail().equals(request.getEmail()) && tuple.getT1()) {
                                return Mono.error(new GlobalServiceException(ErrorCode.EMAIL_ALREADY_EXISTS));
                            }

                            user.setEmail(request.getEmail());
                            if (request.getPassword() != null && !request.getPassword().isEmpty()) {
                                user.setPassword(passwordEncoder.encode(request.getPassword()));
                            }
                            user.setFullname(request.getFullname());
                            user.setDepartmentId(request.getDepartmentId());
                            user.setUpdatedAt(LocalDateTime.now());

                            return userRepository.save(user)
                                    .flatMap(savedUser -> roleService.addRoleToUser(savedUser, tuple.getT2().getName())
                                            .thenReturn(savedUser));
                        }));
    }

    @Override
    @Transactional(readOnly = true)
    public Mono<JwtResponse> login(LoginRequest loginRequest) {
        return userRepository.findByEmailWithRoles(loginRequest.getEmail())
                .switchIfEmpty(Mono.error(new GlobalServiceException(ErrorCode.INVALID_CREDENTIALS)))
                .flatMap(user -> {
                    if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
                        return Mono.error(new GlobalServiceException(ErrorCode.INVALID_CREDENTIALS));
                    }

                    if (!user.isActive()) {
                        return Mono.error(new GlobalServiceException(ErrorCode.UNAUTHORIZED_ACCESS));
                    }

                    return loadUserRoles(user)
                            .map(userWithRoles -> {
                                String accessToken = jwtProvider.createToken(userWithRoles);
                                String refreshToken = jwtProvider.createRefreshToken(userWithRoles);
                                return new JwtResponse(accessToken, refreshToken, userMapper.toAuthResponse(userWithRoles));
                            });
                });
    }

    @Override
    public Mono<Void> logout() {
        return Mono.fromRunnable(SecurityContextHolder::clearContext);
    }

    //delete
    @Override
    public Mono<Void> deleteUser(Long userId) {
        return userRepository.findById(userId)
                .switchIfEmpty(Mono.error(new GlobalServiceException(ErrorCode.USER_NOT_FOUND)))
                .flatMap(user -> {
                    log.info("User deleted successfully: {}", user.getEmail());
                    return userRepository.delete(user);
                });
    }

    @Override
    public Mono<User> getUserById(Long userId) {
        return userRepository.findById(userId)
                .switchIfEmpty(Mono.error(new GlobalServiceException(ErrorCode.USER_NOT_FOUND)))
                .doOnError(error -> log.error("Error retrieving user: {}", error.getMessage()));
    }

    @Override
    public Mono<JwtResponse> refreshToken(String refreshToken) {
        return userRepository.findByEmail(jwtProvider.getUserNameFromToken(refreshToken))
                .switchIfEmpty(Mono.error(new GlobalServiceException(ErrorCode.USER_NOT_FOUND)))
                .flatMap(this::loadUserRoles)
                .map(user -> {
                    String accessToken = jwtProvider.createToken(user);
                    String newRefreshToken = jwtProvider.createRefreshToken(user);
                    return new JwtResponse(accessToken, newRefreshToken, userMapper.toAuthResponse(user));
                });
    }

    @Override
    public Mono<Page<UserResponse>> findAllUser(Pageable pageable) {
        return userRepository.findAllWithCollections()
                .flatMap(user -> loadUserRoles(user))
                .collectList()
                .map(users -> {
                    int start = (int) pageable.getOffset();
                    int end = Math.min((start + pageable.getPageSize()), users.size());

                    List<UserResponse> pageContent = users.subList(start, end).stream()
                            .map(userMapper::toUserResponse)
                            .collect(Collectors.toList());

                    return new PageImpl<>(pageContent, pageable, users.size());
                });
    }

    @Override
    public Mono<List<UserResponse>> findAllUsers() {
        return userRepository.findAllWithCollections()
                .flatMap(user -> loadUserRoles(user))
                .map(userMapper::toUserResponse)
                .collectList();
    }

    @Override
    @Transactional
    public Mono<Boolean> addProjectAuthority(Long userId, Long projectId) {
        return userRepository.findById(userId)
                .map(user -> {
                    user.getProjectAuthorities().add(projectId);
                    return user;
                })
                .flatMap(userRepository::save)
                .map(user -> true)
                .defaultIfEmpty(false);
    }

    @Override
    @Transactional
    public Mono<Boolean> removeProjectAuthority(Long userId, Long projectId) {
        return userRepository.findById(userId)
                .map(user -> {
                    user.getProjectAuthorities().remove(projectId);
                    return user;
                })
                .flatMap(userRepository::save)
                .map(user -> true)
                .defaultIfEmpty(false);
    }

    @Override
    public Mono<Boolean> hasProjectAuthority(Long userId, Long projectId) {
        return userRepository.findById(userId)
                .map(user -> user.getProjectAuthorities().contains(projectId))
                .defaultIfEmpty(false);
    }

    @Override
    public Mono<Set<Long>> getUserProjectAuthorities(Long userId) {
        return userRepository.findById(userId)
                .map(User::getProjectAuthorities);
    }

    @Override
    public Mono<Set<User>> getUsersByProjectId(Long projectId) {
        return userRepository.findAllWithCollections()
                .filter(user -> user.getProjectAuthorities().contains(projectId))
                .collect(Collectors.toSet());
    }

    @Override
    public Mono<UserWithDepartmentDTO> getUserWithDepartment(Long userId) {
        return userRepository.findById(userId)
                .zipWith(departmentRepository.findById(userId))
                .map(tuple -> createUserWithDepartmentDTO(tuple.getT1(), tuple.getT2()));
    }

    @Override
    public Mono<List<UserWithDepartmentDTO>> getAllUsersWithDepartment() {
        return userRepository.findAll()
                .flatMap(user -> departmentRepository.findById(user.getDepartmentId())
                        .map(department -> createUserWithDepartmentDTO(user, department)))
                .collectList();
    }

    private Mono<Role> selectedRole(RegisterRequest request) {
        return request.getRoles() != null && !request.getRoles().isEmpty()
                ? roleService.findByName(request.getRoles().iterator().next())
                : roleService.findByName("ROLE_USER");
    }
    
    private Mono<Role> selectedRole(AddUserRequest request) {
        return request.getRoles() != null && !request.getRoles().isEmpty()
                ? roleService.findByName(request.getRoles().iterator().next())
                : roleService.findByName("ROLE_USER");
    }

    // Helper method for creating UserWithDepartmentDTO
    private UserWithDepartmentDTO createUserWithDepartmentDTO(User user, Department department) {
        return UserWithDepartmentDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullname(user.getFullname())
                .departmentId(department.getId())
                .departmentName(department.getName())
                .build();
    }

    private Mono<User> loadUserRoles(User user) {
        return roleRepository.findById(user.getRoleId())
                .map(role -> {
                    user.getRoles().add(role);
                    return user;
                })
                .switchIfEmpty(Mono.error(new GlobalServiceException(ErrorCode.ROLE_NOT_FOUND)));
    }
}
