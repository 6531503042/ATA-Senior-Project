package dev.bengi.userservice.config.security.jwt;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import javax.crypto.SecretKey;

import dev.bengi.userservice.domain.model.Role;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

import dev.bengi.userservice.domain.model.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class JwtProvider {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private int jwtExpiration;

    @Value("${jwt.refresh-expiration}")
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
        String username = authentication.getName();
        
        List<String> roles = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());
        
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expiration * 1000);
        
        return Jwts.builder()
                .subject(username)
                .claim("roles", roles)
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
            Date expiryDate = new Date(now.getTime() + jwtExpiration * 1000L);

            String token = Jwts.builder()
                    .subject(user.getUsername())
                    .claim("roles", user.getRoles().stream()
                            .map(Role::getName)
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
        return createRefreshToken(authentication.getName());
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
                claims.getSubject(), claims.get("roles"));
            return true;
        } catch (SignatureException e) {
            log.error("Invalid JWT signature: {}", e.getMessage(), e);
        } catch (MalformedJwtException e) {
            log.error("Invalid JWT token structure: {}", e.getMessage(), e);
        } catch (ExpiredJwtException e) {
            log.error("JWT token is expired: {}", e.getMessage(), e);
        } catch (UnsupportedJwtException e) {
            log.error("JWT token is unsupported: {}", e.getMessage(), e);
        } catch (IllegalArgumentException e) {
            log.error("JWT claims string is empty: {}", e.getMessage(), e);
        }
        return false;
    }

    public String getUserNameFromToken(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return claims.getSubject();
    }

//    public Claims getClaimsFromToken(String token) {
//        return Jwts.parser()
//                .verifyWith(getSigningKey())
//                .build()
//                .parseSignedClaims(token)
//                .getPayload();
//    }
//
//    @SuppressWarnings("deprecation")
//    public String createPasswordResetToken(String username) {
//        Date now = new Date();
//        long resetPasswordTokenExpiration = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
//        Date expiry = new Date(now.getTime() + resetPasswordTokenExpiration);
//
//        return Jwts.builder()
//                .setSubject(username)
//                .setIssuedAt(now)
//                .setExpiration(expiry)
//                .signWith(getSigningKey())
//                .compact();
//    }
}
