package dev.bengi.feedbackservice.exception;

import dev.bengi.feedbackservice.domain.payload.response.ApiErrorResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.web.reactive.error.ErrorWebExceptionHandler;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.core.io.buffer.DataBufferFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.JsonProcessingException;

import java.time.LocalDateTime;
import java.util.ArrayList;

@Slf4j
@Configuration
@Order(-2) // High precedence
public class ReactiveExceptionHandler implements ErrorWebExceptionHandler {

    private final ObjectMapper objectMapper;

    public ReactiveExceptionHandler(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Override
    public Mono<Void> handle(ServerWebExchange exchange, Throwable ex) {
        log.error("Global error handler caught exception: {}", ex.getMessage(), ex);
        
        // Determine HTTP status code
        HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;
        String message = "An unexpected error occurred";
        
        if (ex instanceof ResponseStatusException) {
            ResponseStatusException responseEx = (ResponseStatusException) ex;
            status = HttpStatus.valueOf(responseEx.getStatusCode().value());
            message = ex.getMessage();
        } else if (ex instanceof IllegalArgumentException) {
            status = HttpStatus.BAD_REQUEST;
            message = ex.getMessage();
        }
        
        // Build the error response
        ApiErrorResponse errorResponse = ApiErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(status.value())
                .error(status.getReasonPhrase())
                .message(message)
                .path(exchange.getRequest().getPath().value())
                .details(new ArrayList<>())
                .build();
        
        // Set the response status
        exchange.getResponse().setStatusCode(status);
        exchange.getResponse().getHeaders().setContentType(MediaType.APPLICATION_JSON);
        
        // Write the error response to the response body
        DataBufferFactory bufferFactory = exchange.getResponse().bufferFactory();
        DataBuffer buffer;
        
        try {
            buffer = bufferFactory.wrap(objectMapper.writeValueAsBytes(errorResponse));
        } catch (JsonProcessingException e) {
            log.error("Error serializing error response", e);
            buffer = bufferFactory.wrap("Internal Server Error".getBytes());
        }
        
        return exchange.getResponse().writeWith(Mono.just(buffer));
    }
} 