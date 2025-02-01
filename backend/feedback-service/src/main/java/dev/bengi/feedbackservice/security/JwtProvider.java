package dev.bengi.feedbackservice.security;


import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.SignatureException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@Slf4j
public class JwtProvider {

    @Value("${security.jwt.secret}")
    private static String jwtSecret;

    @Value("${security.jwt.expiration}")
    private int jwtExpiration;

    public Authentication getAuthentication(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(jwtSecret)
                .parseClaimsJws(token)
                .getBody();

        String username = claims.getSubject();
        List<GrantedAuthority> authorities = extractAuthorities(claims);
        return new UsernamePasswordAuthenticationToken(username, null, authorities);
    }

    public String getJwtSecret() {
        return jwtSecret;
    }

    private List<GrantedAuthority> extractAuthorities(Claims claims) {
        List<GrantedAuthority> authorities = new ArrayList<>();

        List<String> roles = claims.get("authorities", List.class);
        roles.forEach(role -> {
            authorities.add(new SimpleGrantedAuthority(role));
        });

        return authorities;
    }

    public static Boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .setSigningKey(jwtSecret)
                    .parseClaimsJws(token);

            return true;

        } catch (SignatureException e) {
            log.error("Invalid JWT signature: {}", e.getMessage());
    } catch (MalformedJwtException e) {
        log.error("Invalid JWT token: {}", e.getMessage());
    } catch (UnsupportedJwtException e) {
        log.error("Unsupported JWT token: {}", e.getMessage());
    } catch (IllegalArgumentException e) {
        log.error("JWT claims string is empty: {}", e.getMessage());
    }
        return false;
    }

}
