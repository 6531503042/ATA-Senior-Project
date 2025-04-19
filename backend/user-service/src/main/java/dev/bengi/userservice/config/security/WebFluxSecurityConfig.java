package dev.bengi.userservice.config.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.ReactiveAuthenticationManager;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.SecurityWebFiltersOrder;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.security.web.server.context.NoOpServerSecurityContextRepository;
import org.springframework.web.cors.reactive.CorsConfigurationSource;

import dev.bengi.userservice.config.security.jwt.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;

/**
 * Security configuration for Spring WebFlux
 */
@Slf4j
@Configuration
@EnableWebFluxSecurity
@RequiredArgsConstructor
public class WebFluxSecurityConfig {
    
    private final ReactiveAuthenticationManager authenticationManager;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final CorsConfigurationSource corsConfigurationSource;

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
        log.info("Configuring security web filter chain");
        
        // Add a request logger for diagnostics
        ServerHttpSecurity securityWithLogger = http.addFilterBefore((exchange, chain) -> {
            String path = exchange.getRequest().getPath().value();
            String method = exchange.getRequest().getMethod().toString();
            log.debug("Request received: {} {}", method, path);
            return chain.filter(exchange);
        }, SecurityWebFiltersOrder.FIRST);
        
        return securityWithLogger
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                .httpBasic(ServerHttpSecurity.HttpBasicSpec::disable)
                .formLogin(ServerHttpSecurity.FormLoginSpec::disable)
                .securityContextRepository(NoOpServerSecurityContextRepository.getInstance())
                .exceptionHandling(exceptionHandlingSpec -> exceptionHandlingSpec
                        .authenticationEntryPoint((exchange, ex) -> {
                            log.error("Authentication entry point error: {} - Path: {}, Method: {}", 
                                ex.getMessage(), 
                                exchange.getRequest().getPath(),
                                exchange.getRequest().getMethod());
                            return Mono.fromRunnable(() -> 
                                exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED));
                        })
                        .accessDeniedHandler((exchange, denied) -> {
                            log.error("Access denied: {} - Path: {}, Method: {}", 
                                denied.getMessage(), 
                                exchange.getRequest().getPath(),
                                exchange.getRequest().getMethod());
                            return Mono.fromRunnable(() -> 
                                exchange.getResponse().setStatusCode(HttpStatus.FORBIDDEN));
                        }))
                .authorizeExchange(exchanges -> exchanges
                        // Public endpoints
                        .pathMatchers("/api/auth/**").permitAll()
                        .pathMatchers(HttpMethod.POST, "/api/auth/login", "/api/auth/register", "/api/auth/signup", "/api/auth/signin").permitAll()
                        .pathMatchers(HttpMethod.GET, "/api/auth/validate", "/api/auth/validateToken").permitAll()
                        .pathMatchers(HttpMethod.GET, "/api/test/public").permitAll()
                        .pathMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html", "/webjars/**", "/swagger-resources/**").permitAll()
                        // Protected endpoints
                        .pathMatchers("/api/manager/**").hasAuthority("ROLE_ADMIN")
                        .pathMatchers(HttpMethod.POST, "/api/departments/**").hasAuthority("ROLE_ADMIN")
                        .pathMatchers(HttpMethod.PUT, "/api/departments/**").hasAuthority("ROLE_ADMIN")
                        .pathMatchers(HttpMethod.DELETE, "/api/departments/**").hasAuthority("ROLE_ADMIN")
                        .pathMatchers(HttpMethod.GET, "/api/departments/**").permitAll()
                        .pathMatchers("/api/roles/**").hasAuthority("ROLE_ADMIN")
                        .pathMatchers(HttpMethod.POST, "/api/roles/**").hasAuthority("ROLE_ADMIN")
                        // Require authentication for all other requests
                        .anyExchange().authenticated())
                .addFilterAt(jwtAuthenticationFilter, SecurityWebFiltersOrder.AUTHENTICATION)
                .cors(corsSpec -> corsSpec.configurationSource(corsConfigurationSource))
                .build();
    }
} 