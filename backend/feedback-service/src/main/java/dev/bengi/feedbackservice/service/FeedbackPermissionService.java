package dev.bengi.feedbackservice.service;

import java.util.List;

public interface FeedbackPermissionService {
    /**
     * Check if a user has permission to submit feedback
     * @param userId The ID of the user
     * @param feedbackId The ID of the feedback
     * @return true if user has permission, false otherwise
     */
    boolean hasPermissionToSubmitFeedback(String userId, Long feedbackId);

    /**
     * Get all feedback IDs that a user has permission to submit
     * @param userId The ID of the user
     * @return List of feedback IDs
     */
    List<Long> getPermittedFeedbackIds(String userId);

    /**
     * Check if the feedback is still active and within its time window
     * @param feedbackId The ID of the feedback
     * @return true if feedback is active and within time window
     */
    boolean isFeedbackActive(Long feedbackId);

    boolean hasPermissionToViewFeedbackSubmissions(String userId, Long feedbackId);
} 