package dev.bengi.userservice.controller;

import dev.bengi.userservice.domain.payload.request.ForgotPasswordRequest;
import dev.bengi.userservice.domain.payload.request.LoginRequest;
import dev.bengi.userservice.domain.payload.request.RegisterRequest;
import dev.bengi.userservice.domain.payload.response.AuthResponse;
import dev.bengi.userservice.domain.payload.response.JwtResponse;
import dev.bengi.userservice.domain.payload.response.ResponseMessage;
import dev.bengi.userservice.domain.payload.response.TokenValidationResponse;
import dev.bengi.userservice.security.jwt.JwtProvider;
import dev.bengi.userservice.security.validate.AuthorityToken;
import dev.bengi.userservice.security.validate.TokenValidate;
import dev.bengi.userservice.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import javax.management.relation.RoleNotFoundException;
import java.util.List;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final UserService userService;
    private final TokenValidate tokenValidate;
    private final AuthorityToken authorityToken;

    @PostMapping({"/register", "/signup"})
    public Mono<ResponseMessage> register(@Valid @RequestBody RegisterRequest register) throws RoleNotFoundException {
        return userService.register(register)
                .map(user -> new ResponseMessage("Create user: " + register.getUsername() + " successfully."))
                .onErrorResume(error -> Mono.just(new ResponseMessage("Error occurred while creating the account.")));
    }

    @PostMapping({"/login", "/signin"})
    public Mono<ResponseEntity<JwtResponse>> login(@RequestBody LoginRequest login) {
        return userService.login(login)
                .map(ResponseEntity::ok)
                .onErrorResume(error -> {
                    JwtResponse errorResponse = new JwtResponse(
                            null,
                            null,
                            new AuthResponse()
                    );
                    return Mono.just(new ResponseEntity<>(errorResponse, HttpStatus.UNAUTHORIZED));
                });
    }

    @PostMapping({"/logout", "/signout"})
    @PreAuthorize("isAuthenticated() and hasAuthority('USER')")
    public Mono<ResponseEntity<String>> logout() {
        log.info("User logged out.");
        return userService.logout()
                .then(Mono.just(new ResponseEntity<>("User logged out.", HttpStatus.OK)))
                .onErrorResume(error -> Mono.just(new ResponseEntity<>(error.getMessage(), HttpStatus.BAD_REQUEST)));
    }

    @GetMapping({"/validate", "/validateToken"})
    public ResponseEntity<TokenValidationResponse> validateToken(
            @RequestHeader(name = "Authorization", required = false) String token) {
        
        if (token == null || token.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new TokenValidationResponse("No token provided"));
        }

        boolean isValid = tokenValidate.validateToken(token);
        if (isValid) {
            return ResponseEntity.ok(new TokenValidationResponse("Token is valid"));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new TokenValidationResponse("Invalid token"));
        }
    }

    @GetMapping({"/hasAuthority", "/authorization"})
    public ResponseEntity<TokenValidationResponse> getAuthority(
            @RequestHeader(name = "Authorization", required = false) String token,
            @RequestParam(required = true) String requireRole) {
        
        if (token == null || token.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new TokenValidationResponse("No token provided"));
        }

        List<String> authorities = authorityToken.extractAuthorities(token);
        
        if (authorities.contains(requireRole)) {
            return ResponseEntity.ok(new TokenValidationResponse("Role is valid"));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new TokenValidationResponse("Invalid role"));
        }
    }

}
