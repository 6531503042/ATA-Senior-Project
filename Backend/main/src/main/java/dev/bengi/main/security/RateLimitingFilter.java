package dev.bengi.main.security;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.HttpStatus;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Rate limiting filter to prevent abuse and DoS attacks
 * Tracks requests per IP address with configurable limits
 */
@Component
@ConditionalOnProperty(name = "app.security.rate-limit.enabled", havingValue = "true", matchIfMissing = false)
@Slf4j
public class RateLimitingFilter implements WebFilter {

    @Value("${app.security.rate-limit.requests-per-minute:100}")
    private int requestsPerMinute;

    @Value("${app.security.rate-limit.auth-requests-per-minute:5}")
    private int authRequestsPerMinute;

    private final ConcurrentHashMap<String, ClientRequestInfo> requestCounts = new ConcurrentHashMap<>();
    private final SecurityAuditService auditService;

    public RateLimitingFilter(SecurityAuditService auditService) {
        this.auditService = auditService;
    }

    @Override
    @NonNull
    public Mono<Void> filter(@NonNull ServerWebExchange exchange, @NonNull WebFilterChain chain) {
        String clientIp = auditService.getClientIpAddress(exchange);
        String path = exchange.getRequest().getPath().value();
        
        // Check rate limits
        if (isRateLimited(clientIp, path)) {
            log.warn("Rate limit exceeded for IP: {} on path: {}", clientIp, path);
            return handleRateLimitExceeded(exchange, clientIp);
        }

        // Continue with the request
        return chain.filter(exchange);
    }

    private boolean isRateLimited(String clientIp, String path) {
        Instant now = Instant.now();
        ClientRequestInfo clientInfo = requestCounts.computeIfAbsent(clientIp, k -> new ClientRequestInfo());

        // Clean up old entries periodically
        if (clientInfo.lastCleanup.isBefore(now.minus(Duration.ofMinutes(2)))) {
            cleanupExpiredEntries();
            clientInfo.lastCleanup = now;
        }

        // Check if it's an auth endpoint
        boolean isAuthEndpoint = path.startsWith("/api/auth/");
        int limit = isAuthEndpoint ? authRequestsPerMinute : requestsPerMinute;

        // Check rate limit for current minute
        String currentMinute = now.toString().substring(0, 16); // YYYY-MM-DDTHH:MM
        
        if (!clientInfo.currentMinute.equals(currentMinute)) {
            // New minute, reset counter
            clientInfo.currentMinute = currentMinute;
            clientInfo.requestCount.set(0);
        }

        int currentCount = clientInfo.requestCount.incrementAndGet();
        
        return currentCount > limit;
    }

    private Mono<Void> handleRateLimitExceeded(ServerWebExchange exchange, String clientIp) {
        exchange.getResponse().setStatusCode(HttpStatus.TOO_MANY_REQUESTS);
        exchange.getResponse().getHeaders().add("Content-Type", "application/json");
        exchange.getResponse().getHeaders().add("Retry-After", "60");
        
        String errorResponse = String.format(
                "{\"error\":\"Rate limit exceeded\",\"message\":\"Too many requests. Please try again later.\",\"retryAfter\":60,\"timestamp\":\"%s\"}",
                Instant.now()
        );
        
        org.springframework.core.io.buffer.DataBuffer buffer = 
                exchange.getResponse().bufferFactory().wrap(errorResponse.getBytes());
        
        return exchange.getResponse().writeWith(Mono.just(buffer));
    }

    private void cleanupExpiredEntries() {
        Instant cutoff = Instant.now().minus(Duration.ofMinutes(5));
        requestCounts.entrySet().removeIf(entry -> 
                entry.getValue().lastCleanup.isBefore(cutoff));
    }

    /**
     * Tracks request information per client IP
     */
    private static class ClientRequestInfo {
        volatile String currentMinute = "";
        final AtomicInteger requestCount = new AtomicInteger(0);
        volatile Instant lastCleanup = Instant.now();
    }
}
