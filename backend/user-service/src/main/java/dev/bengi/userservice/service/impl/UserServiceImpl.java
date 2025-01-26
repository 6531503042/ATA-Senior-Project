package dev.bengi.userservice.service.impl;

import dev.bengi.userservice.domain.model.Role;
import dev.bengi.userservice.domain.enums.RoleName;
import dev.bengi.userservice.domain.model.User;
import dev.bengi.userservice.domain.payload.request.*;
import dev.bengi.userservice.exception.EmailOrUsernameNotFoundException;
import dev.bengi.userservice.exception.RoleNotFoundException;
import dev.bengi.userservice.exception.wrapper.UserNotFoundException;
import dev.bengi.userservice.domain.payload.response.AuthResponse;
import dev.bengi.userservice.domain.payload.response.JwtResponse;
import dev.bengi.userservice.repository.UserRepository;
import dev.bengi.userservice.security.jwt.JwtProvider;
import dev.bengi.userservice.service.RoleService;
import dev.bengi.userservice.service.UserService;
import dev.bengi.userservice.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ModelMapper modelMapper;
    private final RoleService roleService;
    private final JwtProvider jwtProvider;
    private final AuthenticationManager authenticationManager;
//    private final EmailService emailService;
    @Value("${app.reset-password.token.expiration:900000}")
    private long resetPasswordTokenExpiration;

    // Helper methods
    private String getTemporaryProfileImageUrl(String email) {
        return "https://robohash.org/" + email + "?set=set2&size=180x180";
    }

    private AuthResponse buildAuthResponse(User user) {
        return AuthResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullname(user.getFullname())
                .gender(user.getGender())
                .avatar(user.getAvatar())
                .roles(user.getRoles().stream()
                        .map(role -> role.getName().name())
                        .collect(Collectors.toList()))
                .build();
    }

    private JwtResponse buildJwtResponse(Authentication authentication, AuthResponse authResponse) {
        String jwt = jwtProvider.createToken(authentication);
        String refreshToken = jwtProvider.createRefreshToken(authentication);
        return JwtResponse.builder()
                .accessToken(jwt)
                .refreshToken(refreshToken)
                .authResponse(authResponse)
                .build();
    }

    // Repository delegate methods
    @Override
    public Optional<User> findById(Long userId) {
        return userRepository.findById(userId);
    }

    @Override
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUserName(username);
    }

//     Core business logic methods
    @Override
    public Mono<User> register(RegisterRequest register) {
        return Mono.defer(() -> {
            try {
                log.info("Starting registration for user: {}", register.getUsername());

                if (userRepository.existsByUserName(register.getUsername())) {
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
                user.setFullname(register.getFullName());

                Role defaultRole = roleService.findByName(RoleName.USER)
                        .orElseThrow(() -> new RoleNotFoundException("Default role not found in the database."));
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
    public Mono<User> addNewUser(AddUserRequest user) {
        return Mono.defer(() -> {
            try {
                if (userRepository.existsByUserName(user.getUsername())) {
                    log.warn("Registration failed: Username {} is already taken", user.getUsername());
                    return Mono.error(new EmailOrUsernameNotFoundException("Username is already taken."));
                }
                if (userRepository.existsByEmail(user.getEmail())) {
                    log.warn("Registration failed: Email {} is already taken", user.getEmail());
                    return Mono.error(new EmailOrUsernameNotFoundException("Email is already taken."));
                }

                User newUser = modelMapper.map(user, User.class);
                newUser.setPassword(passwordEncoder.encode(user.getPassword()));
                newUser.setAvatar(getTemporaryProfileImageUrl(user.getEmail()));
                newUser.setFullname(user.getFullname());

                // Convert role strings to Role entities
                Set<Role> roles = new HashSet<>();
                for (String roleName : user.getRoles()) {
                    try {
                        RoleName roleEnum = RoleName.valueOf(roleName.toUpperCase());
                        Role role = roleService.findByName(roleEnum)
                                .orElseThrow(() -> new RoleNotFoundException("Role not found: " + roleName));
                        roles.add(role);
                    } catch (IllegalArgumentException e) {
                        log.error("Invalid role name: {}", roleName);
                        return Mono.error(new RoleNotFoundException("Invalid role name: " + roleName));
                    }
                }
                
                newUser.setRoles(roles);
                
                log.info("Saving new user: {} with roles: {}", newUser.getUsername(), 
                    roles.stream().map(role -> role.getName().name()).collect(Collectors.joining(", ")));
                    
                User savedUser = userRepository.save(newUser);
                return Mono.just(savedUser);
            } catch (Exception e) {
                log.error("Error creating new user: {}", e.getMessage());
                return Mono.error(e);
            }
        });
    }

    @Override
    public Mono<JwtResponse> login(LoginRequest loginRequest) {
        return Mono.defer(() -> {
            try {
                log.info("Attempting login for user: {}", loginRequest.getUsername());
                
                User user = userRepository.findByUserNameOrEmail(loginRequest.getUsername())
                        .orElseThrow(() -> new UserNotFoundException("User not found with username or email: " + loginRequest.getUsername()));

                log.info("Found user: {} with email: {}", user.getUsername(), user.getEmail());

                Authentication authentication = authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                user.getUsername(),
                                loginRequest.getPassword()
                        )
                );

                SecurityContextHolder.getContext().setAuthentication(authentication);

                AuthResponse authResponse = buildAuthResponse(user);
                JwtResponse response = buildJwtResponse(authentication, authResponse);

                log.info("Login successful for user: {}", user.getUsername());
                return Mono.just(response);
            } catch (Exception e) {
                log.error("Login error for user {}: {}", loginRequest.getUsername(), e.getMessage());
                return Mono.error(e);
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
    public Mono<User> updateUser(Long userId, AddUserRequest request) {
        return Mono.defer(() -> {
            try {
                User existingUser = findById(userId)
                        .orElseThrow(() -> new UserNotFoundException("User not found with id: " + userId));

                // Update fields if provided
                if (request.getUsername() != null && !request.getUsername().equals(existingUser.getUsername())) {
                    if (userRepository.existsByUserName(request.getUsername())) {
                        return Mono.error(new EmailOrUsernameNotFoundException("Username is already taken."));
                    }
                    existingUser.setUsername(request.getUsername());
                }

                if (request.getEmail() != null && !request.getEmail().equals(existingUser.getEmail())) {
                    if (userRepository.existsByEmail(request.getEmail())) {
                        return Mono.error(new EmailOrUsernameNotFoundException("Email is already taken."));
                    }
                    existingUser.setEmail(request.getEmail());
                }

                if (request.getPassword() != null) {
                    existingUser.setPassword(passwordEncoder.encode(request.getPassword()));
                }

                if (request.getFullname() != null) {
                    existingUser.setFullname(request.getFullname());
                }

                if (request.getRoles() != null && !request.getRoles().isEmpty()) {
                    Set<Role> roles = new HashSet<>();
                    for (String roleName : request.getRoles()) {
                        try {
                            RoleName roleEnum = RoleName.valueOf(roleName.toUpperCase());
                            Role role = roleService.findByName(roleEnum)
                                    .orElseThrow(() -> new RoleNotFoundException("Role not found: " + roleName));
                            roles.add(role);
                        } catch (IllegalArgumentException e) {
                            log.error("Invalid role name: {}", roleName);
                            return Mono.error(new RoleNotFoundException("Invalid role name: " + roleName));
                        }
                    }
                    existingUser.setRoles(roles);
                }

                log.info("Updating user: {}", existingUser.getUsername());
                User updatedUser = userRepository.save(existingUser);
                return Mono.just(updatedUser);
            } catch (Exception e) {
                log.error("Error updating user: {}", e.getMessage());
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
    public Mono<String> changePassword(ChangePasswordRequest request) {
        return Mono.defer(() -> {
            try {
                Authentication auth = SecurityContextHolder.getContext().getAuthentication();
                String username = auth.getName();

                User user = findByUsername(username)
                        .orElseThrow(() -> new UserNotFoundException("User not found"));

                if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
                    return Mono.error(new BadCredentialsException("Current password is incorrect"));
                }

                user.setPassword(passwordEncoder.encode(request.getNewPassword()));
                userRepository.save(user);

                return Mono.just(textSendEmailChangePasswordSuccessfully(username));
            } catch (Exception e) {
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
    public Mono<Page<AuthResponse>> findAllUser(Pageable pageable) {
        return Mono.fromCallable(() -> {
            Page<User> userPage = userRepository.findAll(pageable);
            return userPage.map(user -> {
                AuthResponse response = modelMapper.map(user, AuthResponse.class);
                response.setRoles(user.getRoles().stream()
                        .map(role -> role.getName().name())
                        .collect(Collectors.toList()));
                return response;
            });
        });
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

//    @Override
//    public Mono<Void> forgotPassword(ForgotPasswordRequest request) {
//        return Mono.defer(() -> {
//            try {
//                User user = userRepository.findByEmail(request.getEmail())
//                    .orElseThrow(() -> new UserNotFoundException("User not found with email: " + request.getEmail()));
//
//                String resetToken = jwtProvider.createPasswordResetToken(user.getUsername());
//                // Store the reset token with expiration
//                user.setResetPasswordToken(resetToken);
//                user.setResetPasswordTokenExpiry(new Date(System.currentTimeMillis() + resetPasswordTokenExpiration));
//                userRepository.save(user);
//
//                // Send email asynchronously
//                emailService.sendPasswordResetEmail(user.getEmail(), resetToken);
//                log.info("Password reset email sent to: {}", user.getEmail());
//
//                return Mono.empty();
//            } catch (Exception e) {
//                log.error("Error in forgot password process: {}", e.getMessage());
//                return Mono.error(e);
//            }
//        });
//    }

    @Override
    public Mono<Void> resetPassword(String token, String newPassword) {
        return Mono.defer(() -> {
            try {
                if (!jwtProvider.validateToken(token)) {
                    return Mono.error(new BadCredentialsException("Invalid or expired reset token"));
                }

                String username = jwtProvider.getUserNameFromToken(token);
                User user = findByUsername(username)
                    .orElseThrow(() -> new UserNotFoundException("User not found"));

                // Verify token hasn't expired
                if (user.getResetPasswordTokenExpiry() == null || 
                    user.getResetPasswordTokenExpiry().before(new Date()) ||
                    !token.equals(user.getResetPasswordToken())) {
                    return Mono.error(new BadCredentialsException("Invalid or expired reset token"));
                }

                // Update password
                user.setPassword(passwordEncoder.encode(newPassword));
                user.setResetPasswordToken(null);
                user.setResetPasswordTokenExpiry(null);
                userRepository.save(user);

                log.info("Password reset successful for user: {}", username);
                return Mono.empty();
            } catch (Exception e) {
                log.error("Error resetting password: {}", e.getMessage());
                return Mono.error(e);
            }
        });
    }
}
