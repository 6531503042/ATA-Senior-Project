package dev.bengi.main.modules.user.controller;

import dev.bengi.main.modules.user.dto.LoginRequest;
import dev.bengi.main.modules.user.dto.RegisterRequest;
import dev.bengi.main.modules.user.dto.TokenValidationResponse;
import dev.bengi.main.modules.user.dto.JwtResponse;
import dev.bengi.main.modules.user.service.UserService;
import dev.bengi.main.security.SecurityAuditService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final SecurityAuditService auditService;

    @PostMapping("/register")
    public Mono<ResponseEntity<Void>> register(@Valid @RequestBody RegisterRequest request) {
        return userService.register(request).thenReturn(ResponseEntity.ok().build());
    }

    @PostMapping("/login")
    public Mono<ResponseEntity<JwtResponse>> login(@Valid @RequestBody LoginRequest request, ServerWebExchange exchange) {
        String clientIp = auditService.getClientIpAddress(exchange);
        return userService.login(request, clientIp).map(ResponseEntity::ok);
    }

    @GetMapping("/validate")
    public Mono<ResponseEntity<TokenValidationResponse>> validate(@RequestHeader(name = "Authorization", required = false) String token) {
        return userService.validate(token).map(ResponseEntity::ok);
    }

    @PostMapping("/refresh-token")
    public Mono<ResponseEntity<JwtResponse>> refreshToken(
            @RequestHeader(value = "Refresh-Token", required = true) String refreshToken) {
        return userService.refreshToken(refreshToken)
                .map(response -> ResponseEntity.ok()
                        .header("Authorization", "Bearer " + response.accessToken())
                        .header("Refresh-Token", response.refreshToken())
                        .body(response))
                .onErrorResume(error -> 
                    Mono.just(ResponseEntity.status(org.springframework.http.HttpStatus.UNAUTHORIZED)
                            .body(new JwtResponse(null, null, null, null, null, java.util.List.of()))));
    }

    @PostMapping("/logout")
    public Mono<ResponseEntity<String>> logout() {
        return Mono.just(ResponseEntity.ok("User logged out successfully"));
    }
}


