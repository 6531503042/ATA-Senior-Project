package dev.bengi.main.security;

import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Service for auditing security events and user activities
 * Helps track authentication, authorization, and access patterns
 */
@Service
@Slf4j
public class SecurityAuditService {

    /**
     * Log successful authentication
     */
    public void logSuccessfulAuthentication(String username, String ipAddress) {
        Map<String, Object> auditData = createBaseAuditData("AUTH_SUCCESS", username, ipAddress);
        log.info("Authentication successful: {}", auditData);
    }

    /**
     * Log failed authentication attempt
     */
    public void logFailedAuthentication(String username, String ipAddress, String reason) {
        Map<String, Object> auditData = createBaseAuditData("AUTH_FAILED", username, ipAddress);
        auditData.put("reason", reason);
        log.warn("Authentication failed: {}", auditData);
    }

    /**
     * Log access denied events
     */
    public void logAccessDenied(String username, String resource, String action) {
        Map<String, Object> auditData = new HashMap<>();
        auditData.put("event", "ACCESS_DENIED");
        auditData.put("username", username);
        auditData.put("resource", resource);
        auditData.put("action", action);
        auditData.put("timestamp", LocalDateTime.now());
        log.warn("Access denied: {}", auditData);
    }

    /**
     * Log successful resource access
     */
    public void logResourceAccess(String username, String resource, String action) {
        Map<String, Object> auditData = new HashMap<>();
        auditData.put("event", "RESOURCE_ACCESS");
        auditData.put("username", username);
        auditData.put("resource", resource);
        auditData.put("action", action);
        auditData.put("timestamp", LocalDateTime.now());
        log.info("Resource accessed: {}", auditData);
    }

    /**
     * Log JWT token validation failures
     */
    public void logInvalidToken(String token, String reason) {
        Map<String, Object> auditData = new HashMap<>();
        auditData.put("event", "INVALID_TOKEN");
        auditData.put("tokenPrefix", token != null && token.length() > 10 ? token.substring(0, 10) + "..." : "null");
        auditData.put("reason", reason);
        auditData.put("timestamp", LocalDateTime.now());
        log.warn("Invalid token: {}", auditData);
    }

    /**
     * Get current user info for audit logging
     */
    public Mono<String> getCurrentUsername() {
        return ReactiveSecurityContextHolder.getContext()
                .map(securityContext -> securityContext.getAuthentication())
                .filter(Authentication::isAuthenticated)
                .map(Authentication::getName)
                .defaultIfEmpty("anonymous");
    }

    /**
     * Get client IP address from exchange
     */
    public String getClientIpAddress(ServerWebExchange exchange) {
        String xForwardedFor = exchange.getRequest().getHeaders().getFirst("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        
        String xRealIp = exchange.getRequest().getHeaders().getFirst("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty()) {
            return xRealIp;
        }
        
        var remoteAddress = exchange.getRequest().getRemoteAddress();
        return remoteAddress != null && remoteAddress.getAddress() != null
                ? remoteAddress.getAddress().getHostAddress()
                : "unknown";
    }

    /**
     * Create base audit data structure
     */
    private Map<String, Object> createBaseAuditData(String event, String username, String ipAddress) {
        Map<String, Object> auditData = new HashMap<>();
        auditData.put("event", event);
        auditData.put("username", username);
        auditData.put("ipAddress", ipAddress);
        auditData.put("timestamp", LocalDateTime.now());
        return auditData;
    }

    /**
     * Log security-related configuration events
     */
    public void logSecurityConfigEvent(String event, String details) {
        Map<String, Object> auditData = new HashMap<>();
        auditData.put("event", "SECURITY_CONFIG");
        auditData.put("type", event);
        auditData.put("details", details);
        auditData.put("timestamp", LocalDateTime.now());
        log.info("Security configuration event: {}", auditData);
    }
}
