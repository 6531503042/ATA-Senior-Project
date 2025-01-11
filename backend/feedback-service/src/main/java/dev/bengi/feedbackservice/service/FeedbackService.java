package dev.bengi.feedbackservice.service;

import dev.bengi.feedbackservice.domain.model.Feedback;
import dev.bengi.feedbackservice.domain.payload.request.CreateFeedbackRequest;

public interface FeedbackService {
    Feedback createFeedback(CreateFeedbackRequest request);
}
