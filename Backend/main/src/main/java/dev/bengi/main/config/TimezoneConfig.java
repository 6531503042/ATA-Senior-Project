package dev.bengi.main.config;

import org.springframework.context.annotation.Configuration;

import jakarta.annotation.PostConstruct;
import java.time.ZoneId;
import java.util.TimeZone;

/**
 * Configuration to set default timezone to Asia/Bangkok (Thailand timezone - GMT+7)
 * This ensures all DateTime operations use Thai timezone by default
 */
@Configuration
public class TimezoneConfig {

    public static final ZoneId THAILAND_ZONE = ZoneId.of("Asia/Bangkok");
    public static final String THAILAND_ZONE_STRING = "Asia/Bangkok";

    @PostConstruct
    public void init() {
        // Set default timezone for the entire application to Thailand timezone
        TimeZone.setDefault(TimeZone.getTimeZone(THAILAND_ZONE));
        System.setProperty("user.timezone", THAILAND_ZONE_STRING);
    }

    /**
     * Get Thailand timezone
     * @return ZoneId for Asia/Bangkok
     */
    public static ZoneId getThailandZone() {
        return THAILAND_ZONE;
    }

    /**
     * Get current time in Thailand timezone
     * @return Current LocalDateTime in Thailand timezone
     */
    public static java.time.LocalDateTime nowInThailand() {
        return java.time.LocalDateTime.now(THAILAND_ZONE);
    }

    /**
     * Convert UTC time to Thailand time
     * @param utcTime UTC LocalDateTime
     * @return LocalDateTime in Thailand timezone
     */
    public static java.time.LocalDateTime convertToThailand(java.time.LocalDateTime utcTime) {
        return utcTime.atZone(ZoneId.of("UTC"))
                .withZoneSameInstant(THAILAND_ZONE)
                .toLocalDateTime();
    }

    /**
     * Convert Thailand time to UTC
     * @param thailandTime LocalDateTime in Thailand timezone
     * @return LocalDateTime in UTC
     */
    public static java.time.LocalDateTime convertToUTC(java.time.LocalDateTime thailandTime) {
        return thailandTime.atZone(THAILAND_ZONE)
                .withZoneSameInstant(ZoneId.of("UTC"))
                .toLocalDateTime();
    }
}
