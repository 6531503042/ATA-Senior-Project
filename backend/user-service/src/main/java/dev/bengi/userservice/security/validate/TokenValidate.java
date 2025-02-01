package dev.bengi.userservice.security.validate;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SecurityException;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;

@Component
@Slf4j
public class TokenValidate {

    @Value("${security.jwt.secret}")
    private String jwtSecret;

    @PostConstruct
    public void init() {
        log.warn("JWT Secret configured: {}", jwtSecret != null && !jwtSecret.isEmpty());
        if (jwtSecret == null || jwtSecret.isEmpty()) {
            log.error("SECURITY WARNING: No JWT secret configured!");
        }
    }

    private SecretKey getSigningKey() {
        if (jwtSecret == null || jwtSecret.isEmpty()) {
            throw new IllegalStateException("JWT secret is not configured");
        }
        
        try {
            byte[] keyBytes = Decoders.BASE64.decode(jwtSecret);
            return Keys.hmacShaKeyFor(keyBytes);
        } catch (Exception e) {
            log.error("Failed to decode JWT secret: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to decode JWT secret", e);
        }
    }

    public boolean validateToken(String token) {
        if (jwtSecret == null || jwtSecret.isEmpty()) {
            log.error("JWT secret key cannot be null or empty");
            return false;
        }

        if (token == null || token.isEmpty()) {
            log.error("Token cannot be null or empty");
            return false;
        }

        // Remove Bearer prefix if present
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        try {
            SecretKey signingKey = getSigningKey();
            log.debug("Validating token with key: {}", signingKey);

            Claims claims = Jwts.parser()
                    .verifyWith(signingKey)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            // Additional token validation
            if (claims.getSubject() == null || claims.getSubject().isEmpty()) {
                log.error("Token has no subject");
                return false;
            }

            // Check if token is expired
            if (claims.getExpiration() != null && 
                claims.getExpiration().before(new java.util.Date())) {
                log.error("Token is expired");
                return false;
            }

            return true;
        } catch (SecurityException e) {
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
}
