package dev.bengi.feedbackservice.service;

import dev.bengi.feedbackservice.domain.model.Feedback;
import dev.bengi.feedbackservice.domain.payload.response.FeedbackDetailsResponse;

import java.util.List;
import java.util.Map;

public interface FeedbackService {
    Feedback createFeedback(Feedback feedback);
    Feedback updateFeedback(Long id, Feedback feedback);
    void deleteFeedback(Long id);
    Feedback getFeedback(Long id);
    List<Feedback> getAllFeedbacks();
    List<Feedback> getFeedbacksByProject(Long projectId);
    List<Feedback> getFeedbacksByUser(String userId);
    
    // New methods for feedback submission flow
    List<FeedbackDetailsResponse> getAvailableFeedbacksForUser(String userId);
    FeedbackDetailsResponse getFeedbackDetails(Long feedbackId);
    
    // Dashboard methods
    Map<String, Long> getFeedbackStatistics();
    Map<String, Double> getFeedbackMetrics();
    List<Feedback> getRecentFeedbacks();
}
