package dev.bengi.userservice.service.impl;

import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import dev.bengi.userservice.domain.enums.RoleName;
import dev.bengi.userservice.domain.model.Role;
import dev.bengi.userservice.domain.model.User;
import dev.bengi.userservice.domain.payload.request.AddUserRequest;
import dev.bengi.userservice.domain.payload.request.LoginRequest;
import dev.bengi.userservice.domain.payload.request.RegisterRequest;
import dev.bengi.userservice.domain.payload.response.AuthResponse;
import dev.bengi.userservice.domain.payload.response.JwtResponse;
import dev.bengi.userservice.domain.payload.response.UserResponse;
import dev.bengi.userservice.exception.EmailOrUsernameNotFoundException;
import dev.bengi.userservice.exception.RoleNotFoundException;
import dev.bengi.userservice.exception.wrapper.UserNotFoundException;
import dev.bengi.userservice.repository.DepartmentRepository;
import dev.bengi.userservice.repository.RoleRepository;
import dev.bengi.userservice.repository.UserRepository;
import dev.bengi.userservice.security.jwt.JwtProvider;
import dev.bengi.userservice.security.userPrinciple.UserPrinciple;
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
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final DepartmentRepository departmentRepository;
    private final PasswordEncoder passwordEncoder;
    private final ModelMapper modelMapper;
    private final RoleService roleService;
    private final JwtProvider jwtProvider;
    private final AuthenticationManager authenticationManager;

    // Helper methods
    private String getTemporaryProfileImageUrl(String email) {
        return "https://robohash.org/" + email + "?set=set2&size=180x180";
    }

    private AuthResponse buildAuthResponse(User user) {
        Long departmentId = null;
        String departmentName = null;
        if (user.getDepartment() != null) {
            departmentId = user.getDepartment().getId();
            departmentName = user.getDepartment().getName();
        }
        
        return AuthResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullname(user.getFullname())
                .gender(user.getGender())
                .avatar(user.getAvatar())
                .departmentId(departmentId)
                .departmentName(departmentName)
                .roles(user.getRoles().stream()
                        .map(role -> role.getName().name())
                        .collect(Collectors.toList()))
                .build();
    }

    private UserResponse buildUserResponse(User user) {
        Long departmentId = null;
        String departmentName = null;
        if (user.getDepartment() != null) {
            departmentId = user.getDepartment().getId();
            departmentName = user.getDepartment().getName();
        }

        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullname(user.getFullname())
                .gender(user.getGender())
                .avatar(user.getAvatar())
                .departmentId(departmentId)
                .departmentName(departmentName)
                .roles(user.getRoles().stream()
                        .map(role -> role.getName().name())
                        .collect(Collectors.toList()))
                .team(user.getTeam())
                .managerId(user.getManagerId())
                .teamRole(user.getTeamRole())
                // Skills & Experience
                .skillLevel(user.getSkillLevel())
                .yearsOfExperience(user.getYearsOfExperience())
                .skills(user.getSkills())
                .skillProficiency(user.getSkillProficiency())
                .primarySkill(user.getPrimarySkill())
                .technologyStack(user.getTechnologyStack())
                // Employment & Work Details
                .employmentType(user.getEmploymentType())
                .workMode(user.getWorkMode())
                .joiningDate(user.getJoiningDate())
                .lastPromotionDate(user.getLastPromotionDate())
                .workAnniversary(user.getWorkAnniversary())
                .shiftType(user.getShiftType())
                .remoteWorkDays(user.getRemoteWorkDays())
                // Engagement & Activity Tracking
                .lastLogin(user.getLastLogin())
                .lastActiveTime(user.getLastActiveTime())
                .loginFrequency(user.getLoginFrequency())
                .accountStatus(user.getAccountStatus())
                .systemAccessLevel(user.getSystemAccessLevel())
                .preferredCommunication(user.getPreferredCommunication())
                // Personal & Social Details
                .nationality(user.getNationality())
                .languagesSpoken(user.getLanguagesSpoken())
                .preferredLanguage(user.getPreferredLanguage())
                .timezone(user.getTimezone())
                .linkedinProfile(user.getLinkedinProfile())
                .githubProfile(user.getGithubProfile())
                .build();
    }

    private JwtResponse buildJwtResponse(Authentication authentication, AuthResponse authResponse) {
        String jwt = jwtProvider.createToken(authentication);
        String refreshToken = jwtProvider.createRefreshToken(authentication);
        return JwtResponse.builder()
                .accessToken(jwt)
                .refreshToken(refreshToken)
                .auth(authResponse)
                .build();
    }

    // Repository delegate methods
    @Override
    public Optional<User> findById(Long userId) {
        return userRepository.findById(userId);
    }

    @Override
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

//     Core business logic methods
    @Override
    public Mono<User> register(RegisterRequest register) {
        return Mono.defer(() -> {
            try {
                log.info("Starting registration for user: {}", register.getUsername());

                if (userRepository.existsByUsername(register.getUsername())) {
                    log.warn("Registration failed: Username {} is already taken", register.getUsername());
                    return Mono.error(new EmailOrUsernameNotFoundException("Username is already taken."));
                }
                if (userRepository.existsByEmail(register.getEmail())) {
                    log.warn("Registration failed: Email {} is already taken", register.getEmail());
                    return Mono.error(new EmailOrUsernameNotFoundException("Email is already taken."));
                }

                User user = modelMapper.map(register, User.class);
                user.setPassword(passwordEncoder.encode(register.getPassword()));
                user.setAvatar(getTemporaryProfileImageUrl(register.getEmail()));
                
                // Logging to track fullname mapping
                log.info("Registering user - Username: {}, Fullname from request: {}", 
                    register.getUsername(), register.getFullname());
                
                // Explicitly set fullname and gender to ensure they are mapped correctly
                user.setFullname(register.getFullname());
                user.setGender(register.getGender());

                // Determine role based on input
                Role defaultRole;
                if (register.getRoles() != null && register.getRoles().contains("ADMIN")) {
                    defaultRole = roleService.findByName(RoleName.ROLE_ADMIN)
                            .orElseThrow(() -> new RoleNotFoundException("Admin role not found in the database."));
                } else {
                    defaultRole = roleService.findByName(RoleName.ROLE_USER)
                            .orElseThrow(() -> new RoleNotFoundException("Default role not found in the database."));
                }
                user.setRoles(Collections.singleton(defaultRole));

                log.info("Saving new user: {}", user.getUsername());
                User savedUser = userRepository.save(user);
                return Mono.just(savedUser);
            } catch (Exception e) {
                log.error("Unexpected error during registration: {}", e.getMessage(), e);
                return Mono.error(e);
            }
        });
    }


    @Override
    @Transactional
    public Mono<User> addNewUser(AddUserRequest request) {
        log.info("Creating new user with username: {}", request.getUsername());
        if (userRepository.existsByUsername(request.getUsername())) {
            return Mono.error(new RuntimeException("Username is already taken!"));
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            return Mono.error(new RuntimeException("Email is already in use!"));
        }

        User user = User.builder()
                .username(request.getUsername())
                .fullname(request.getFullname())
                .email(request.getEmail())
                .gender(request.getGender())
                .password(passwordEncoder.encode(request.getPassword()))
                .avatar(request.getAvatar() != null ? request.getAvatar() : getTemporaryProfileImageUrl(request.getEmail()))
                .roles(new HashSet<>())
                .projectAuthorities(new HashSet<>())
                // Department related
                .team(request.getTeam())
                .managerId(request.getManagerId())
                .teamRole(request.getTeamRole())
                // Skills & Experience
                .skillLevel(request.getSkillLevel())
                .yearsOfExperience(request.getYearsOfExperience())
                .skills(request.getSkills())
                .skillProficiency(request.getSkillProficiency())
                .primarySkill(request.getPrimarySkill())
                .technologyStack(request.getTechnologyStack())
                // Employment & Work Details
                .employmentType(request.getEmploymentType())
                .workMode(request.getWorkMode())
                .joiningDate(request.getJoiningDate())
                .lastPromotionDate(request.getLastPromotionDate())
                .shiftType(request.getShiftType())
                .remoteWorkDays(request.getRemoteWorkDays())
                // Personal & Social Details
                .nationality(request.getNationality())
                .languagesSpoken(request.getLanguagesSpoken())
                .preferredLanguage(request.getPreferredLanguage())
                .timezone(request.getTimezone())
                .linkedinProfile(request.getLinkedinProfile())
                .githubProfile(request.getGithubProfile())
                .build();

        // Default to USER if no roles specified
        Set<String> strRoles = request.getRoles();
        if (strRoles == null || strRoles.isEmpty()) {
            Role userRole = roleRepository.findByName(RoleName.ROLE_USER)
                    .orElseThrow(() -> new RuntimeException("Error: User Role is not found."));
            user.getRoles().add(userRole);
        } else {
            strRoles.forEach(role -> {
                try {
                    roleService.addRoleToUser(user, role);
                } catch (RoleNotFoundException e) {
                    log.error("Error adding role: {}", e.getMessage());
                }
            });
        }

        // Set department if provided
        if (request.getDepartmentId() != null) {
            departmentRepository.findById(request.getDepartmentId())
                    .ifPresent(user::setDepartment);
        }

        User savedUser = userRepository.save(user);
        return Mono.just(savedUser);
    }

    @Override
    @Transactional
    public Mono<User> updateUser(Long userId, AddUserRequest request) {
        log.info("Updating user with id: {}", userId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + userId));

        if (!user.getUsername().equals(request.getUsername()) && userRepository.existsByUsername(request.getUsername())) {
            return Mono.error(new RuntimeException("Username is already taken!"));
        }

        if (!user.getEmail().equals(request.getEmail()) && userRepository.existsByEmail(request.getEmail())) {
            return Mono.error(new RuntimeException("Email is already in use!"));
        }

        user.setUsername(request.getUsername());
        user.setFullname(request.getFullname());
        user.setEmail(request.getEmail());
        user.setGender(request.getGender());
        user.setAvatar(request.getAvatar() != null ? request.getAvatar() : user.getAvatar());
        
        // Only update password if provided
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        
        // Department related
        user.setTeam(request.getTeam());
        user.setManagerId(request.getManagerId());
        user.setTeamRole(request.getTeamRole());
        
        // Skills & Experience
        user.setSkillLevel(request.getSkillLevel());
        user.setYearsOfExperience(request.getYearsOfExperience());
        if (request.getSkills() != null) {
            user.setSkills(request.getSkills());
        }
        if (request.getSkillProficiency() != null) {
            user.setSkillProficiency(request.getSkillProficiency());
        }
        user.setPrimarySkill(request.getPrimarySkill());
        if (request.getTechnologyStack() != null) {
            user.setTechnologyStack(request.getTechnologyStack());
        }
        
        // Employment & Work Details
        user.setEmploymentType(request.getEmploymentType());
        user.setWorkMode(request.getWorkMode());
        user.setJoiningDate(request.getJoiningDate());
        user.setLastPromotionDate(request.getLastPromotionDate());
        user.setShiftType(request.getShiftType());
        user.setRemoteWorkDays(request.getRemoteWorkDays());
        
        // Personal & Social Details
        user.setNationality(request.getNationality());
        if (request.getLanguagesSpoken() != null) {
            user.setLanguagesSpoken(request.getLanguagesSpoken());
        }
        user.setPreferredLanguage(request.getPreferredLanguage());
        user.setTimezone(request.getTimezone());
        user.setLinkedinProfile(request.getLinkedinProfile());
        user.setGithubProfile(request.getGithubProfile());

        // Update roles if provided
        if (request.getRoles() != null && !request.getRoles().isEmpty()) {
            // Clear existing roles
            user.getRoles().clear();
            
            // Add new roles
            request.getRoles().forEach(role -> {
                try {
                    roleService.addRoleToUser(user, role);
                } catch (RoleNotFoundException e) {
                    log.error("Error adding role: {}", e.getMessage());
                }
            });
        }

        // Update department if provided
        if (request.getDepartmentId() != null) {
            departmentRepository.findById(request.getDepartmentId())
                    .ifPresent(user::setDepartment);
        } else if (request.getDepartmentId() == null) {
            // Remove department assignment if explicitly set to null
            user.setDepartment(null);
        }

        User updatedUser = userRepository.save(user);
        return Mono.just(updatedUser);
    }

    @Override
    @Transactional(readOnly = true)
    public Mono<JwtResponse> login(LoginRequest loginRequest) {
        return Mono.create(sink -> {
            try {
                // Find user by username or email
                User user = userRepository.findByUsernameOrEmail(loginRequest.getUsername())
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));

                // Create authentication token
                Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()
                    )
                );

                // Set authentication in security context
                SecurityContextHolder.getContext().setAuthentication(authentication);

                // Generate JWT token
                String accessToken = jwtProvider.createToken(authentication);
                String refreshToken = jwtProvider.createRefreshToken(authentication);

                // Get user details
                UserPrinciple userPrinciple = (UserPrinciple) authentication.getPrincipal();
                List<String> roles = userPrinciple.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .collect(Collectors.toList());

                // Create auth response
                AuthResponse authResponse = AuthResponse.builder()
                    .id(userPrinciple.getId())
                    .username(userPrinciple.getUsername())
                    .fullname(userPrinciple.getFullName())
                    .email(userPrinciple.getEmail())
                    .gender(userPrinciple.getGender())
                    .avatar(userPrinciple.getAvatar())
                    .roles(roles)
                    .build();

                // Create JWT response
                JwtResponse response = JwtResponse.builder()
                    .accessToken(accessToken)
                    .refreshToken(refreshToken)
                    .auth(authResponse)
                    .build();

                sink.success(response);

            } catch (AuthenticationException e) {
                sink.error(new BadCredentialsException("Invalid username or password"));
            } catch (Exception e) {
                sink.error(new RuntimeException("Error during authentication", e));
            }
        });
    }

    @Override
    public Mono<Void> logout() {
        return Mono.fromRunnable(SecurityContextHolder::clearContext);
    }

    //delete
    @Override
    public Mono<Void> deleteUser(Long userId) {
        return Mono.defer(() -> {
            try {
                User user = findById(userId)
                        .orElseThrow(() -> new UserNotFoundException("User not found with id: " + userId));
                userRepository.delete(user);
                log.info("User deleted successfully: {}", user.getUsername());
                return Mono.empty();
            } catch (Exception e) {
                log.error("Error deleting user: {}", e.getMessage());
                return Mono.error(e);
            }
        });
    }

    @Override
    public Mono<User> getUserById(Long userId) {
        return Mono.defer(() -> {
            try {
                User user = findById(userId)
                        .orElseThrow(() -> new UserNotFoundException("User not found with id: " + userId));
                return Mono.just(user);
            } catch (Exception e) {
                log.error("Error retrieving user: {}", e.getMessage());
                return Mono.error(e);
            }
        });
    }


    @Override
    public Mono<JwtResponse> refreshToken(String refreshToken) {
        return Mono.defer(() -> {
            try {
                if (!jwtProvider.validateToken(refreshToken)) {
                    return Mono.error(new BadCredentialsException("Invalid refresh token"));
                }

                String username = jwtProvider.getUserNameFromToken(refreshToken);
                User user = findByUsername(username)
                        .orElseThrow(() -> new UserNotFoundException("User not found"));

                List<SimpleGrantedAuthority> authorities = user.getRoles().stream()
                        .map(role -> new SimpleGrantedAuthority(role.getName().name()))
                        .collect(Collectors.toList());

                Authentication authentication = new UsernamePasswordAuthenticationToken(username, null, authorities);
                AuthResponse authResponse = buildAuthResponse(user);
                JwtResponse response = buildJwtResponse(authentication, authResponse);

                return Mono.just(response);
            } catch (Exception e) {
                return Mono.error(e);
            }
        });
    }

    @Override
    public Mono<Page<UserResponse>> findAllUser(Pageable pageable) {
        try {
            Page<User> users = userRepository.findAll(pageable);
            Page<UserResponse> userResponses = users.map(user -> {
                // Manual mapping instead of ModelMapper to avoid LazyInitializationException
                UserResponse response = UserResponse.builder()
                        .id(user.getId())
                        .username(user.getUsername())
                        .fullname(user.getFullname())
                        .email(user.getEmail())
                        .avatar(user.getAvatar())
                        .gender(user.getGender())
                        .roles(user.getRoles().stream()
                               .map(role -> role.getName().name())
                               .collect(Collectors.toList()))
                        .build();
                
                // Set department info if available
                if (user.getDepartment() != null) {
                    response.setDepartmentId(user.getDepartment().getId());
                    response.setDepartmentName(user.getDepartment().getName());
                }
                
                // Set other fields that may not need collections
                response.setTeam(user.getTeam());
                response.setManagerId(user.getManagerId());
                response.setTeamRole(user.getTeamRole());
                response.setSkillLevel(user.getSkillLevel());
                response.setYearsOfExperience(user.getYearsOfExperience());
                response.setPrimarySkill(user.getPrimarySkill());
                response.setEmploymentType(user.getEmploymentType());
                response.setWorkMode(user.getWorkMode());
                response.setJoiningDate(user.getJoiningDate());
                response.setLastPromotionDate(user.getLastPromotionDate());
                response.setWorkAnniversary(user.getWorkAnniversary());
                response.setShiftType(user.getShiftType());
                response.setRemoteWorkDays(user.getRemoteWorkDays());
                response.setLastLogin(user.getLastLogin());
                response.setLastActiveTime(user.getLastActiveTime());
                response.setLoginFrequency(user.getLoginFrequency());
                response.setAccountStatus(user.getAccountStatus());
                response.setSystemAccessLevel(user.getSystemAccessLevel());
                response.setPreferredCommunication(user.getPreferredCommunication());
                response.setNationality(user.getNationality());
                response.setPreferredLanguage(user.getPreferredLanguage());
                response.setTimezone(user.getTimezone());
                response.setLinkedinProfile(user.getLinkedinProfile());
                response.setGithubProfile(user.getGithubProfile());
                
                // Safely copy collections
                if (user.getSkills() != null) {
                    response.setSkills(new HashSet<>(user.getSkills()));
                }
                if (user.getSkillProficiency() != null) {
                    response.setSkillProficiency(new HashMap<>(user.getSkillProficiency()));
                }
                if (user.getTechnologyStack() != null) {
                    response.setTechnologyStack(new HashSet<>(user.getTechnologyStack()));
                }
                if (user.getLanguagesSpoken() != null) {
                    response.setLanguagesSpoken(new HashSet<>(user.getLanguagesSpoken()));
                }
                
                return response;
            });
            return Mono.just(userResponses);
        } catch (Exception e) {
            log.error("Error fetching users: {}", e.getMessage());
            return Mono.error(e);
        }
    }

    @Override
    public Mono<List<User>> findAllUsers() {
        try {
            List<User> users = userRepository.findAllWithCollections();
            log.debug("Fetched {} users from the database with all collections", users.size());
            return Mono.just(users);
        } catch (Exception e) {
            log.error("Error fetching all users: {}", e.getMessage());
            return Mono.error(e);
        }
    }


    @Override
    public String textSendEmailChangePasswordSuccessfully(String username) {
        return String.format("""
                Hey %s!

                This is a confirmation that your password has been successfully changed.
                If you did not initiate this change, please contact our support team immediately.
                If you have any questions or concerns, feel free to reach out to us.

                Best regards:
                Contact: nimittanbooutor@gmail.com
                Fanpage: https://bengi-portfolio.vercel.app/
                """, username);
    }


    @Override
    @Transactional
    public Mono<Boolean> addProjectAuthority(Long userId, Long projectId) {
        return Mono.defer(() -> {
            try {
                User user = findById(userId)
                        .orElseThrow(() -> new UserNotFoundException("User not found with id: " + userId));

                user.getProjectAuthorities().add(projectId);
                userRepository.save(user);
                log.info("Added project authority {} to user {}", projectId, userId);
                return Mono.just(true);
            } catch (Exception e) {
                log.error("Error adding project authority: {}", e.getMessage());
                return Mono.error(e);
            }
        });
    }

    @Override
    @Transactional
    public Mono<Boolean> removeProjectAuthority(Long userId, Long projectId) {
        return Mono.defer(() -> {
            try {
                User user = findById(userId)
                        .orElseThrow(() -> new UserNotFoundException("User not found with id: " + userId));

                user.getProjectAuthorities().remove(projectId);
                userRepository.save(user);
                log.info("Removed project authority {} from user {}", projectId, userId);
                return Mono.just(true);
            } catch (Exception e) {
                log.error("Error removing project authority: {}", e.getMessage());
                return Mono.error(e);
            }
        });
    }

    @Override
    @Transactional(readOnly = true)
    public Mono<Boolean> hasProjectAuthority(Long userId, Long projectId) {
        return Mono.defer(() -> {
            try {
                User user = findById(userId)
                        .orElseThrow(() -> new UserNotFoundException("User not found with id: " + userId));

                boolean hasAuthority = user.getProjectAuthorities().contains(projectId);
                log.debug("User {} {} project authority {}", userId, hasAuthority ? "has" : "does not have", projectId);
                return Mono.just(hasAuthority);
            } catch (Exception e) {
                log.error("Error checking project authority: {}", e.getMessage());
                return Mono.error(e);
            }
        });
    }

    @Override
    @Transactional(readOnly = true)
    public Mono<Set<Long>> getUserProjectAuthorities(Long userId) {
        return Mono.defer(() -> {
            try {
                User user = findById(userId)
                        .orElseThrow(() -> new UserNotFoundException("User not found with id: " + userId));

                Set<Long> authorities = new HashSet<>(user.getProjectAuthorities());
                log.debug("Found {} project authorities for user {}", authorities.size(), userId);
                return Mono.just(authorities);
            } catch (Exception e) {
                log.error("Error getting user project authorities: {}", e.getMessage());
                return Mono.error(e);
            }
        });
    }

    @Override
    @Transactional(readOnly = true)
    public Mono<Set<User>> getUsersByProjectId(Long projectId) {
        return Mono.defer(() -> {
            try {
                Set<User> users = userRepository.findAll().stream()
                        .filter(user -> user.getProjectAuthorities().contains(projectId))
                        .collect(Collectors.toSet());
                log.debug("Found {} users for project {}", users.size(), projectId);
                return Mono.just(users);
            } catch (Exception e) {
                log.error("Error getting users by project id: {}", e.getMessage());
                return Mono.error(e);
            }
        });
    }
}
