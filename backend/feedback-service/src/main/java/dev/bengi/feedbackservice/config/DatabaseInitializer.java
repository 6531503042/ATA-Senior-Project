package dev.bengi.feedbackservice.config;

import javax.sql.DataSource;

import org.flywaydb.core.Flyway;
import org.springframework.boot.autoconfigure.flyway.FlywayProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.DependsOn;
import org.springframework.core.env.Environment;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Configuration
@RequiredArgsConstructor
@EnableConfigurationProperties(FlywayProperties.class)
public class DatabaseInitializer {

    private final Environment env;

    /**
     * Configure Flyway for database migrations.
     * This is done using a DataSource from the Spring context to ensure
     * Flyway can work properly alongside R2DBC.
     */
    @Bean(initMethod = "migrate")
    public Flyway flyway() {
        log.info("Initializing Flyway for database migrations");
        
        String url = env.getProperty("spring.flyway.url");
        String user = env.getProperty("spring.flyway.user");
        String password = env.getProperty("spring.flyway.password");
        
        return Flyway.configure()
                .dataSource(url, user, password)
                .locations(env.getProperty("spring.flyway.locations"))
                .baselineOnMigrate(true)
                .load();
    }
}
