package dev.bengi.main.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.r2dbc.connection.R2dbcTransactionManager;
import org.springframework.transaction.ReactiveTransactionManager;
import io.r2dbc.spi.ConnectionFactory;

/**
 * Transaction configuration to resolve transaction manager conflicts
 * between JDBC (Flyway) and R2DBC.
 */
@Configuration
public class TransactionConfig {

    /**
     * Sets the R2DBC transaction manager as the primary one.
     * This resolves the conflict when multiple transaction managers are present.
     */
    @Bean
    @Primary
    public ReactiveTransactionManager reactiveTransactionManager(ConnectionFactory connectionFactory) {
        return new R2dbcTransactionManager(connectionFactory);
    }
}
