package dev.bengi.userservice.config.database;

import lombok.RequiredArgsConstructor;
import org.flywaydb.core.Flyway;
import org.springframework.beans.factory.InitializingBean;
import lombok.extern.slf4j.Slf4j;

/**
 * Executes Flyway migrations during application startup.
 * Handles null Flyway instances gracefully in case of database connection issues.
 */
@Slf4j
@RequiredArgsConstructor
public class FlywayMigrationInitializer implements InitializingBean {

    private final Flyway flyway;

    @Override
    public void afterPropertiesSet() {
        if (flyway != null) {
            log.info("Starting Flyway database migrations");
            try {
                flyway.migrate();
                log.info("Flyway database migrations completed successfully");
            } catch (Exception e) {
                log.error("Error executing Flyway migrations: {}", e.getMessage(), e);
                // Don't rethrow - let the application continue to start
                // In production environments, you might want to rethrow for critical migrations
            }
        } else {
            log.warn("Flyway instance is null, skipping database migrations");
        }
    }
} 