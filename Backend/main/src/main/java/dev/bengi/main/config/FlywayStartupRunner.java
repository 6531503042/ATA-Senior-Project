package dev.bengi.main.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.flywaydb.core.Flyway;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class FlywayStartupRunner {

    private final Flyway flyway;

    @EventListener(ApplicationReadyEvent.class)
    public void migrateOnStartup() {
        try {
            log.info("Flyway: starting migration");
            flyway.migrate();
            log.info("Flyway: migration finished successfully");
        } catch (Exception e) {
            log.error("Flyway: migration failed - {}", e.getMessage(), e);
        }
    }
}


