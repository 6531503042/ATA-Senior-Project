package dev.bengi.main.config;

import io.r2dbc.spi.ConnectionFactoryOptions;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.core.env.Environment;
import org.springframework.r2dbc.core.DatabaseClient;
import org.springframework.stereotype.Component;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import reactor.core.publisher.Mono;

import java.time.Duration;

import static io.r2dbc.spi.ConnectionFactoryOptions.*;

@Component
@Slf4j
@RequiredArgsConstructor
public class DatabaseStartupLogger {

    private final Environment environment;
    private final DatabaseClient databaseClient;

    @EventListener(ApplicationReadyEvent.class)
    public void logDatabaseInfo() {
        String url = environment.getProperty("spring.r2dbc.url", "");
        try {
            ConnectionFactoryOptions opts = ConnectionFactoryOptions.parse(url);
            String driver = String.valueOf(opts.getValue(DRIVER));
            String host = String.valueOf(opts.getValue(HOST));
            Object portObj = opts.getValue(PORT);
            Integer port = (portObj instanceof Integer i) ? i : null;
            String database = String.valueOf(opts.getValue(DATABASE));

            log.info("R2DBC connecting to {}://{}:{} / {}", driver, host, port, database);
        } catch (Exception e) {
            log.warn("Could not parse R2DBC URL '{}': {}", url, e.getMessage());
        }

        String jdbcUrl = environment.getProperty("spring.datasource.url");
        if (jdbcUrl != null) {
            log.info("JDBC (Flyway) url: {}", jdbcUrl);
        }

        long start = System.currentTimeMillis();
        databaseClient.sql("SELECT 1")
                .fetch().first()
                .timeout(Duration.ofSeconds(5))
                .doOnNext(row -> {
                    long ms = System.currentTimeMillis() - start;
                    log.info("Database connectivity OK ({} ms)", ms);
                })
                .doOnError(err -> log.error("Database connectivity FAILED: {}", err.getMessage(), err))
                .onErrorResume(err -> Mono.empty())
                .subscribe();
    }
}


