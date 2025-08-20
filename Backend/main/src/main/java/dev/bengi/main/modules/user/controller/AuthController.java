package dev.bengi.main.modules.user.controller;

import dev.bengi.main.modules.user.dto.LoginRequest;
import dev.bengi.main.modules.user.dto.RegisterRequest;
import dev.bengi.main.modules.user.dto.TokenValidationResponse;
import dev.bengi.main.modules.user.dto.JwtResponse;
import dev.bengi.main.modules.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    @PostMapping("/register")
    public Mono<ResponseEntity<Void>> register(@Valid @RequestBody RegisterRequest request) {
        return userService.register(request).thenReturn(ResponseEntity.ok().build());
    }

    @PostMapping("/login")
    public Mono<ResponseEntity<JwtResponse>> login(@Valid @RequestBody LoginRequest request) {
        return userService.login(request).map(ResponseEntity::ok);
    }

    @GetMapping("/validate")
    public Mono<ResponseEntity<TokenValidationResponse>> validate(@RequestHeader(name = "Authorization", required = false) String token) {
        return userService.validate(token).map(ResponseEntity::ok);
    }
}


