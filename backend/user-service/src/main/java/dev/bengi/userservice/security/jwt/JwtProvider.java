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
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Component
@Slf4j
public class JwtProvider {

    @Value("${security.jwt.secret}")
    private String jwtSecret;

    @Value("${security.jwt.expiration}")
    private int jwtExpiration;

    @Value("${security.jwt.refresh-expiration}")
    private Long jwtRefreshExpiration;

    private SecretKey key;

    private SecretKey getSigningKey() {
        if (key == null) {
            try {
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

    private String generateToken(Authentication authentication, long expiration) {
        UserPrinciple userPrinciple = (UserPrinciple) authentication.getPrincipal();
        
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expiration * 1000);
        
        return Jwts.builder()
                .subject(userPrinciple.getUsername())
                .claim("roles", userPrinciple.getAuthorities().stream()
                        .map(GrantedAuthority::getAuthority)
                        .collect(Collectors.toList()))
                .claim("user_id", userPrinciple.getId())
                .claim("email", userPrinciple.getEmail())
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(getSigningKey())
                .compact();
    }

    public String createToken(Authentication authentication) {
        log.debug("Creating access token for authentication: {}", authentication.getName());
        return generateToken(authentication, jwtExpiration);
    }

    public String createToken(User user) {
        try {
            log.debug("Creating token for user: {}", user.getUsername());
            
            Date now = new Date();
            Date expiryDate = new Date(now.getTime() + jwtExpiration * 1000);

            String token = Jwts.builder()
                    .subject(user.getUsername())
                    .claim("roles", user.getRoles().stream()
                            .map(role -> role.getName().name())
                            .collect(Collectors.toList()))
                    .claim("user_id", user.getId())
                    .claim("email", user.getEmail())
                    .claim("department", user.getDepartment())
                    .claim("position", user.getPosition())
                    .issuedAt(now)
                    .expiration(expiryDate)
                    .signWith(getSigningKey())
                    .compact();
            
            log.debug("Token created successfully with claims - Subject: {}, Expiration: {}", 
                    user.getUsername(), expiryDate);
            
            return token;
        } catch (Exception e) {
            log.error("Failed to create JWT token: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to create JWT token", e);
        }
    }

    public String createRefreshToken(Authentication authentication) {
        log.debug("Creating refresh token for authentication: {}", authentication.getName());
        UserPrinciple userPrinciple = (UserPrinciple) authentication.getPrincipal();
        return createRefreshToken(userPrinciple.getUsername());
    }

    public String createRefreshToken(User user) {
        log.debug("Creating refresh token for user: {}", user.getUsername());
        return createRefreshToken(user.getUsername());
    }

    private String createRefreshToken(String username) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtRefreshExpiration * 1000);

        return Jwts.builder()
                .subject(username)
                .claim("token_type", "refresh")
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(getSigningKey())
                .compact();
    }

    public boolean validateToken(String token) {
        try {
            log.debug("Validating token: {}", token);
            Claims claims = Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
            
            log.debug("Token validation successful. Subject: {}, Roles: {}", 
                    claims.getSubject(), 
                    claims.get("roles", List.class));
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
