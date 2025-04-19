package dev.bengi.userservice.config.security;

import java.util.Arrays;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.core.env.Environment;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.cors.reactive.CorsWebFilter;

/**
 * Unified CORS configuration for the application
 */
@Configuration
public class SecurityProfileConfig {

    private final Environment env;

    public SecurityProfileConfig(Environment env) {
        this.env = env;
    }

    /**
     * CORS configuration for servlet-based security.
     */
    @Bean
    @Primary
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = createCorsConfig();
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", configuration);
        return source;
    }

    /**
     * CORS configuration for reactive (WebFlux) security.
     */
    @Bean
    public org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource reactiveCorsConfigurationSource() {
        CorsConfiguration configuration = createCorsConfig();
        org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource source = 
            new org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", configuration);
        return source;
    }
    
    /**
     * Create a CorsWebFilter for WebFlux
     */
    @Bean
    public CorsWebFilter corsWebFilter() {
        return new CorsWebFilter(reactiveCorsConfigurationSource());
    }

    /**
     * Create a common CORS configuration.
     */
    private CorsConfiguration createCorsConfig() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Use configured origins or default to localhost
        String[] allowedOrigins = env.getProperty("cors.allowed-origins", String[].class, 
                new String[]{"http://localhost:3000"});
        configuration.setAllowedOrigins(Arrays.asList(allowedOrigins));
        
        // Common settings for all environments
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Requested-With"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);
        
        return configuration;
    }
} 