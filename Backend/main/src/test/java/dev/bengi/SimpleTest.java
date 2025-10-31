package dev.bengi;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertTrue;

class SimpleTest {

    @Test
    void basicTest() {
        // Simple test to verify JUnit is working
        assertTrue(true, "Basic test should pass");
    }

    @Test
    void verifyJavaVersion() {
        // Verify we're using Java 17 or newer (Spring Boot 3.5 supports 17/21)
        String specVersion = System.getProperty("java.specification.version");
        int major;
        try {
            // specVersion is typically "17" or "21"
            major = Integer.parseInt(specVersion.split("\\.")[0]);
        } catch (Exception e) {
            String ver = System.getProperty("java.version");
            // Fallback: parse from full version like "17.0.2"
            major = Integer.parseInt(ver.split("\\.")[0]);
        }
        assertTrue(major >= 17, "Expected Java 17+ but found: " + System.getProperty("java.version"));
    }
}
