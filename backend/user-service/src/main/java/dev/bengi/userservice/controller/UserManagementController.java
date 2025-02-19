package dev.bengi.userservice.controller;

import dev.bengi.userservice.domain.model.User;
import dev.bengi.userservice.exception.wrapper.UserNotFoundException;
import dev.bengi.userservice.http.HeaderGenerator;
import dev.bengi.userservice.domain.payload.request.AddUserRequest;
import dev.bengi.userservice.domain.payload.response.AuthResponse;
import dev.bengi.userservice.domain.payload.response.ResponseMessage;
import dev.bengi.userservice.security.jwt.JwtProvider;
import dev.bengi.userservice.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/manager")
@RequiredArgsConstructor
@Tag(name = "User Management", description = "APIs for managing users")
@CrossOrigin(origins = "*", maxAge = 3600)
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class UserManagementController {
    private final UserService userService;
    private final ModelMapper modelMapper;
    private final JwtProvider jwtProvider;
    private final HeaderGenerator headerGenerator;

    @PostMapping("/create-user")
    @Operation(summary = "Create new user", description = "Create a new user with specified roles (Admin only)")
    public Mono<ResponseEntity<ResponseMessage>> createUser(
            @Valid @RequestBody AddUserRequest request) {
        log.info("Creating new user with username: {}", request.getUsername());
        return userService.addNewUser(request)
                .map(user -> ResponseEntity.status(HttpStatus.CREATED)
                        .headers(headerGenerator.getHeadersForSuccessPostMethod(null, null))
                        .body(new ResponseMessage("User created successfully: " + user.getUsername())))
                .doOnError(error -> log.error("Error creating user: {}", error.getMessage()));
    }

    @DeleteMapping("/delete-user/{userId}")
    @Operation(summary = "Delete user", description = "Delete a user by ID (Admin only)")
    public Mono<ResponseEntity<ResponseMessage>> deleteUser(
            @Parameter(description = "User ID to delete")
            @PathVariable Long userId) {
        log.info("Deleting user with ID: {}", userId);
        return userService.deleteUser(userId)
                .then(Mono.just(ResponseEntity.ok()
                        .headers(headerGenerator.getHeadersForSuccessGetMethod())
                        .body(new ResponseMessage("User deleted successfully"))))
                .doOnError(error -> log.error("Error deleting user: {}", error.getMessage()));
    }

    @PutMapping("/update-user/{userId}")
    @Operation(summary = "Update user", description = "Update a user's information by ID (Admin only)")
    public Mono<ResponseEntity<User>> updateUser(
            @Parameter(description = "User ID to update")
            @PathVariable Long userId,
            @Valid @RequestBody AddUserRequest request) {
        log.info("Updating user with ID: {}", userId);
        return userService.updateUser(userId, request)
                .map(user -> ResponseEntity.ok()
                        .headers(headerGenerator.getHeadersForSuccessGetMethod())
                        .body(user))
                .doOnError(error -> log.error("Error updating user: {}", error.getMessage()));
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get user by ID", description = "Retrieve a user's information by ID (Admin only)")
    public Mono<ResponseEntity<AuthResponse>> getUserById(
            @Parameter(description = "User ID to retrieve")
            @PathVariable Long userId) {
        log.info("Fetching user with ID: {}", userId);
        return userService.getUserById(userId)
                .map(user -> {
                    AuthResponse response = modelMapper.map(user, AuthResponse.class);
                    response.setRoles(user.getRoles().stream()
                            .map(role -> role.getName().name())
                            .collect(Collectors.toList()));
                    return ResponseEntity.ok()
                            .headers(headerGenerator.getHeadersForSuccessGetMethod())
                            .body(response);
                })
                .doOnError(error -> log.error("Error fetching user: {}", error.getMessage()));
    }

    @GetMapping("/all")
    @Operation(summary = "Get all users with pagination", description = "Retrieve all users with pagination (Admin only)")
    public Mono<ResponseEntity<Page<AuthResponse>>> getAllUsersWithPagination(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "ASC") String sortOrder) {

        log.info("Fetching users page {} with size {}", page, size);
        Sort.Direction direction = sortOrder.equalsIgnoreCase("DESC") ? Sort.Direction.DESC : Sort.Direction.ASC;
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(direction, sortBy));

        return userService.findAllUser(pageRequest)
                .map(ResponseEntity::ok)
                .doOnError(error -> log.error("Error fetching users with pagination: {}", error.getMessage()))
                .onErrorResume(e -> Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(null))); // Handle error case gracefully
    }


    @GetMapping("/list")
    @Operation(summary = "Get all users without pagination", description = "Retrieve all users without pagination (Admin only)")
    public Mono<ResponseEntity<List<AuthResponse>>> getAllUsers() {
        log.info("Fetching all users without pagination");
        return userService.findAllUsers()
                .map(users -> {
                    List<AuthResponse> responses = users.stream()
                            .map(user -> {
                                AuthResponse response = modelMapper.map(user, AuthResponse.class);
                                response.setRoles(user.getRoles().stream()
                                        .map(role -> role.getName().name())
                                        .collect(Collectors.toList()));
                                log.debug("Mapped user {} to response {}", user.getUsername(), response);
                                return response;
                            })
                            .collect(Collectors.toList());
                    return ResponseEntity.ok(responses);
                })
                .doOnError(error -> log.error("Error fetching users without pagination: {}", error.getMessage()))
                .onErrorResume(e -> Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Collections.emptyList()))); // Return empty list on error
    }


    @GetMapping("/info")
    @PreAuthorize("hasAuthority('ROLE_USER')")
    @Operation(summary = "Get user info", description = "Get current user's information")
    public Mono<ResponseEntity<AuthResponse>> getUserInfo(
            @Parameter(description = "JWT token with Bearer prefix")
            @RequestHeader(value = "Authorization", required = true) String token) {
        try {
            String jwtToken = token.startsWith("Bearer ") ? token.substring(7) : token;
            String username = jwtProvider.getUserNameFromToken(jwtToken);
            
            log.info("Fetching user info for username: {}", username);
            
            return Mono.just(userService.findByUsername(username)
                    .map(user -> {
                        AuthResponse response = modelMapper.map(user, AuthResponse.class);
                        response.setRoles(user.getRoles().stream()
                                .map(role -> role.getName().name())
                                .collect(Collectors.toList()));
                        return ResponseEntity.ok()
                                .headers(headerGenerator.getHeadersForSuccessGetMethod())
                                .body(response);
                    })
                    .orElseThrow(() -> {
                        log.error("User not found: {}", username);
                        return new UserNotFoundException("User not found: " + username);
                    }));
        } catch (Exception e) {
            log.error("Error retrieving user information: {}", e.getMessage());
            return Mono.error(new UserNotFoundException("Error retrieving user information: " + e.getMessage()));
        }
    }

    @GetMapping("/exists/{userId}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_USER')")
    @Operation(summary = "Check if user exists", description = "Check if a user exists by ID")
    public ResponseEntity<Boolean> checkUserExists(
            @Parameter(description = "User ID to check")
            @PathVariable Long userId) {
        log.debug("Checking if user exists with ID: {}", userId);
        return ResponseEntity.ok(userService.findById(userId).isPresent());
    }

    @GetMapping("/validate-username/{username}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_USER')")
    @Operation(summary = "Check if username exists", description = "Check if a user exists by username")
    public ResponseEntity<Boolean> checkUsernameExists(
            @Parameter(description = "Username to check")
            @PathVariable String username) {
        log.debug("Checking if user exists with username: {}", username);
        return ResponseEntity.ok(userService.findByUsername(username).isPresent());
    }
}
