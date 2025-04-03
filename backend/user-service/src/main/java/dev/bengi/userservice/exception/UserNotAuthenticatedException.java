package dev.bengi.userservice.exception;

public class UserNotAuthenticatedException extends RuntimeException {

    public UserNotAuthenticatedException(String message) {
        super(message);
    }

    public UserNotAuthenticatedException() {
        super();
    }

    public UserNotAuthenticatedException(String message, Throwable cause) {
        super(message, cause);
    }
}
