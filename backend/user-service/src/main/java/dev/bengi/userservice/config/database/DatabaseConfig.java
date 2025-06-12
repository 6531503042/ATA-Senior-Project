package dev.bengi.userservice.config.database;

import io.r2dbc.postgresql.PostgresqlConnectionConfiguration;
import io.r2dbc.postgresql.PostgresqlConnectionFactory;
import io.r2dbc.spi.ConnectionFactory;
import org.flywaydb.core.Flyway;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.data.r2dbc.config.AbstractR2dbcConfiguration;
import org.springframework.data.r2dbc.repository.config.EnableR2dbcRepositories;
import org.springframework.r2dbc.connection.R2dbcTransactionManager;
import org.springframework.transaction.ReactiveTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@Configuration
@EnableR2dbcRepositories(basePackages = "dev.bengi.userservice.repository")
@EnableTransactionManagement
public class DatabaseConfig extends AbstractR2dbcConfiguration {

    @Value("${spring.r2dbc.username}")
    private String username;

    @Value("${spring.r2dbc.password}")
    private String password;

    @Value("${spring.r2dbc.url}")
    private String url;

    private final Environment env;

    public DatabaseConfig(Environment env) {
        this.env = env;
    }

    @Override
    @Bean
    public ConnectionFactory connectionFactory() {
        String cleanUrl = url.replace("r2dbc:postgresql://", "");
        String host = cleanUrl.split(":")[0];
        int port = Integer.parseInt(cleanUrl.split(":")[1].split("/")[0]);
        String database = cleanUrl.split("/")[1];

        return new PostgresqlConnectionFactory(
            PostgresqlConnectionConfiguration.builder()
                .host(host)
                .port(port)
                .database(database)
                .username(username)
                .password(password)
                .build()
        );
    }

    @Bean
    public ReactiveTransactionManager transactionManager(ConnectionFactory connectionFactory) {
        return new R2dbcTransactionManager(connectionFactory);
    }

    @Bean(initMethod = "migrate")
    public Flyway flyway() {
        String jdbcUrl = url.replace("r2dbc:", "jdbc:");
        
        return Flyway.configure()
            .dataSource(jdbcUrl, username, password)
            .locations("classpath:db/migration")
            .baselineOnMigrate(true)
            .load();
    }
}