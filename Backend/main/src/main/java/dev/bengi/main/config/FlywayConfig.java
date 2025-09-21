package dev.bengi.main.config;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.flywaydb.core.Flyway;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;

@Configuration
@Slf4j
public class FlywayConfig {

    @Value("${spring.flyway.locations:classpath:db/migration}")
    private String locations;

    @Value("${spring.flyway.baseline-on-migrate:true}")
    private boolean baselineOnMigrate;

    @Value("${spring.flyway.out-of-order:true}")
    private boolean outOfOrder;

    @Value("${spring.flyway.validate-on-migrate:false}")
    private boolean validateOnMigrate;

    @Bean
    public Flyway flyway(DataSource dataSource) {
        log.info("Configuring Flyway with locations={} baselineOnMigrate={} outOfOrder={} validateOnMigrate={}", locations, baselineOnMigrate, outOfOrder, validateOnMigrate);
        return Flyway.configure()
                .dataSource(dataSource)
                .locations(locations)
                .baselineOnMigrate(baselineOnMigrate)
                .outOfOrder(outOfOrder)
                .validateOnMigrate(validateOnMigrate)
                .load();
    }
}


