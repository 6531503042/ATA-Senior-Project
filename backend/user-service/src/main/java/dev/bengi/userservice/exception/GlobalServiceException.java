package dev.bengi.userservice.exception;

import lombok.Getter;

@Getter
public class GlobalServiceException extends RuntimeException {

    private final ErrorCode errorCode;

    public GlobalServiceException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }
}
