package dev.bengi.feedbackservice.service;

import dev.bengi.feedbackservice.domain.payload.request.FeedbackSubmissionRequest;
import dev.bengi.feedbackservice.domain.payload.response.FeedbackSubmissionResponse;

import java.util.List;
import java.util.Map;

public interface FeedbackSubmissionService {
    FeedbackSubmissionResponse submitFeedback(FeedbackSubmissionRequest request);
    FeedbackSubmissionResponse getSubmission(Long submissionId);
    List<FeedbackSubmissionResponse> getSubmissionsByUser(String userId);
    List<FeedbackSubmissionResponse> getSubmissionsByFeedback(Long feedbackId);
    List<FeedbackSubmissionResponse> getPendingReviewSubmissions();
    
    // Admin methods
    List<FeedbackSubmissionResponse> getAllSubmissions();
    Map<String, Long> getSubmissionStatistics();
    
    // Validation method
    Map<String, Object> validateFeedbackSubmission(Long feedbackId, Map<Long, String> responses);
} 