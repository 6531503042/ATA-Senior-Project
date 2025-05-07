package dev.bengi.userservice.service.impl;

import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import dev.bengi.userservice.domain.mapper.UserMapper;
import dev.bengi.userservice.exception.ErrorCode;
import dev.bengi.userservice.exception.GlobalServiceException;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import dev.bengi.userservice.config.security.jwt.JwtProvider;
import dev.bengi.userservice.domain.enums.RoleName;
import dev.bengi.userservice.domain.model.Role;
import dev.bengi.userservice.domain.model.User;
import dev.bengi.userservice.domain.payload.request.AddUserRequest;
import dev.bengi.userservice.domain.payload.request.LoginRequest;
import dev.bengi.userservice.domain.payload.request.RegisterRequest;
import dev.bengi.userservice.domain.payload.response.AuthResponse;
import dev.bengi.userservice.domain.payload.response.JwtResponse;
import dev.bengi.userservice.domain.payload.response.UserResponse;
import dev.bengi.userservice.repository.DepartmentRepository;
import dev.bengi.userservice.repository.UserRepository;
import dev.bengi.userservice.service.RoleService;
import dev.bengi.userservice.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    //Inject via lombok
    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final PasswordEncoder passwordEncoder;
    private final ModelMapper modelMapper;
    private final RoleService roleService;
    private final JwtProvider jwtProvider;
    private final UserMapper userMapper;

    @Override
    public Mono<User> findById(Long userId) {
        return userRepository.findById(userId)
                .switchIfEmpty(Mono.error(new GlobalServiceException(ErrorCode.USER_NOT_FOUND)));
    }

    @Override
    public Mono<User> findByUsername(String username) {
        return userRepository.findByUsername(username)
                .switchIfEmpty(Mono.error(new GlobalServiceException(ErrorCode.USER_NOT_FOUND)));
    }

//     Core business logic methods
@Override
public Mono<User> register(RegisterRequest register) {
    log.info("Starting registration for user: {}", register.getUsername());

    return userRepository.existsByUsername(register.getUsername())
            .flatMap(usernameExists -> {
                if (usernameExists) {
                    log.warn("Registration failed: Username {} is already taken", register.getUsername());
                    return Mono.error(new GlobalServiceException(ErrorCode.USER_ALREADY_EXISTS));
                }
                return userRepository.existsByEmail(register.getEmail());
            })
            .flatMap(emailExists -> {
                if (emailExists) {
                    log.warn("Registration failed: Email {} is already taken", register.getEmail());
                    return Mono.error(new GlobalServiceException(ErrorCode.EMAIL_ALREADY_EXISTS));
                }

                User user = modelMapper.map(register, User.class);
                user.setPassword(passwordEncoder.encode(register.getPassword()));
                user.setAvatar(getTemporaryProfileImageUrl(register.getEmail()));
                user.setFullname(register.getFullname());
                user.setGender(register.getGender());

                // Determine which role to assign
                return selectedRole(register)
                        .switchIfEmpty(Mono.error(new GlobalServiceException(ErrorCode.ROLE_NOT_FOUND)))
                        .flatMap(role -> {
                            user.setRoles(Collections.singleton(role));
                            return userRepository.save(user);
                        });
            });
}

    @Override
    @Transactional
    public Mono<User> addNewUser(AddUserRequest request) {
        log.info("Creating new user with username: {}", request.getUsername());

        return userRepository.existsByUsername(request.getUsername())
                .flatMap(usernameExists -> {
                    if (usernameExists) {
                        return Mono.error(new GlobalServiceException(ErrorCode.USER_ALREADY_EXISTS));
                    }
                    return userRepository.existsByEmail(request.getEmail());
                })
                .flatMap(emailExists -> {
                    if (emailExists) {
                        return Mono.error(new GlobalServiceException(ErrorCode.EMAIL_ALREADY_EXISTS));
                    }

                    // Determine default role
                    return selectedRole(request)
                            .switchIfEmpty(Mono.error(new GlobalServiceException(ErrorCode.ROLE_NOT_FOUND)))
                            .flatMap(defaultRole -> {
                                User user = User.builder()
                                        .username(request.getUsername())
                                        .fullname(request.getFullname())
                                        .email(request.getEmail())
                                        .gender(request.getGender())
                                        .password(passwordEncoder.encode(request.getPassword()))
                                        .avatar(request.getAvatar() != null ? request.getAvatar() : getTemporaryProfileImageUrl(request.getEmail()))
                                        .roles(Set.of(defaultRole))
                                        .projectAuthorities(new HashSet<>())

                                        // Department related
                                        .team(request.getTeam())
                                        .managerId(request.getManagerId())
                                        .teamRole(request.getTeamRole())
                                        .build();

                                return userRepository.save(user);
                            });
                });
    }


    @Override
    @Transactional
    public Mono<User> updateUser(Long userId, AddUserRequest request) {
        log.info("Updating user with id: {}", userId);

        return userRepository.findById(userId)
                .switchIfEmpty(Mono.error(new GlobalServiceException(ErrorCode.USER_NOT_FOUND)))

                .flatMap(user -> {
                    // First, check if the username is already taken
                    return userRepository.existsByUsername(request.getUsername())
                            .flatMap(usernameTaken -> {
                                if (!user.getUsername().equals(request.getUsername()) && usernameTaken) {
                                    return Mono.error(new GlobalServiceException(ErrorCode.USER_ALREADY_EXISTS));
                                }

                                // Then check if the email is already taken
                                return userRepository.existsByEmail(request.getEmail())
                                        .flatMap(emailTaken -> {
                                            if (!user.getEmail().equals(request.getEmail()) && emailTaken) {
                                                return Mono.error(new GlobalServiceException(ErrorCode.EMAIL_ALREADY_EXISTS));
                                            }

                                            // Proceed to update user if both checks pass
                                            user.setUsername(request.getUsername());
                                            user.setFullname(request.getFullname());
                                            user.setEmail(request.getEmail());
                                            user.setGender(request.getGender());
                                            user.setAvatar(request.getAvatar() != null ? request.getAvatar() : user.getAvatar());

                                            // Password update if provided
                                            if (request.getPassword() != null && !request.getPassword().isEmpty()) {
                                                user.setPassword(passwordEncoder.encode(request.getPassword()));
                                            }

                                            // Update department if needed
                                            if (request.getDepartmentId() != null) {
                                                return departmentRepository.findById(request.getDepartmentId())
                                                        .flatMap(department -> {
                                                            user.setDepartment(department);
                                                            return Mono.just(user);  // Proceed after department is set
                                                        })
                                                        .switchIfEmpty(Mono.just(user));  // If no department is found, continue
                                            }

                                            return Mono.just(user);  // If no department change, just continue
                                        });
                            });
                })

                .flatMap(user -> {
                    // Update user fields
                    user.setUsername(request.getUsername());
                    user.setFullname(request.getFullname());
                    user.setEmail(request.getEmail());
                    user.setGender(request.getGender());
                    user.setAvatar(request.getAvatar() != null ? request.getAvatar() : user.getAvatar());

                    // Only update password if provided
                    if (request.getPassword() != null && !request.getPassword().isEmpty()) {
                        user.setPassword(passwordEncoder.encode(request.getPassword()));
                    }

                    // Update department if needed
                    if (request.getDepartmentId() != null) {
                        return departmentRepository.findById(request.getDepartmentId())
                                .flatMap(department -> {
                                    user.setDepartment(department);
                                    return Mono.just(user);  // Proceed after department is set
                                })
                                .switchIfEmpty(Mono.just(user));  // If no department is found, continue
                    }

                    return Mono.just(user);  // If no department change, just continue
                })

                .flatMap(user -> {
                    // Update other fields (Team, Manager, Role etc.)
                    user.setTeam(request.getTeam());
                    user.setManagerId(request.getManagerId());
                    user.setTeamRole(request.getTeamRole());

                    // Save the updated user
                    return userRepository.save(user);
                });
    }



    @Override
    @Transactional(readOnly = true)
    public Mono<JwtResponse> login(LoginRequest loginRequest) {
        // Find user by username or email and perform authentication
        log.info("Attempting login for user: {}", loginRequest.getUsername());
        
        return userRepository.findByUsernameOrEmailWithRoles(loginRequest.getUsername())
                .collectList()
                .flatMap(userList -> {
                    if (userList.isEmpty()) {
                        log.error("User not found with username or email: {}", loginRequest.getUsername());
                        return Mono.error(new GlobalServiceException(ErrorCode.USER_NOT_FOUND));
                    }
                    
                    // Take the first user since username/email should be unique
                    User user = userList.get(0);
                    
                    log.debug("User found: {}", user.getUsername());
                    
                    // Directly verify password instead of using authenticationManager
                    if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
                        log.error("Invalid password for user: {}", user.getUsername());
                        return Mono.error(new GlobalServiceException(ErrorCode.INVALID_CREDENTIALS));
                    }
                    
                    log.info("User authenticated successfully: {}", user.getUsername());

                    // Ensure we have the roles loaded
                    if (user.getRoles() == null || user.getRoles().isEmpty()) {
                        log.warn("User has no roles assigned: {}", user.getUsername());
                    } else {
                        log.debug("User has {} roles assigned", user.getRoles().size());
                    }

                    // Create authorities manually
                    List<SimpleGrantedAuthority> authorities = user.getRoles().stream()
                            .map(role -> new SimpleGrantedAuthority(role.getName()))
                            .collect(Collectors.toList());
                            
                    // Create authentication without triggering the authentication manager
                    Authentication authentication = new UsernamePasswordAuthenticationToken(
                            user.getUsername(), null, authorities); // null for credentials as already verified
                    
                    // Set authentication in security context
                    SecurityContextHolder.getContext().setAuthentication(authentication);

                    // Generate JWT token
                    String accessToken = jwtProvider.createToken(authentication);
                    String refreshToken = jwtProvider.createRefreshToken(authentication);

                    // Create auth response
                    AuthResponse authResponse = buildAuthResponse(user);

                    // Return JWT response
                    JwtResponse response = JwtResponse.builder()
                            .accessToken(accessToken)
                            .refreshToken(refreshToken)
                            .auth(authResponse)
                            .build();

                    return Mono.just(response);
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
                    log.info("User deleted successfully: {}", user.getUsername());
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
        if (!jwtProvider.validateToken(refreshToken)) {
            return Mono.error(new BadCredentialsException("Invalid refresh token"));
        }

        String username = jwtProvider.getUserNameFromToken(refreshToken);
        return userRepository.findByUsername(username)
                .switchIfEmpty(Mono.error(new GlobalServiceException(ErrorCode.USER_NOT_FOUND)))
                .flatMap(user -> {
                    // Create authentication object
                    List<SimpleGrantedAuthority> authorities = user.getRoles().stream()
                            .map(role -> new SimpleGrantedAuthority(role.getName()))
                            .collect(Collectors.toList());
                    
                    Authentication authentication = new UsernamePasswordAuthenticationToken(username, null, authorities);
                    
                    // Generate new tokens
                    String accessToken = jwtProvider.createToken(authentication);
                    String newRefreshToken = jwtProvider.createRefreshToken(authentication);
                    
                    // Build response
                    AuthResponse authResponse = buildAuthResponse(user);
                    JwtResponse response = JwtResponse.builder()
                            .accessToken(accessToken)
                            .refreshToken(newRefreshToken)
                            .auth(authResponse)
                            .build();
                    
                    return Mono.just(response);
                });
    }

    @Override
    public Mono<Page<UserResponse>> findAllUser(Pageable pageable) {
        // Using the ReactiveCrudRepository with a wrapper approach
        return userRepository.findAll()
            .collectList()
            .map(users -> {
                // Create a page manually with the results
                List<UserResponse> userResponses = users.stream()
                    .skip(pageable.getOffset())
                    .limit(pageable.getPageSize())
                    .map(this::mapUserToUserResponse)
                    .collect(Collectors.toList());
                
                // Create a custom Page implementation and cast the result to the interface type
                return (Page<UserResponse>) new PageImpl<UserResponse>(
                    userResponses,
                    pageable,
                    users.size()
                );
            })
            .doOnError(e -> log.error("Error fetching users: {}", e.getMessage()));
    }

    @Override
    public Mono<List<UserResponse>> findAllUsers() {
        return userRepository.findAllWithCollections()
            .map(this::mapUserToUserResponse)
            .collectList()
            .doOnSuccess(users -> log.debug("Fetched {} users from the database with all collections", users.size()))
            .doOnError(e -> log.error("Error fetching all users: {}", e.getMessage()));
    }


    @Override
    @Transactional
    public Mono<Boolean> addProjectAuthority(Long userId, Long projectId) {
        return findById(userId)
                .switchIfEmpty(Mono.error(new GlobalServiceException(ErrorCode.USER_NOT_FOUND)))
                .flatMap(user -> {
                    user.getProjectAuthorities().add(projectId);
                    return userRepository.save(user)
                            .thenReturn(true);
                })
                .doOnSuccess(success -> log.info("Added project authority {} to user {}", projectId, userId))
                .onErrorResume(e -> {
                    log.error("Error adding project authority: {}", e.getMessage());
                    return Mono.just(false);
                });
    }


    @Override
    @Transactional
    public Mono<Boolean> removeProjectAuthority(Long userId, Long projectId) {
        return findById(userId)
                .switchIfEmpty(Mono.error(new GlobalServiceException(ErrorCode.USER_NOT_FOUND)))
            .flatMap(user -> {
                user.getProjectAuthorities().remove(projectId);
                return userRepository.save(user).thenReturn(true);
            })
            .doOnSuccess(success -> log.info("Removed project authority {} from user {}", projectId, userId))
            .doOnError(e -> log.error("Error removing project authority: {}", e.getMessage()));
    }

    @Override
    @Transactional(readOnly = true)
    public Mono<Boolean> hasProjectAuthority(Long userId, Long projectId) {
        return findById(userId)
                .switchIfEmpty(Mono.error(new GlobalServiceException(ErrorCode.USER_NOT_FOUND)))
            .map(user -> {
                boolean hasAuthority = user.getProjectAuthorities().contains(projectId);
                log.debug("User {} {} project authority {}", userId, hasAuthority ? "has" : "does not have", projectId);
                return hasAuthority;
            })
            .doOnError(e -> log.error("Error checking project authority: {}", e.getMessage()));
    }


    @Override
    @Transactional(readOnly = true)
    public Mono<Set<Long>> getUserProjectAuthorities(Long userId) {
        return findById(userId)
                .switchIfEmpty(Mono.error(new GlobalServiceException(ErrorCode.USER_NOT_FOUND)))
            .map(user -> {
                Set<Long> authorities = new HashSet<>(user.getProjectAuthorities());
                log.debug("Found {} project authorities for user {}", authorities.size(), userId);
                return authorities;
            })
            .doOnError(e -> log.error("Error getting user project authorities: {}", e.getMessage()));
    }

    @Override
    @Transactional(readOnly = true)
    public Mono<Set<User>> getUsersByProjectId(Long projectId) {
        return userRepository.findAll()
                .filter(user -> user.getProjectAuthorities().contains(projectId))
                .collect(Collectors.toSet())
                .doOnSuccess(users -> log.debug("Found {} users for project {}", users.size(), projectId))
                .doOnError(e -> log.error("Error getting users by project id: {}", e.getMessage()));
    }

    private Mono<Role> selectedRole(RegisterRequest registerRequest) {
        if (registerRequest.getRoles() != null && registerRequest.getRoles().contains("Admin")) {
            return roleService.findByName(RoleName.ROLE_ADMIN);
        }
        return roleService.findByName(RoleName.ROLE_USER);
    }
    
    private Mono<Role> selectedRole(AddUserRequest request) {
        if (request.getRoles() != null && request.getRoles().contains("Admin")) {
            return roleService.findByName(RoleName.ROLE_ADMIN);
        }
        return roleService.findByName(RoleName.ROLE_USER);
    }

    // Helper methods
    private String getTemporaryProfileImageUrl(String email) {
        return "https://robohash.org/" + email + "?set=set2&size=180x180";
    }

    private AuthResponse buildAuthResponse(User user) {
        return userMapper.toAuthResponse(user);
    }

    private UserResponse mapUserToUserResponse(User user) {
        return userMapper.toUserResponse(user);
    }
}
