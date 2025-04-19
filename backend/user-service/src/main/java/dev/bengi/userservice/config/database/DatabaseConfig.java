package dev.bengi.userservice.config.database;

import io.r2dbc.spi.ConnectionFactory;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.autoconfigure.flyway.FlywayProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.core.env.Environment;
import org.springframework.r2dbc.connection.init.ConnectionFactoryInitializer;
import org.springframework.r2dbc.connection.init.ResourceDatabasePopulator;

import java.sql.SQLException;
import java.util.Arrays;

@Slf4j
@Configuration
@RequiredArgsConstructor
@EnableConfigurationProperties(FlywayProperties.class)
public class DatabaseConfig {

    private final Environment env;
    private final ConnectionFactory connectionFactory;

    @Bean
    @ConditionalOnProperty(name = "spring.flyway.enabled", havingValue = "true", matchIfMissing = true)
    public ConnectionFactoryInitializer initializer() {
        try {
            // Check if database is available
            if (isDatabaseAvailable()) {
                log.info("Database connection successful, initializing connection factory");
                ConnectionFactoryInitializer initializer = new ConnectionFactoryInitializer();
                initializer.setConnectionFactory(connectionFactory);
                
                // Add any schema or data initialization scripts if needed
                // ResourceDatabasePopulator populator = new ResourceDatabasePopulator();
                // initializer.setDatabasePopulator(populator);
                
                return initializer;
            } else {
                log.warn("Database connection failed, skipping connection factory initialization");
                return null;
            }
        } catch (Exception e) {
            log.error("Failed to initialize database: {}", e.getMessage());
            if (Arrays.asList(env.getActiveProfiles()).contains("dev")) {
                log.warn("Running in dev mode, continuing without database initialization");
                return null;
            } else {
                throw new RuntimeException("Database initialization failed", e);
            }
        }
    }
    
    private boolean isDatabaseAvailable() {
        try {
            String url = env.getProperty("spring.flyway.url");
            String user = env.getProperty("spring.flyway.user");
            String password = env.getProperty("spring.flyway.password");
            
            if (url == null || user == null || password == null) {
                log.warn("Database configuration missing - url: {}, user: {}, password: {}",
                    url == null ? "missing" : "present",
                    user == null ? "missing" : "present",
                    password == null ? "missing" : "present"
                );
                return false;
            }
            
            java.sql.DriverManager.getConnection(url, user, password).close();
            return true;
        } catch (SQLException e) {
            log.error("Failed to connect to database: {}", e.getMessage());
            return false;
        }
    }
}