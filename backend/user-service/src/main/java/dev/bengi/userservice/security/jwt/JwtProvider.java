package dev.bengi.userservice.security.jwt;

import dev.bengi.userservice.domain.model.User;
import dev.bengi.userservice.security.userPrinciple.UserPrinciple;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.util.Date;
import java.util.stream.Collectors;

@Component
@Slf4j
public class JwtProvider {

    @Value("${security.jwt.secret:defaultSecretKeyForDevelopment}")
    private String jwtSecret;

    @Value("${security.jwt.expiration}")
    private int jwtExpiration;

    @Value("${security.jwt.refresh-expiration}")
    private Long jwtRefreshExpiration;

    private SecretKey key;

        private SecretKey getSigningKey() {
        if (key == null) {
            try {
                // Decode the secret key from BASE64
                byte[] keyBytes = Decoders.BASE64.decode(jwtSecret);
                key = Keys.hmacShaKeyFor(keyBytes);
                log.debug("Signing key created successfully");
            } catch (Exception e) {
                log.error("Failed to create signing key: {}", e.getMessage(), e);
                throw new RuntimeException("Failed to create JWT signing key", e);
            }
        }
        return key;
    }

    @PostConstruct
    public void init() {
        log.warn("JWT Secret length: {}", jwtSecret.length());
        if (jwtSecret.equals("defaultSecretKeyForDevelopment")) {
            log.error("SECURITY WARNING: Using default JWT secret. Please configure security.jwt.secret in application.properties!");
        }
    }

    public String createToken(Authentication authentication) {
        UserPrinciple userPrinciple = (UserPrinciple) authentication.getPrincipal();

        Instant now = Instant.now();
        Instant expiration = now.plusSeconds(jwtExpiration);

        return Jwts.builder()
                .subject(userPrinciple.getUsername())
                .claim("roles", userPrinciple.getAuthorities().stream()
                        .map(authority -> authority.getAuthority())
                        .collect(Collectors.toList()))
                .issuedAt(Date.from(now))
                .expiration(Date.from(expiration))
                .signWith(getSigningKey())
                .compact();
    }

    public String createToken(User user) {
        try {
            Instant now = Instant.now();
            Instant expiration = now.plusSeconds(jwtExpiration);

            String token = Jwts.builder()
                    .subject(user.getUsername())
                    .claim("roles", user.getRoles().stream()
                            .map(role -> role.getName().name())
                            .collect(Collectors.toList()))
                    .claim("email", user.getEmail())
                    .issuedAt(Date.from(now))
                    .expiration(Date.from(expiration))
                    .signWith(getSigningKey())
                    .compact();
            
            log.debug("Created token for user: {}", user.getUsername());
            log.debug("Token details - Subject: {}, Expiration: {}", 
                user.getUsername(), expiration);
            
            return token;
        } catch (Exception e) {
            log.error("Failed to create JWT token: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to create JWT token", e);
        }
    }

    public String createRefreshToken(Authentication authentication) {
        UserPrinciple userPrinciple = (UserPrinciple) authentication.getPrincipal();
        return createRefreshToken(userPrinciple.getUsername());
    }

    public String createRefreshToken(User user) {
        return createRefreshToken(user.getUsername());
    }

    private String createRefreshToken(String username) {
        Instant now = Instant.now();
        Instant expiration = now.plusSeconds(jwtRefreshExpiration);

        return Jwts.builder()
                .subject(username)
                .issuedAt(Date.from(now))
                .expiration(Date.from(expiration))
                .signWith(getSigningKey())
                .compact();
    }

    public boolean validateToken(String token) {
        try {
            log.debug("Validating token: {}", token);
            log.debug("Using signing key: {}", getSigningKey());
            Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token);
            log.debug("Token validation successful");
            return true;
        } catch (Exception e) {
            log.error("JWT validation failed: {}", e.getMessage(), e);
            return false;
        }
    }

    public String getUserNameFromToken(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return claims.getSubject();
    }

    public Claims getClaimsFromToken(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    @SuppressWarnings("deprecation")
    public String createPasswordResetToken(String username) {
        Date now = new Date();
        long resetPasswordTokenExpiration = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
        Date expiry = new Date(now.getTime() + resetPasswordTokenExpiration);

        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(now)
                .setExpiration(expiry)
                .signWith(getSigningKey())
                .compact();
    }
}
