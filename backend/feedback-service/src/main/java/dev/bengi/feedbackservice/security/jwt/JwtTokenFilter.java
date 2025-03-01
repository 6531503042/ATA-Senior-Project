package dev.bengi.feedbackservice.security.jwt;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import dev.bengi.feedbackservice.client.UserClient;
import dev.bengi.feedbackservice.domain.payload.response.TokenValidationResponse;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtTokenFilter extends OncePerRequestFilter {

    private final UserClient userClient;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {
        try {
            String authHeader = request.getHeader("Authorization");
            log.debug("Authorization header: {}", authHeader);

            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                log.debug("Extracted token: {}", token);

                TokenValidationResponse validationResponse = userClient.validateToken("Bearer " + token);
                log.debug("Token validation response: {}", validationResponse);

                if (validationResponse != null && "Token is valid".equals(validationResponse.getMessage())) {
                    String[] parts = token.split("\\.");
                    if (parts.length == 3) {
                        String payload = new String(Base64.getUrlDecoder().decode(parts[1]), StandardCharsets.UTF_8);
                        ObjectMapper mapper = new ObjectMapper();
                        JsonNode payloadJson = mapper.readTree(payload);
                        
                        String username = payloadJson.get("sub").asText();
                        Long userId = null;
                        if (payloadJson.has("user_id")) {
                            userId = payloadJson.get("user_id").asLong();
                        }
                        
                        JsonNode rolesNode = payloadJson.get("roles");
                        
                        List<SimpleGrantedAuthority> authorities = new ArrayList<>();
                        if (rolesNode != null && rolesNode.isArray()) {
                            for (JsonNode roleNode : rolesNode) {
                                String role = roleNode.asText();
                                authorities.add(new SimpleGrantedAuthority(role));
                            }
                        }
                        
                        log.debug("Setting authentication for user: {} with authorities: {}", username, authorities);
                        
                        UsernamePasswordAuthenticationToken authentication = 
                            new UsernamePasswordAuthenticationToken(username, authHeader, authorities);
                        
                        Map<String, Object> details = new HashMap<>();
                        details.put("token", token);
                        details.put("userId", userId);
                        authentication.setDetails(details);
                        
                        SecurityContextHolder.getContext().setAuthentication(authentication);
                    }
                } else {
                    log.debug("Token validation failed");
                }
            } else {
                log.debug("No Bearer token found in request");
            }
        } catch (Exception e) {
            log.error("Token processing error: {}", e.getMessage(), e);
            SecurityContextHolder.clearContext();
        }
        
        filterChain.doFilter(request, response);
    }
} 