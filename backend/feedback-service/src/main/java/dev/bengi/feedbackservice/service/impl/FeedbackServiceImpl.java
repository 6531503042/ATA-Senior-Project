package dev.bengi.feedbackservice.service.impl;

import dev.bengi.feedbackservice.domain.enums.QuestionCategory;
import dev.bengi.feedbackservice.domain.model.Feedback;
import dev.bengi.feedbackservice.domain.payload.request.CreateFeedbackRequest;
import dev.bengi.feedbackservice.repository.FeedbackRepository;
import dev.bengi.feedbackservice.repository.QuestionSetRepository;
import dev.bengi.feedbackservice.service.FeedbackService;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class FeedbackServiceImpl implements FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private QuestionSetRepository questionSetRepository;

    @Override
    public Feedback createFeedback(CreateFeedbackRequest request) {
        return Feedback.builder()
                .projectId(request.getProjectId())
                .userId(request.getUserId())
                .title(request.getTitle())
                .description(request.getDescription())
                .category(QuestionCategory.valueOf(request.getCategory()))
                .privacyLevel(request.getPrivacyLevel())
                .build();
    }
}
