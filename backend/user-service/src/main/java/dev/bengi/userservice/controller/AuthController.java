package dev.bengi.userservice.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import dev.bengi.userservice.config.security.validate.AuthorityToken;
import dev.bengi.userservice.config.security.validate.TokenValidate;
import dev.bengi.userservice.domain.payload.request.LoginRequest;
import dev.bengi.userservice.domain.payload.request.RegisterRequest;
import dev.bengi.userservice.domain.payload.response.AuthResponse;
import dev.bengi.userservice.domain.payload.response.JwtResponse;
import dev.bengi.userservice.domain.payload.response.ResponseMessage;
import dev.bengi.userservice.domain.payload.response.TokenValidationResponse;
import dev.bengi.userservice.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final UserService userService;
    private final TokenValidate tokenValidate;
    private final AuthorityToken authorityToken;

    @PostMapping({"/register", "/signup"})
    public Mono<ResponseEntity<ResponseMessage>> register(@Valid @RequestBody RegisterRequest register) {
        log.info("Registering new user: {}", register.getUsername());
        return userService.register(register)
                .map(user -> {
                    log.info("User registered successfully: {}", register.getUsername());
                    return ResponseEntity.status(HttpStatus.CREATED)
                        .body(new ResponseMessage("Create user: " + register.getUsername() + " successfully."));
                })
                .onErrorResume(error -> {
                    log.error("Error registering user: {}", error.getMessage());
                    return Mono.just(ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new ResponseMessage("Error occurred while creating the account: " + error.getMessage())));
                });
    }

    @PostMapping({"/login", "/signin"})
    public Mono<ResponseEntity<JwtResponse>> login(@Valid @RequestBody LoginRequest login) {
        log.info("Login API endpoint reached - Attempt received for user input: {}", login.getUsername());
        return userService.login(login)
                .doOnSubscribe(sub -> log.info("Processing login request for: {}", login.getUsername()))
                .doOnSuccess(response -> {
                    log.info("Login successful for user: {}", login.getUsername());
                    log.debug("Generated token with roles: {}", response.getAuth().getRoles());
                })
                .doOnError(error -> {
                    log.error("Login failed for user {}: {}", login.getUsername(), error.getMessage());
                    log.debug("Login error details", error);
                })
                .map(response -> {
                    log.info("Returning successful login response with token");
                    return ResponseEntity.ok()
                            .header("Authorization", "Bearer " + response.getAccessToken())
                            .header("Refresh-Token", response.getRefreshToken())
                            .body(response);
                })
                .onErrorResume(error -> {
                    log.error("Login error response being returned for {}: {}", login.getUsername(), error.getMessage());
                    JwtResponse errorResponse = new JwtResponse(
                            null,
                            null,
                            new AuthResponse()
                    );
                    return Mono.just(ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(errorResponse));
                });
    }

    @PostMapping({"/logout", "/signout"})
    @PreAuthorize("isAuthenticated()")
    public Mono<ResponseEntity<String>> logout() {
        log.info("User logged out.");
        return Mono.just(ResponseEntity.ok("User logged out."))
                .onErrorResume(error -> {
                    log.error("Logout error: {}", error.getMessage());
                    return Mono.just(ResponseEntity.badRequest().body(error.getMessage()));
                });
    }

    @GetMapping({"/validate", "/validateToken"})
    public Mono<ResponseEntity<TokenValidationResponse>> validateToken(
            @RequestHeader(name = "Authorization", required = false) String token) {
        
        if (token == null || token.isEmpty()) {
            log.warn("Token validation attempt with no token provided");
            return Mono.just(ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new TokenValidationResponse("No token provided")));
        }

        boolean isValid = tokenValidate.validateToken(token);
        if (isValid) {
            log.info("Token validated successfully");
            return Mono.just(ResponseEntity.ok(new TokenValidationResponse("Token is valid")));
        } else {
            log.warn("Invalid token provided for validation");
            return Mono.just(ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new TokenValidationResponse("Invalid token")));
        }
    }

    @GetMapping({"/hasAuthority", "/authorization"})
    public Mono<ResponseEntity<TokenValidationResponse>> getAuthority(
            @RequestHeader(name = "Authorization", required = false) String token,
            @RequestParam(required = true) String requireRole) {
        
        if (token == null || token.isEmpty()) {
            log.warn("Authority check attempt with no token provided");
            return Mono.just(ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new TokenValidationResponse("No token provided")));
        }

        List<String> authorities = authorityToken.extractAuthorities(token);
        
        if (authorities.contains(requireRole)) {
            log.info("Valid role found for authority check");
            return Mono.just(ResponseEntity.ok(new TokenValidationResponse("Role is valid")));
        } else {
            log.warn("Invalid role for authority check: {}", requireRole);
            return Mono.just(ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new TokenValidationResponse("Invalid role")));
        }
    }

    @PostMapping("/refresh-token")
    @Operation(summary = "Refresh access token", description = "Get a new access token using a valid refresh token")
    public Mono<ResponseEntity<JwtResponse>> refreshToken(
            @Parameter(description = "Refresh token", required = true)
            @RequestHeader(value = "Refresh-Token", required = true) String refreshToken) {
        
        log.info("Attempting to refresh token");
        
        return userService.refreshToken(refreshToken)
                .map(response -> {
                    log.info("Token refreshed successfully");
                    return ResponseEntity.ok()
                            .header("Authorization", "Bearer " + response.getAccessToken())
                            .header("Refresh-Token", response.getRefreshToken())
                            .body(response);
                })
                .onErrorResume(error -> {
                    log.error("Error refreshing token: {}", error.getMessage());
                    return Mono.just(ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                            .body(new JwtResponse(null, null, new AuthResponse())));
                });
    }

    @GetMapping("/health")
    public Mono<ResponseEntity<String>> healthCheck() {
        log.info("Health check endpoint called");
        return Mono.just(ResponseEntity.ok("Authentication service is running"));
    }
}
