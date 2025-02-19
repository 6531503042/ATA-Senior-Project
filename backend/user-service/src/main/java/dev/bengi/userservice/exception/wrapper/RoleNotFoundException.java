package dev.bengi.userservice.exception.wrapper;

public class RoleNotFoundException extends RuntimeException {

    public RoleNotFoundException(String message) {
        super(message);
    }

    public RoleNotFoundException() {
        super();
    }

    public RoleNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
