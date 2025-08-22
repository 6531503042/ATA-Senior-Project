package dev.bengi.main.security;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextImpl;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter implements WebFilter {

    private final JwtProvider jwtProvider;
    private final SecurityAuditService auditService;

    @Override
    @NonNull
    public Mono<Void> filter(@NonNull ServerWebExchange exchange, @NonNull WebFilterChain chain) {
        String path = exchange.getRequest().getPath().value();
        String method = exchange.getRequest().getMethod().name();
        String clientIp = auditService.getClientIpAddress(exchange);
        
        // Skip JWT processing for public endpoints
        if (isPublicEndpoint(path, method)) {
            return chain.filter(exchange);
        }

        String authHeader = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            
            try {
                if (jwtProvider.validateToken(token)) {
                    return authenticateAndProceed(token, exchange, chain, path, method);
                } else {
                    // Log invalid token
                    auditService.logInvalidToken(token, "Token validation failed");
                    return handleAuthenticationError(exchange, "Invalid token");
                }
            } catch (Exception e) {
                // Log token processing error
                auditService.logInvalidToken(token, "Token processing error: " + e.getMessage());
                log.warn("Error processing JWT token: {}", e.getMessage());
                return handleAuthenticationError(exchange, "Token processing error");
            }
        }

        // No token provided for protected endpoint
        if (isProtectedEndpoint(path, method)) {
            auditService.logFailedAuthentication("anonymous", clientIp, "No token provided");
            return handleAuthenticationError(exchange, "Authentication required");
        }

        return chain.filter(exchange);
    }

    private boolean isPublicEndpoint(String path, String method) {
        // Public endpoints that don't require authentication
        return (path.startsWith("/api/auth/") && ("POST".equals(method) || "GET".equals(method))) ||
               path.equals("/actuator/health") ||
               path.equals("/actuator/info") ||
               "OPTIONS".equals(method);
    }

    private boolean isProtectedEndpoint(String path, String method) {
        // All API endpoints except public ones are protected
        return path.startsWith("/api/") && !isPublicEndpoint(path, method);
    }

    private Mono<Void> authenticateAndProceed(String token, ServerWebExchange exchange, 
                                              WebFilterChain chain, String path, String method) {
        try {
            String username = jwtProvider.getUsernameFromToken(token);
            List<String> roles = jwtProvider.getRoles(token);
            
            List<SimpleGrantedAuthority> authorities = roles.stream()
                    .map(r -> r.startsWith("ROLE_") ? r : "ROLE_" + r)
                    .map(SimpleGrantedAuthority::new)
                    .collect(Collectors.toList());

            Authentication authentication = new UsernamePasswordAuthenticationToken(username, token, authorities);
            
            // Log successful authentication
            auditService.logResourceAccess(username, path, method);
            
            // Create SecurityContext and set it properly for reactive context
            SecurityContext securityContext = new SecurityContextImpl(authentication);
            
            return chain.filter(exchange)
                    .contextWrite(ReactiveSecurityContextHolder.withSecurityContext(Mono.just(securityContext)))
                    .doOnSubscribe(subscription -> {
                        // Ensure SecurityContext is available for method-level security
                        log.debug("Authentication set for user: {} with roles: {}", username, roles);
                    });
                    
        } catch (Exception e) {
            log.error("Error during authentication: {}", e.getMessage(), e);
            return handleAuthenticationError(exchange, "Authentication processing error");
        }
    }

    private Mono<Void> handleAuthenticationError(ServerWebExchange exchange, String reason) {
        exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
        exchange.getResponse().getHeaders().add("Content-Type", "application/json");
        
        String errorResponse = String.format(
                "{\"error\":\"Unauthorized\",\"message\":\"%s\",\"path\":\"%s\",\"timestamp\":\"%s\"}",
                reason,
                exchange.getRequest().getPath().value(),
                java.time.Instant.now()
        );
        
        org.springframework.core.io.buffer.DataBuffer buffer = 
                exchange.getResponse().bufferFactory().wrap(errorResponse.getBytes());
        
        return exchange.getResponse().writeWith(Mono.just(buffer));
    }
}


