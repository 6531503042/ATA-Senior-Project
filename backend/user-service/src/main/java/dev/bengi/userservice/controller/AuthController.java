package dev.bengi.userservice.controller;

import java.util.List;
import javax.management.relation.RoleNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import dev.bengi.userservice.domain.payload.request.LoginRequest;
import dev.bengi.userservice.domain.payload.request.RegisterRequest;
import dev.bengi.userservice.domain.payload.response.AuthResponse;
import dev.bengi.userservice.domain.payload.response.JwtResponse;
import dev.bengi.userservice.domain.payload.response.ResponseMessage;
import dev.bengi.userservice.domain.payload.response.TokenValidationResponse;
import dev.bengi.userservice.security.validate.AuthorityToken;
import dev.bengi.userservice.security.validate.TokenValidate;
import dev.bengi.userservice.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    private final UserService userService;
    private final TokenValidate tokenValidate;
    private final AuthorityToken authorityToken;

    @PostMapping({"/register", "/signup"})
    public Mono<ResponseMessage> register(@Valid @RequestBody RegisterRequest register) throws RoleNotFoundException {
        logger.info("Registering new user: {}", register.getUsername());
        return userService.register(register)
                .map(user -> {
                    logger.info("User registered successfully: {}", register.getUsername());
                    return new ResponseMessage("Create user: " + register.getUsername() + " successfully.");
                })
                .onErrorResume(error -> {
                    logger.error("Error registering user: {}", error.getMessage());
                    return Mono.just(new ResponseMessage("Error occurred while creating the account."));
                });
    }

    @PostMapping({"/login", "/signin"})
    public Mono<ResponseEntity<JwtResponse>> login(@Valid @RequestBody LoginRequest login) {
        logger.info("Login attempt for user: {}", login.getUsername());
        return userService.login(login)
                .map(response -> {
                    logger.info("Login successful for user: {}", login.getUsername());
                    return ResponseEntity.ok()
                            .header("Authorization", "Bearer " + response.getAccessToken())
                            .header("Refresh-Token", response.getRefreshToken())
                            .body(response);
                })
                .onErrorResume(error -> {
                    logger.error("Login failed for user {}: {}", login.getUsername(), error.getMessage());
                    JwtResponse errorResponse = new JwtResponse(
                            null,
                            null,
                            new AuthResponse()
                    );
                    return Mono.just(new ResponseEntity<>(errorResponse, HttpStatus.UNAUTHORIZED));
                });
    }

    @PostMapping({"/logout", "/signout"})
    @PreAuthorize("isAuthenticated()")
    public Mono<ResponseEntity<String>> logout() {
        logger.info("User logged out.");
        return userService.logout()
                .then(Mono.just(new ResponseEntity<>("User logged out.", HttpStatus.OK)))
                .onErrorResume(error -> {
                    logger.error("Logout error: {}", error.getMessage());
                    return Mono.just(new ResponseEntity<>(error.getMessage(), HttpStatus.BAD_REQUEST));
                });
    }

    @GetMapping({"/validate", "/validateToken"})
    public ResponseEntity<TokenValidationResponse> validateToken(
            @RequestHeader(name = "Authorization", required = false) String token) {
        
        if (token == null || token.isEmpty()) {
            logger.warn("Token validation attempt with no token provided");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new TokenValidationResponse("No token provided"));
        }

        boolean isValid = tokenValidate.validateToken(token);
        if (isValid) {
            logger.info("Token validated successfully");
            return ResponseEntity.ok(new TokenValidationResponse("Token is valid"));
        } else {
            logger.warn("Invalid token provided for validation");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new TokenValidationResponse("Invalid token"));
        }
    }

    @GetMapping({"/hasAuthority", "/authorization"})
    public ResponseEntity<TokenValidationResponse> getAuthority(
            @RequestHeader(name = "Authorization", required = false) String token,
            @RequestParam(required = true) String requireRole) {
        
        if (token == null || token.isEmpty()) {
            logger.warn("Authority check attempt with no token provided");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new TokenValidationResponse("No token provided"));
        }

        List<String> authorities = authorityToken.extractAuthorities(token);
        
        if (authorities.contains(requireRole)) {
            logger.info("Valid role found for authority check");
            return ResponseEntity.ok(new TokenValidationResponse("Role is valid"));
        } else {
            logger.warn("Invalid role for authority check: {}", requireRole);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new TokenValidationResponse("Invalid role"));
        }
    }

    @PostMapping("/refresh-token")
    @Operation(summary = "Refresh access token", description = "Get a new access token using a valid refresh token")
    public Mono<ResponseEntity<JwtResponse>> refreshToken(
            @Parameter(description = "Refresh token", required = true)
            @RequestHeader(value = "Refresh-Token", required = true) String refreshToken) {
        
        logger.info("Attempting to refresh token");
        
        return userService.refreshToken(refreshToken)
                .map(response -> {
                    logger.info("Token refreshed successfully");
                    return ResponseEntity.ok()
                            .header("Authorization", "Bearer " + response.getAccessToken())
                            .header("Refresh-Token", response.getRefreshToken())
                            .body(response);
                })
                .onErrorResume(error -> {
                    logger.error("Error refreshing token: {}", error.getMessage());
                    return Mono.just(ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                            .body(new JwtResponse(null, null, new AuthResponse())));
                });
    }
}
