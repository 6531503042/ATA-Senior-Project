package dev.bengi.main.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.annotation.method.configuration.EnableReactiveMethodSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.authentication.ReactiveAuthenticationManager;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsConfigurationSource;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;
import org.springframework.security.config.Customizer;
import reactor.core.publisher.Mono;

import java.time.Duration;

/**
 * Security configuration for the application
 * Handles authentication, authorization, CORS, and security headers
 */
@Configuration
@EnableWebFluxSecurity
@EnableReactiveMethodSecurity
public class SecurityConfig {

    @Value("${app.allowed-origins:http://localhost:3000,http://localhost:3001}")
    private String[] allowedOrigins;

    @Bean
    public ReactiveAuthenticationManager reactiveAuthenticationManager() {
        // This is needed for reactive method security to work properly
        return authentication -> {
            // JWT tokens are already validated in JwtAuthenticationFilter
            // This manager just returns the authentication as-is
            return Mono.just(authentication);
        };
    }

    @Bean
    @Order(1)
    @ConditionalOnProperty(name = "app.security.rate-limit.enabled", havingValue = "false", matchIfMissing = true)
    public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http, 
                                                           ReactiveAuthenticationManager authManager) {
        return http
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                .cors(Customizer.withDefaults())
                
                // Authentication Manager
                .authenticationManager(authManager)
                
                // Security Headers
                .headers(Customizer.withDefaults())
                
                // Authorization Rules - use method-level security for fine-grained control
                .authorizeExchange(auth -> auth
                        // Public endpoints
                        .pathMatchers(HttpMethod.POST, "/api/auth/login", "/api/auth/register").permitAll()
                        .pathMatchers(HttpMethod.GET, "/api/auth/validate").permitAll()
                        .pathMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .pathMatchers("/actuator/health", "/actuator/info").permitAll()
                        .pathMatchers("/actuator/**").hasRole("ADMIN")
                        
                        // All other API endpoints require authentication
                        // Role-based authorization is handled by @PreAuthorize in controllers
                        .pathMatchers("/api/**").authenticated()
                        
                        // Default - deny all other requests
                        .anyExchange().denyAll()
                )
                
                // Disable unused auth methods
                .httpBasic(ServerHttpSecurity.HttpBasicSpec::disable)
                .formLogin(ServerHttpSecurity.FormLoginSpec::disable)
                
                // Exception handling
                .exceptionHandling(exceptions -> exceptions
                        .authenticationEntryPoint((exchange, ex) -> {
                            exchange.getResponse().setStatusCode(org.springframework.http.HttpStatus.UNAUTHORIZED);
                            return exchange.getResponse().setComplete();
                        })
                        .accessDeniedHandler((exchange, denied) -> {
                            exchange.getResponse().setStatusCode(org.springframework.http.HttpStatus.FORBIDDEN);
                            return exchange.getResponse().setComplete();
                        })
                )
                
                .build();
    }

    @Bean
    @Order(2)
    @ConditionalOnProperty(name = "app.security.rate-limit.enabled", havingValue = "true")
    public SecurityWebFilterChain springSecurityFilterChainWithRateLimit(ServerHttpSecurity http, 
                                                                        ReactiveAuthenticationManager authManager) {
        return http
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                .cors(Customizer.withDefaults())
                
                // Authentication Manager
                .authenticationManager(authManager)
                
                // Security Headers
                .headers(Customizer.withDefaults())
                
                // Authorization Rules - use method-level security for fine-grained control
                .authorizeExchange(auth -> auth
                        // Public endpoints
                        .pathMatchers(HttpMethod.POST, "/api/auth/login", "/api/auth/register").permitAll()
                        .pathMatchers(HttpMethod.GET, "/api/auth/validate").permitAll()
                        .pathMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .pathMatchers("/actuator/health", "/actuator/info").permitAll()
                        .pathMatchers("/actuator/**").hasRole("ADMIN")
                        
                        // All other API endpoints require authentication
                        // Role-based authorization is handled by @PreAuthorize in controllers
                        .pathMatchers("/api/**").authenticated()
                        
                        // Default - deny all other requests
                        .anyExchange().denyAll()
                )
                
                // Disable unused auth methods
                .httpBasic(ServerHttpSecurity.HttpBasicSpec::disable)
                .formLogin(ServerHttpSecurity.FormLoginSpec::disable)
                
                // Exception handling
                .exceptionHandling(exceptions -> exceptions
                        .authenticationEntryPoint((exchange, ex) -> {
                            exchange.getResponse().setStatusCode(org.springframework.http.HttpStatus.UNAUTHORIZED);
                            return exchange.getResponse().setComplete();
                        })
                        .accessDeniedHandler((exchange, denied) -> {
                            exchange.getResponse().setStatusCode(org.springframework.http.HttpStatus.FORBIDDEN);
                            return exchange.getResponse().setComplete();
                        })
                )
                
                .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Set allowed origins from environment
        configuration.setAllowedOrigins(java.util.List.of(allowedOrigins));
        
        // Allowed methods
        configuration.setAllowedMethods(java.util.List.of(
                "GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"
        ));
        
        // Allowed headers
        configuration.setAllowedHeaders(java.util.List.of(
                "Authorization", 
                "Content-Type", 
                "X-Requested-With",
                "Accept",
                "Origin",
                "Access-Control-Request-Method",
                "Access-Control-Request-Headers"
        ));
        
        // Exposed headers
        configuration.setExposedHeaders(java.util.List.of(
                "Authorization",
                "Content-Disposition"
        ));
        
        // Security settings
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(Duration.ofHours(1));
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}


