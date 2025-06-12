package dev.bengi.feedbackservice.util;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Utility class for handling reactive types correctly.
 * This is a temporary solution to help with migration to reactive programming.
 * In a fully reactive application, we should avoid blocking operations.
 */
public class ReactiveHelper {
    private static final Logger log = LoggerFactory.getLogger(ReactiveHelper.class);

    /**
     * Safely blocks on a Mono and returns the result, handling null values.
     * @param mono The Mono to block on
     * @param <T> The type of the Mono
     * @return The result of the Mono, or null if the Mono is empty
     */
    public static <T> T safeBlock(Mono<T> mono) {
        if (mono == null) {
            return null;
        }
        
        try {
            return mono.block();
        } catch (Exception e) {
            log.error("Error blocking on Mono: {}", e.getMessage());
            return null;
        }
    }

    /**
     * Safely blocks on a Flux and returns the result as a List, handling null values.
     * @param flux The Flux to block on
     * @param <T> The type of the Flux
     * @return The result of the Flux as a List, or an empty List if the Flux is empty
     */
    public static <T> List<T> safeBlockList(Flux<T> flux) {
        if (flux == null) {
            return List.of();
        }
        
        try {
            return flux.collectList().block();
        } catch (Exception e) {
            log.error("Error blocking on Flux: {}", e.getMessage());
            return List.of();
        }
    }

    /**
     * Safely converts a Mono<Boolean> to a boolean, handling null values.
     * @param mono The Mono<Boolean> to convert
     * @return The boolean value, or false if the Mono is empty
     */
    public static boolean safeBlockBoolean(Mono<Boolean> mono) {
        if (mono == null) {
            return false;
        }
        
        try {
            return Boolean.TRUE.equals(mono.block());
        } catch (Exception e) {
            log.error("Error blocking on Mono<Boolean>: {}", e.getMessage());
            return false;
        }
    }

    /**
     * Safely converts a Mono<Long> to a long, handling null values.
     * @param mono The Mono<Long> to convert
     * @return The long value, or 0 if the Mono is empty
     */
    public static long safeBlockLong(Mono<Long> mono) {
        if (mono == null) {
            return 0L;
        }
        
        try {
            Long value = mono.block();
            return value != null ? value : 0L;
        } catch (Exception e) {
            log.error("Error blocking on Mono<Long>: {}", e.getMessage());
            return 0L;
        }
    }

    /**
     * Safely converts a Mono<Double> to a double, handling null values.
     * @param mono The Mono<Double> to convert
     * @return The double value, or 0.0 if the Mono is empty
     */
    public static double safeBlockDouble(Mono<Double> mono) {
        if (mono == null) {
            return 0.0;
        }
        
        try {
            Double value = mono.block();
            return value != null ? value : 0.0;
        } catch (Exception e) {
            log.error("Error blocking on Mono<Double>: {}", e.getMessage());
            return 0.0;
        }
    }

    /**
     * Safely converts an Optional to its value, handling null values.
     * @param optional The Optional to convert
     * @param <T> The type of the Optional
     * @return The value, or null if the Optional is empty
     */
    public static <T> T safeGet(Optional<T> optional) {
        return optional != null && optional.isPresent() ? optional.get() : null;
    }
} 