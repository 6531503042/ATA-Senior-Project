package dev.bengi.userservice.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum ErrorCode {

    // --- COMMON ---
    INTERNAL_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "Internal server error"),
    INVALID_REQUEST(HttpStatus.BAD_REQUEST, "Invalid request"),

    // --- USER ---
    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "User not found"),
    USER_ALREADY_EXISTS(HttpStatus.CONFLICT, "Username already exists"),
    EMAIL_ALREADY_EXISTS(HttpStatus.CONFLICT, "Email already exists"),
    INVALID_CREDENTIALS(HttpStatus.UNAUTHORIZED, "Invalid username or password"),
    UNAUTHORIZED_ACCESS(HttpStatus.UNAUTHORIZED, "Unauthorized access"),

    // --- ROLE ---
    ROLE_NOT_FOUND(HttpStatus.NOT_FOUND, "Role not found"),

    // --- DEPARTMENT ---
    DEPARTMENT_NOT_FOUND(HttpStatus.NOT_FOUND, "Department not found");

    private final HttpStatus httpStatus;
    private final String message;
}
