package dev.bengi.feedbackservice.service;

import dev.bengi.feedbackservice.domain.model.Feedback;
import dev.bengi.feedbackservice.domain.payload.request.CreateFeedbackRequest;
import dev.bengi.feedbackservice.domain.payload.request.SubmitFeedbackRequest;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.transaction.annotation.Transactional;

public interface FeedbackService {
    Feedback createFeedback(CreateFeedbackRequest request);

    Page<Feedback> getAllFeedbacks(int page, int size, String status);

    @Transactional(readOnly = true)
    Feedback getFeedbackById(Long id);

    Page<Feedback> getFeedbacksByUser(Long userId, int page, int size);

    @Cacheable(value = "feedbackCache", key = "#projectId")
    Page<Feedback> getFeedbackByProject(Long projectId, int page, int size);

    // Feedback submitFeedback(Long userId, SubmitFeedbackRequest request);
}
