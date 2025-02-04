package dev.bengi.feedbackservice.service;

import dev.bengi.feedbackservice.domain.payload.request.CreateFeedbackRequest;
import dev.bengi.feedbackservice.domain.payload.response.FeedbackResponse;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface FeedbackService {
    @Transactional
    FeedbackResponse createFeedback(CreateFeedbackRequest request);

    @Transactional
    FeedbackResponse updateFeedback(Long id, CreateFeedbackRequest request);

    @Transactional
    void deleteFeedback(Long id);

    @Transactional(readOnly = true)
    FeedbackResponse getFeedbackById(Long id);

    @Transactional(readOnly = true)
    List<FeedbackResponse> getAllFeedbacks();

    @Transactional(readOnly = true)
    List<FeedbackResponse> getFeedbacksByProjectId(Long projectId);

    @Transactional
    FeedbackResponse addQuestionsToFeedback(Long feedbackId, List<Long> questionIds);

    @Transactional(readOnly = true)
    List<FeedbackResponse> getFeedbacksByUser(Long userId, int page, int size);
}
