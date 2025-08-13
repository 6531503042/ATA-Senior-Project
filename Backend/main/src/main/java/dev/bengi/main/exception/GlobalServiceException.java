package dev.bengi.main.exception;

import lombok.Getter;

@Getter
public class GlobalServiceException extends RuntimeException{

    private final ErrorCode error;

    public GlobalServiceException(ErrorCode error) {
        this.error = error;
    }

    public GlobalServiceException(ErrorCode error, String message) {
        super(message);
        this.error = error;
    }
}
