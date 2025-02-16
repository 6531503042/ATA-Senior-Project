package dev.bengi.userservice.exception.wrapper;

public class TokenErrorOrAccessTimeOut extends RuntimeException {

    public TokenErrorOrAccessTimeOut(String message) {
        super(message);
    }

    public TokenErrorOrAccessTimeOut() {
        super();
    }

    public TokenErrorOrAccessTimeOut(String message, Throwable cause) {
        super(message, cause);
    }
}
