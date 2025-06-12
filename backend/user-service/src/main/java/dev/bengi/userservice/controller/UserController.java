package dev.bengi.userservice.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import dev.bengi.userservice.domain.payload.request.user.AddUserRequest;
import dev.bengi.userservice.domain.payload.response.ResponseMessage;
import dev.bengi.userservice.domain.payload.response.UserResponse;
import dev.bengi.userservice.http.HeaderGenerator;
import dev.bengi.userservice.security.RequirePermissions;
import dev.bengi.userservice.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;

@Slf4j
@RestController
@RequestMapping("/api/manager")
@RequiredArgsConstructor
@Tag(name = "User Management", description = "APIs for managing users")
@CrossOrigin(origins = "*", maxAge = 3600)
public class UserController {

    private final UserService userService;
    private final HeaderGenerator headerGenerator;

    @PostMapping("/create")
    @RequirePermissions("users:create")
    @Operation(summary = "Create new user", description = "Create a new user with specified roles")
    public Mono<ResponseEntity<UserResponse>> createUser(
            @Valid @RequestBody AddUserRequest request) {
        return userService.addNewUser(request)
                .map(user -> ResponseEntity.ok()
                        .headers(headerGenerator.getHeadersForSuccessGetMethod())
                        .body(UserResponse.fromUser(user)))
                .doOnError(error -> log.error("Error creating user: {}", error.getMessage()));
    }

    @DeleteMapping("/delete/{userId}")
    @RequirePermissions("users:delete")
    @Operation(summary = "Delete user", description = "Delete a user by ID")
    public Mono<ResponseEntity<ResponseMessage>> deleteUser(
            @Parameter(description = "User ID to delete")
            @PathVariable Long userId) {
        return userService.deleteUser(userId)
                .then(Mono.just(ResponseEntity.ok()
                        .headers(headerGenerator.getHeadersForSuccessGetMethod())
                        .body(new ResponseMessage("User deleted successfully"))))
                .doOnError(error -> log.error("Error deleting user: {}", error.getMessage()));
    }

    @PutMapping("/update/{userId}")
    @RequirePermissions("users:update")
    @Operation(summary = "Update user", description = "Update a user's information by ID")
    public Mono<ResponseEntity<UserResponse>> updateUser(
            @Parameter(description = "User ID to update")
            @PathVariable Long userId,
            @Valid @RequestBody AddUserRequest request) {
        return userService.updateUser(userId, request)
                .map(user -> ResponseEntity.ok()
                        .headers(headerGenerator.getHeadersForSuccessGetMethod())
                        .body(UserResponse.fromUser(user)))
                .doOnError(error -> log.error("Error updating user: {}", error.getMessage()));
    }

    @GetMapping("/get/{userId}")
    @RequirePermissions("users:read:id")
    @Operation(summary = "Get user by ID", description = "Retrieve a user's information by ID")
    public Mono<ResponseEntity<UserResponse>> getUserById(
            @Parameter(description = "User ID to retrieve")
            @PathVariable Long userId) {
        return userService.getUserById(userId)
                .map(user -> {
                    UserResponse response = UserResponse.fromUser(user);
                    return ResponseEntity.ok(response);
                })
                .onErrorResume(e -> Mono.just(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new UserResponse())));
    }

    @GetMapping("/all")
    @RequirePermissions("users:read")
    @Operation(summary = "Get all users with pagination", description = "Retrieve all users with pagination")
    public Mono<ResponseEntity<Page<UserResponse>>> getAllUsersWithPagination(
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
                        .body(Page.empty())));
    }

    @GetMapping("/list")
    @RequirePermissions("users:read")
    @Operation(summary = "Get all users without pagination", description = "Retrieve all users without pagination")
    public Mono<ResponseEntity<List<UserResponse>>> getAllUsers() {
        return userService.findAllUsers()
                .map(users -> ResponseEntity.ok()
                        .headers(headerGenerator.getHeadersForSuccessGetMethod())
                        .body(users));
    }

    @GetMapping("/exists/{userId}")
    @RequirePermissions("users:read")
    @Operation(summary = "Check if user exists", description = "Check if a user exists by ID")
    public Mono<ResponseEntity<Boolean>> checkUserExists(
            @Parameter(description = "User ID to check")
            @PathVariable Long userId) {
        return userService.findById(userId)
                .map(user -> ResponseEntity.ok(true))
                .defaultIfEmpty(ResponseEntity.ok(false));
    }
}
