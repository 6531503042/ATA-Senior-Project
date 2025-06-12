package dev.bengi.userservice.security;

import java.util.Arrays;
import java.util.List;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.reactive.result.method.annotation.RequestMappingHandlerMapping;

import dev.bengi.userservice.config.security.TokenService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;

@Component
@RequiredArgsConstructor
@Slf4j
public class PermissionInterceptor implements WebFilter {

    private final TokenService tokenService;
    private final RequestMappingHandlerMapping handlerMapping;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        return handlerMapping.getHandler(exchange)
            .cast(HandlerMethod.class)
            .flatMap(handlerMethod -> {
                RequirePermissions annotation = handlerMethod.getMethodAnnotation(RequirePermissions.class);
                if (annotation == null) {
                    log.debug("No @RequirePermissions annotation found, proceeding with chain");
                    return chain.filter(exchange);
                }

                String token = extractToken(exchange);
                if (token == null) {
                    log.warn("No token provided");
                    return Mono.error(new AccessDeniedException("No token provided"));
                }

                List<String> userPermissions = tokenService.extractAuthorities(token);
                String[] requiredPermissions = annotation.value();
                
                log.info("Checking permissions for endpoint: {}", exchange.getRequest().getPath());
                log.info("User permissions: {}", userPermissions);
                log.info("Required permissions: {}", Arrays.toString(requiredPermissions));

                return checkPermissions(userPermissions, requiredPermissions)
                    .flatMap(hasPermission -> {
                        if (hasPermission) {
                            log.info("Permission check passed");
                            return chain.filter(exchange);
                        }
                        log.warn("Insufficient permissions. User permissions: {}, Required: {}", 
                                userPermissions, Arrays.toString(requiredPermissions));
                        return Mono.error(new AccessDeniedException("Insufficient permissions"));
                    });
            })
            .switchIfEmpty(chain.filter(exchange));
    }

    private Mono<Boolean> checkPermissions(List<String> userPermissions, String[] requiredPermissions) {
        return Mono.fromSupplier(() -> {
            if (userPermissions == null || userPermissions.isEmpty()) {
                log.warn("No user permissions found");
                return false;
            }

            // Check for wildcard permission first
            if (userPermissions.contains("*")) {
                log.debug("User has wildcard permission");
                return true;
            }

            // Check for ROLE_ADMIN (which implicitly has all permissions)
            if (userPermissions.contains("ROLE_ADMIN")) {
                log.debug("User has ROLE_ADMIN");
                return true;
            }

            // Check each required permission
            for (String required : requiredPermissions) {
                if (!hasPermission(userPermissions, required)) {
                    log.debug("Missing required permission: {}", required);
                    return false;
                }
            }
            
            return true;
        });
    }

    private boolean hasPermission(List<String> userPermissions, String requiredPermission) {
        // Direct match
        if (userPermissions.contains(requiredPermission)) {
            return true;
        }

        // Check for resource-level wildcard
        String resource = requiredPermission.split(":")[0];
        return userPermissions.contains(resource + ":*");
    }

    private String extractToken(ServerWebExchange exchange) {
        String bearerToken = exchange.getRequest().getHeaders().getFirst("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
} 