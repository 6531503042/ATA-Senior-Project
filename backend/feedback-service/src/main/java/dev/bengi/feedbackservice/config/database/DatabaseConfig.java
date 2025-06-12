package dev.bengi.feedbackservice.config.database;

import io.r2dbc.spi.ConnectionFactory;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.flywaydb.core.Flyway;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.flyway.FlywayProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.data.r2dbc.config.AbstractR2dbcConfiguration;
import org.springframework.data.r2dbc.repository.config.EnableR2dbcRepositories;
import org.springframework.r2dbc.connection.init.ConnectionFactoryInitializer;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import io.r2dbc.postgresql.PostgresqlConnectionConfiguration;
import io.r2dbc.postgresql.PostgresqlConnectionFactory;
import org.springframework.r2dbc.core.DatabaseClient;

@Slf4j
@Configuration
@RequiredArgsConstructor
@EnableConfigurationProperties(FlywayProperties.class)
@EnableR2dbcRepositories(basePackages = "dev.bengi.feedbackservice.repository")
@EnableTransactionManagement
public class DatabaseConfig extends AbstractR2dbcConfiguration {

    private final Environment env;

    @Value("${spring.r2dbc.username}")
    private String username;

    @Value("${spring.r2dbc.password}")
    private String password;

    @Value("${spring.r2dbc.url}")
    private String url;

    @Override
    @Bean
    public ConnectionFactory connectionFactory() {
        // Parse the R2DBC URL for PostgreSQL
        // Expected format: r2dbc:postgresql://localhost:3307/feedback
        String[] parts = url.split("://");
        String[] hostDb = parts[1].split("/");
        String[] hostPort = hostDb[0].split(":");
        
        String host = hostPort[0];
        int port = Integer.parseInt(hostPort[1]);
        String database = hostDb[1];

        return new PostgresqlConnectionFactory(
                PostgresqlConnectionConfiguration.builder()
                        .host(host)
                        .port(port)
                        .database(database)
                        .username(username)
                        .password(password)
                        .build());
    }

    @Bean
    public DatabaseClient databaseClient(ConnectionFactory connectionFactory) {
        return DatabaseClient.create(connectionFactory);
    }

    @Bean
    public ConnectionFactoryInitializer initializer(ConnectionFactory connectionFactory) {
        ConnectionFactoryInitializer initializer = new ConnectionFactoryInitializer();
        initializer.setConnectionFactory(connectionFactory);
        return initializer;
    }

    @Bean
    public Flyway flyway() {
        String jdbcUrl = env.getProperty("spring.flyway.url");
        String user = env.getProperty("spring.flyway.user");
        String pass = env.getProperty("spring.flyway.password");
        
        log.info("Configuring Flyway with URL: {}", jdbcUrl);
        
        return Flyway.configure()
            .dataSource(jdbcUrl, user, pass)
            .locations(env.getProperty("spring.flyway.locations", "classpath:db/migration"))
            .baselineOnMigrate(env.getProperty("spring.flyway.baseline-on-migrate", Boolean.class, true))
            .validateOnMigrate(false)
            .cleanDisabled(false)
            .load();
    }
    
    @Bean
    public boolean runFlywayMigration(Flyway flyway) {
        try {
            flyway.migrate();
            log.info("Flyway migration completed successfully");
            return true;
        } catch (Exception e) {
            log.error("Flyway migration failed: {}", e.getMessage(), e);
            return false;
        }
    }
} 