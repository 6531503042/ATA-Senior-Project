package dev.bengi.userservice.exception;

import dev.bengi.userservice.exception.payload.ExceptionMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import org.springframework.validation.BindException;

import java.nio.file.AccessDeniedException;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Objects;

@ControllerAdvice
@Slf4j
public class ExceptionController {

    @ExceptionHandler(value = {
            MethodArgumentNotValidException.class,
            HttpMessageNotReadableException.class
    })
    public <T extends BindException> ResponseEntity<ExceptionMessage> handleValidationException(final T e) {
        log.info("ExceptionController handler validation exception\n");
        final var badRequest = HttpStatus.BAD_REQUEST;

        return new ResponseEntity<>(
                ExceptionMessage.builder()
                        .message("*" + Objects.requireNonNull(e.getBindingResult().getFieldError()).getDefaultMessage() + "!**")
                        .status(badRequest)
                        .timestamp(ZonedDateTime
                                .now(ZoneId.systemDefault()))
                        .build(), badRequest);
    }

    @ExceptionHandler({AccessDeniedException.class, BadCredentialsException.class})
    public ResponseEntity<ExceptionMessage> handleAccessDeniedException(Exception e) {
        log.error("Access denied: {}", e.getMessage());
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(ExceptionMessage.builder()
                        .message("Access denied: " + e.getMessage())
                        .status(HttpStatus.FORBIDDEN)
                        .timestamp(ZonedDateTime
                                .now(ZoneId.systemDefault()))
                        .build());
    }

    @ExceptionHandler({AuthenticationException.class})
    public ResponseEntity<ExceptionMessage> handleAuthenticationException(AuthenticationException e) {
        log.error("Authentication exception: {}", e.getMessage());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ExceptionMessage.builder()
                        .message("Authentication exception: " + e.getMessage())
                        .status(HttpStatus.UNAUTHORIZED)
                        .timestamp(ZonedDateTime
                                .now(ZoneId.systemDefault()))
                        .build());
    }

    @ExceptionHandler({UserNotAuthenticatedException.class})
    public ResponseEntity<String> handleUserNotAuthenticatedException(UserNotAuthenticatedException e) {
        log.error("User not authenticated: {}", e.getMessage());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("User not authenticated: " + e.getMessage());
    }

    @ExceptionHandler({Exception.class})
    public ResponseEntity<String> handleGenericException(Exception e) {
        log.error("Generic exception: {}", e.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Generic exception: " + e.getMessage());
    }


}
