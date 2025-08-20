package dev.bengi.main.exception;

import lombok.Getter;

@Getter
public class GlobalServiceException extends RuntimeException{

    private final ErrorCode error;

    public GlobalServiceException(ErrorCode error) {
        super((String) null); // detail จะ fallback เป็น code ใน handler
        this.error = error;
    }

    public GlobalServiceException(ErrorCode error, String message) {
        super(message);
        this.error = error;
    }
}
