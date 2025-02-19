package dev.bengi.userservice.exception.wrapper;

public class PasswordNotFoundException extends RuntimeException {

    public PasswordNotFoundException(String message) {
        super(message);
    }

    public PasswordNotFoundException() {
        super();
    }

    public PasswordNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
