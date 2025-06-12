package dev.bengi.userservice.config.security;

import dev.bengi.userservice.config.security.jwt.JwtProvider;
import dev.bengi.userservice.exception.ErrorCode;
import dev.bengi.userservice.exception.GlobalServiceException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import io.jsonwebtoken.Claims;
import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TokenService {

    private final JwtProvider jwtProvider;

    public Mono<Claims> validateToken(String token) {
        try {
            if (!jwtProvider.validateToken(token)) {
                return Mono.error(new GlobalServiceException(ErrorCode.UNAUTHORIZED_ACCESS));
            }
            Claims claims = jwtProvider.getAllClaimsFromToken(token);
            if (claims.getExpiration().before(new Date())) {
                return Mono.error(new GlobalServiceException(ErrorCode.UNAUTHORIZED_ACCESS));
            }
            return Mono.just(claims);
        } catch (Exception e) {
            return Mono.error(new GlobalServiceException(ErrorCode.UNAUTHORIZED_ACCESS));
        }
    }

    public Mono<Boolean> validateTokenAndRole(String token, String requiredRole) {
        return validateToken(token)
            .map(claims -> {
                List<String> roles = claims.get("roles", List.class);
                if (roles == null) return false;
                return roles.contains(requiredRole) || roles.contains("ROLE_" + requiredRole);
            })
            .defaultIfEmpty(false);
    }

    public List<String> extractAuthorities(String token) {
        try {
            Claims claims = jwtProvider.getAllClaimsFromToken(token);
            List<String> permissions = claims.get("permissions", List.class);
            if (permissions != null) {
                return permissions;
            }
            // Fallback to roles if permissions are not present
            List<String> roles = claims.get("roles", List.class);
            return roles != null ? roles : List.of();
        } catch (Exception e) {
            return List.of();
        }
    }
} 