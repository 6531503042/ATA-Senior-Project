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
        // Verify we're using Java 21
        String javaVersion = System.getProperty("java.version");
        assertTrue(javaVersion.startsWith("21"), "Should be using Java 21, but found: " + javaVersion);
    }
}
