package dev.bengi.userservice.security.validate;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.*;

@Component
@Slf4j
public class AuthorityToken {

    @Value("${security.jwt.secret}")
    private String jwtSecret;

    private SecretKey getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(jwtSecret);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    @SuppressWarnings("unchecked")
    public List<String> extractAuthorities(String token) {
        if (token == null || token.isEmpty()) {
            log.error("Token cannot be null or empty");
            return Collections.emptyList();
        }

        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        try {
            Claims claims = Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            Object authoritiesObj = claims.get("authorities");
            
            if (authoritiesObj instanceof List) {
                return (List<String>) authoritiesObj;
            } else if (authoritiesObj instanceof String) {
                return Arrays.asList(authoritiesObj.toString().split(","));
            } else if (authoritiesObj != null) {
                return Arrays.asList(authoritiesObj.toString().split(","));
            }
            
            log.warn("No authorities found in token");
            return Collections.emptyList();
            
        } catch (ExpiredJwtException e) {
            log.error("Token is expired: {}", e.getMessage());
        } catch (SecurityException | MalformedJwtException e) {
            log.error("Invalid token: {}", e.getMessage());
        } catch (Exception e) {
            log.error("Error extracting authorities: {}", e.getMessage());
        }
        
        return Collections.emptyList();
    }
}
