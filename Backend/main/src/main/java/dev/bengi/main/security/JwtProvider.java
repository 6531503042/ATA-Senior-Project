package dev.bengi.main.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.io.DecodingException;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

@Component
public class JwtProvider {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private long jwtExpirationMs;

    @Value("${jwt.refresh-expiration}")
    private long jwtRefreshExpirationMs;

    private SecretKey getSigningKey() {
        String secret = jwtSecret;

        // Support prefix-based explicit base64 secrets: base64:...
        if (secret != null && secret.startsWith("base64:")) {
            secret = secret.substring("base64:".length());
            try {
                return Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret));
            } catch (DecodingException | IllegalArgumentException e) {
                // fall through to raw handling below
            }
        }

        // Try base64 first (no prefix case), then raw
        try {
            byte[] keyBytes = Decoders.BASE64.decode(secret);
            return Keys.hmacShaKeyFor(keyBytes);
        } catch (DecodingException | IllegalArgumentException e) {
            byte[] raw = (secret != null ? secret : "default-secret").getBytes(StandardCharsets.UTF_8);
            // Ensure at least 256-bit (32 bytes) key material by hashing if needed
            if (raw.length < 32) {
                try {
                    MessageDigest sha256 = MessageDigest.getInstance("SHA-256");
                    raw = sha256.digest(raw);
                } catch (NoSuchAlgorithmException ignored) {
                    // Should not happen; SHA-256 is standard. If it does, the raw bytes will be used.
                }
            }
            return Keys.hmacShaKeyFor(raw);
        }
    }

    public String createToken(String subject, List<String> roles) {
        Instant now = Instant.now();
        return Jwts.builder()
                .setSubject(subject)
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(now.plusMillis(jwtExpirationMs)))
                .addClaims(Map.of("roles", roles))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String createRefreshToken(String subject) {
        Instant now = Instant.now();
        return Jwts.builder()
                .setSubject(subject)
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(now.plusMillis(jwtRefreshExpirationMs)))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public boolean validateToken(String token) {
        try {
            parseClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public String getUsernameFromToken(String token) {
        return parseClaims(token).getSubject();
    }

    public List<String> getRoles(String token) {
        Claims claims = parseClaims(token);
        Object roles = claims.get("roles");
        if (roles instanceof List<?> list) {
            return list.stream().map(Object::toString).toList();
        }
        return List.of();
    }

    private Claims parseClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}


