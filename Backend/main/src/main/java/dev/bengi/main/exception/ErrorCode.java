package dev.bengi.main.exception;

import org.springframework.http.HttpStatus;

public enum ErrorCode {

    // --- COMMON HTTP-LIKE ERRORS ---
    INTERNAL_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "INTERNAL_ERROR", "Internal server error"),
    BAD_REQUEST(HttpStatus.BAD_REQUEST, "BAD_REQUEST", "Invalid request"),
    UNAUTHORIZED(HttpStatus.UNAUTHORIZED, "UNAUTHORIZED", "Authentication required or failed"),
    FORBIDDEN(HttpStatus.FORBIDDEN, "FORBIDDEN", "Access denied"),
    NOT_FOUND(HttpStatus.NOT_FOUND, "NOT_FOUND", "Resource not found"),
    CONFLICT(HttpStatus.CONFLICT, "CONFLICT", "Resource already exists"),
    UNSUPPORTED_OPERATION(HttpStatus.NOT_IMPLEMENTED, "UNSUPPORTED_OPERATION", "Operation not supported"),

    // --- VALIDATION ---
    VALIDATION_ERROR(HttpStatus.BAD_REQUEST, "VALIDATION_ERROR", "Validation failed"),
    INVALID_INPUT(HttpStatus.BAD_REQUEST, "INVALID_INPUT", "Invalid input value"),

    // --- DATABASE / SERVER ---
    DATABASE_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "DATABASE_ERROR", "Database access error"),
    SERVICE_UNAVAILABLE(HttpStatus.SERVICE_UNAVAILABLE, "SERVICE_UNAVAILABLE", "Service temporarily unavailable");

    public final HttpStatus status;
    public final String code;

    ErrorCode(HttpStatus status, String code, String message) {
        this.status = status;
        this.code = code;
    }
}
