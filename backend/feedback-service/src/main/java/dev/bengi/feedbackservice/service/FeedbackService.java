package dev.bengi.feedbackservice.service;

import dev.bengi.feedbackservice.domain.model.Feedback;
import dev.bengi.feedbackservice.domain.payload.request.CreateFeedbackRequest;
import dev.bengi.feedbackservice.domain.payload.request.SubmitFeedbackRequest;

public interface FeedbackService {
    Feedback createFeedback(CreateFeedbackRequest request);

    Feedback submitFeedback(Long userId, SubmitFeedbackRequest request);
}
