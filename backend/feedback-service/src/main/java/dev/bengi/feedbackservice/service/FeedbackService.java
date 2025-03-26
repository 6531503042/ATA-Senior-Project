package dev.bengi.feedbackservice.service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import dev.bengi.feedbackservice.domain.model.Feedback;
import dev.bengi.feedbackservice.domain.payload.response.FeedbackDetailsResponse;

public interface FeedbackService {
    Feedback createFeedback(Feedback feedback);
    Feedback updateFeedback(Long id, Feedback feedback);
    void deleteFeedback(Long id);
    Optional<Feedback> getFeedbackById(Long id);
    List<Feedback> getAllFeedbacks();
    List<Feedback> getFeedbacksByDepartment(String departmentId);
    List<Feedback> getDepartmentWideFeedbacks(String departmentId);
    List<Feedback> getFeedbacksByUser(String userId);
    List<Feedback> getFeedbacksByProject(Long projectId);
    Feedback activateFeedback(Long id);
    Feedback closeFeedback(Long id);
    Feedback addTargetUser(Long feedbackId, String userId);
    Feedback removeTargetUser(Long feedbackId, String userId);
    Feedback addTargetDepartment(Long feedbackId, String departmentId);
    Feedback removeTargetDepartment(Long feedbackId, String departmentId);
    
    // New methods for feedback submission flow
    List<FeedbackDetailsResponse> getAvailableFeedbacksForUser(String userId);
    FeedbackDetailsResponse getFeedbackDetails(Long feedbackId);
    
    // Dashboard methods
    Map<String, Long> getFeedbackStatistics();
    Map<String, Double> getFeedbackMetrics();
    List<Feedback> getRecentFeedbacks();
}
