package dev.bengi.feedbackservice.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.constraints.NotNull;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.filter.OncePerRequestFilter;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import dev.bengi.feedbackservice.domain.payload.response.TokenValidationResponse;
import dev.bengi.feedbackservice.dto.UserDto;
import dev.bengi.feedbackservice.foreign.UserClient;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtTokenFilter extends OncePerRequestFilter {

    private final JwtProvider jwtProvider;
    private final UserClient userClient;
    
    /**
     * @param request
     * @param response
     * @param filterChain
     * @throws ServletException
     * @throws IOException
     */
    @Override
protected void doFilterInternal(
        @NonNull HttpServletRequest request,
        @NonNull HttpServletResponse response,
        @NonNull FilterChain filterChain) throws ServletException, IOException {

    try {
        String token = extractTokenFromRequest(request);
        log.info("Extracted token: {}", token);

        if (token != null) {
            TokenValidationResponse validationResponse = userClient.validateToken("Bearer " + token);
            log.info("Validation response: {}", validationResponse);
            
            if (validationResponse != null) {
                log.info("Validation message: {}", validationResponse.getMessage());
                
                if ("Token is valid".equals(validationResponse.getMessage())) {
                    // Manually decode the token to extract claims
                    String[] parts = token.split("\\.");
                    if (parts.length == 3) {
                        // Base64 decode the payload part
                        String payload = new String(Base64.getUrlDecoder().decode(parts[1]), StandardCharsets.UTF_8);
                        
                        // Parse JSON payload
                        ObjectMapper mapper = new ObjectMapper();
                        JsonNode payloadJson = mapper.readTree(payload);
                        
                        // Extract username and roles
                        String username = payloadJson.get("sub").asText();
                        JsonNode rolesNode = payloadJson.get("roles");
                        
                        // Create authorities
                        List<GrantedAuthority> authorities = new ArrayList<>();
                        if (rolesNode != null && rolesNode.isArray()) {
                            for (JsonNode roleNode : rolesNode) {
                                authorities.add(new SimpleGrantedAuthority("ROLE_" + roleNode.asText()));
                            }
                        }
                        
                        // Set authentication
                        UsernamePasswordAuthenticationToken authentication = 
                            new UsernamePasswordAuthenticationToken(
                                username, 
                                null, 
                                authorities
                            );
                        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(authentication);
                        
                        log.info("Authentication set successfully for user: {}, roles: {}", 
                            username, authorities);
                    } else {
                        log.warn("Invalid token format");
                    }
                } else {
                    log.warn("Token validation failed: {}", validationResponse.getMessage());
                }
            } else {
                log.warn("Validation response is null");
            }
        } else {
            log.warn("No token found in request");
        }
        
        filterChain.doFilter(request, response);
    } catch (Exception e) {
        log.error("Token validation error", e);
        filterChain.doFilter(request, response);
    }
}

    private String extractTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
