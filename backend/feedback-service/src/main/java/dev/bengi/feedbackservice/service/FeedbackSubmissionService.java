package dev.bengi.feedbackservice.service;

import dev.bengi.feedbackservice.domain.payload.request.FeedbackSubmissionRequest;
import dev.bengi.feedbackservice.domain.payload.response.FeedbackSubmissionResponse;

import java.util.Map;
import reactor.core.publisher.Mono;
import reactor.core.publisher.Flux;

public interface FeedbackSubmissionService {
    Mono<FeedbackSubmissionResponse> submitFeedback(FeedbackSubmissionRequest request);
    Mono<FeedbackSubmissionResponse> getSubmission(Long submissionId);
    Flux<FeedbackSubmissionResponse> getSubmissionsByUser(String userId);
    Flux<FeedbackSubmissionResponse> getSubmissionsByFeedback(Long feedbackId);
    Flux<FeedbackSubmissionResponse> getPendingReviewSubmissions();
    
    // Admin methods
    Flux<FeedbackSubmissionResponse> getAllSubmissions();
    Mono<Map<String, Long>> getSubmissionStatistics();
    
    // Validation method
    Mono<Map<String, Object>> validateFeedbackSubmission(Long feedbackId, Map<Long, String> responses);
} 