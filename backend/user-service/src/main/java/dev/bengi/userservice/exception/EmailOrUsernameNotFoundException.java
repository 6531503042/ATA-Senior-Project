package dev.bengi.userservice.exception;

public class EmailOrUsernameNotFoundException extends RuntimeException {
    public EmailOrUsernameNotFoundException(String message) {
        super(message);
    }
}
