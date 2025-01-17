package dev.bengi.feedbackservice.service;

import dev.bengi.feedbackservice.domain.model.Feedback;
import dev.bengi.feedbackservice.domain.payload.request.CreateFeedbackRequest;
import dev.bengi.feedbackservice.domain.payload.request.SubmitFeedbackRequest;
import org.springframework.data.domain.Page;
import org.springframework.transaction.annotation.Transactional;

public interface FeedbackService {
    Feedback createFeedback(CreateFeedbackRequest request);

    Page<Feedback> getAllFeedbacks(int page, int size);

    @Transactional(readOnly = true)
    Feedback getFeedbackById(Long id);

    Feedback submitFeedback(Long userId, SubmitFeedbackRequest request);
}
