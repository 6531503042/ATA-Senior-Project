package dev.bengi.userservice.config.security.jwt;

import dev.bengi.userservice.config.security.TokenService;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter implements WebFilter {

    private final TokenService tokenService;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        String token = extractToken(exchange.getRequest());

        if (token == null) {
            return chain.filter(exchange);
        }

        return tokenService.validateToken(token)
            .flatMap(claims -> {
                List<String> roles = claims.get("roles", List.class);
                List<String> permissions = claims.get("permissions", List.class);
                
                if (roles == null) roles = new ArrayList<>();
                if (permissions == null) permissions = new ArrayList<>();
                
                log.debug("Processing token with roles: {} and permissions: {}", roles, permissions);
                
                List<SimpleGrantedAuthority> authorities = new ArrayList<>();
                
                // Add role-based authorities
                authorities.addAll(roles.stream()
                    .map(role -> new SimpleGrantedAuthority(role.startsWith("ROLE_") ? role : "ROLE_" + role))
                    .toList());
                
                // Add permission-based authorities
                authorities.addAll(permissions.stream()
                    .map(SimpleGrantedAuthority::new)
                    .toList());
                
                log.debug("Created authorities: {}", authorities);

                String username = claims.getSubject();
                UsernamePasswordAuthenticationToken auth = 
                    new UsernamePasswordAuthenticationToken(username, token, authorities);

                return chain.filter(exchange)
                    .contextWrite(ReactiveSecurityContextHolder.withAuthentication(auth));
            })
            .onErrorResume(e -> {
                log.error("Authentication error: {}", e.getMessage());
        return chain.filter(exchange);
            });
    }

    private String extractToken(org.springframework.http.server.reactive.ServerHttpRequest request) {
        String bearerToken = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
} 