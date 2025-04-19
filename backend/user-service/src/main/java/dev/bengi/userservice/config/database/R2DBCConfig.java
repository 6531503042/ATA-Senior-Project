package dev.bengi.userservice.config.database;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.r2dbc.config.AbstractR2dbcConfiguration;
import org.springframework.data.r2dbc.repository.config.EnableR2dbcRepositories;
import org.springframework.r2dbc.connection.R2dbcTransactionManager;
import org.springframework.transaction.ReactiveTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import io.r2dbc.postgresql.PostgresqlConnectionConfiguration;
import io.r2dbc.postgresql.PostgresqlConnectionFactory;
import io.r2dbc.spi.ConnectionFactory;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;

@Slf4j
@Configuration
@EnableR2dbcRepositories(basePackages = "dev.bengi.userservice.repository")
@EnableTransactionManagement
public class R2DBCConfig extends AbstractR2dbcConfiguration {

    @Value("${spring.r2dbc.username}")
    private String username;
    
    @Value("${spring.r2dbc.password}")
    private String password;
    
    @Value("${spring.r2dbc.database}")
    private String database;
    
    @Value("${spring.r2dbc.host}")
    private String host;
    
    @Value("${spring.r2dbc.port}")
    private int port;

    @Override
    @Bean
    public ConnectionFactory connectionFactory() {
        log.info("Initializing R2DBC connection factory to {}:{}/{}", host, port, database);
        
        try {
            return new PostgresqlConnectionFactory(
                PostgresqlConnectionConfiguration.builder()
                    .host(host)
                    .port(port)
                    .username(username)
                    .password(password)
                    .database(database)
                    .build()
            );
        } catch (Exception e) {
            log.error("Failed to initialize R2DBC connection factory: {}", e.getMessage(), e);
            throw e;
        }
    }
    
    @Bean
    ReactiveTransactionManager transactionManager(ConnectionFactory connectionFactory) {
        return new R2dbcTransactionManager(connectionFactory);
    }
} 