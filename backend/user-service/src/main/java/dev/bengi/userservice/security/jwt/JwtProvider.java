package dev.bengi.userservice.security.jwt;

import dev.bengi.userservice.domain.model.User;
import dev.bengi.userservice.security.userPrinciple.UserPrinciple;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
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

    @Value("${security.jwt.secret}")
    private String jwtSecret;

    @Value("${security.jwt.expiration}")
    private int jwtExpiration;

    @Value("${security.jwt.refresh-expiration}")
    private Long jwtRefreshExpiration;

    private SecretKey key;

    private SecretKey getSigningKey() {
        if (key == null) {
            key = Keys.hmacShaKeyFor(jwtSecret.getBytes());
        }
        return key;
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
        Instant now = Instant.now();
        Instant expiration = now.plusSeconds(jwtExpiration);

        return Jwts.builder()
                .subject(user.getUsername())
                .claim("roles", user.getRoles().stream()
                        .map(role -> role.getName().name())
                        .collect(Collectors.toList()))
                .claim("email", user.getEmail())
                .issuedAt(Date.from(now))
                .expiration(Date.from(expiration))
                .signWith(getSigningKey())
                .compact();
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
            Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (Exception e) {
            log.error("JWT validation failed: {}", e.getMessage());
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
