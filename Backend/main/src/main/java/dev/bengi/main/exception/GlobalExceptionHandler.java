package dev.bengi.main.exception;

import org.springframework.core.annotation.Order;
import org.springframework.http.ProblemDetail;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.bind.support.WebExchangeBindException;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.net.URI;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@RestControllerAdvice
@Order // It will align with order like 0 - 1 - 2
public class GlobalExceptionHandler {

    @ExceptionHandler(GlobalServiceException.class)
    public Mono<ProblemDetail> handleService(GlobalServiceException ex, ServerWebExchange exchange) {
        var code = ex.getError();
        var pd = ProblemDetail.forStatusAndDetail(code.status, ex.getMessage());
        pd.setTitle(code.code);
        attachCommon(pd, exchange, code.code);
        return Mono.just(pd);
    }

    @ExceptionHandler({ MethodArgumentNotValidException.class, WebExchangeBindException.class })
    public Mono<ProblemDetail> handleValidation(Exception ex, ServerWebExchange exchange) {
        List<Map<String, Object>> errors;

        if (ex instanceof MethodArgumentNotValidException manve) {
            errors = manve.getBindingResult().getFieldErrors().stream()
                    .map(this::toError).toList();
        } else { // WebFlux
            var webe = (WebExchangeBindException) ex;
            errors = webe.getFieldErrors().stream().map(this::toError).toList();
        }

        var pd = ProblemDetail.forStatusAndDetail(ErrorCode.INVALID_REQUEST.status, "Validation failed");
        pd.setTitle(ErrorCode.INVALID_REQUEST.code);
        pd.setType(URI.create(ErrorCode.INVALID_REQUEST.type()));
        pd.setProperty("errors", errors);
        attachCommon(pd, exchange, ErrorCode.INVALID_REQUEST.code);
        return Mono.just(pd);
    }

    private Map<String, Object> toError(FieldError fe) {
        return Map.of(
                "field", fe.getField(),
                "message", (fe.getDefaultMessage() != null ? fe.getDefaultMessage() : "invalid"),
                "rejectedValue", Objects.requireNonNull(fe.getRejectedValue())
        );
    }

    private void attachCommon(ProblemDetail pd, ServerWebExchange exchange, String code) {
        var req = exchange.getRequest();
        pd.setProperty("timestamp", OffsetDateTime.now());
        pd.setProperty("path", req.getPath().value());
        req.getMethod();
        pd.setProperty("method", req.getMethod().name());
        pd.setProperty("traceId", req.getId());
        pd.setProperty("code", code);
    }
}
