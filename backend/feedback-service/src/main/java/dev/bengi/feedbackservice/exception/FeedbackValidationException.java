package dev.bengi.feedbackservice.exception;

public class FeedbackValidationException extends RuntimeException {
    public FeedbackValidationException(String message) {
        super(message);
    }

    public FeedbackValidationException(String message, Throwable cause) {
        super(message, cause);
    }
}