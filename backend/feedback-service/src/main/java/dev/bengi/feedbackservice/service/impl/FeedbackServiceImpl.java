package dev.bengi.feedbackservice.service.impl;

import dev.bengi.feedbackservice.domain.enums.QuestionCategory;
import dev.bengi.feedbackservice.domain.model.Answer;
import dev.bengi.feedbackservice.domain.model.Feedback;
import dev.bengi.feedbackservice.domain.model.QuestionSet;
import dev.bengi.feedbackservice.domain.payload.request.CreateFeedbackRequest;
import dev.bengi.feedbackservice.domain.payload.request.SubmitFeedbackRequest;

import dev.bengi.feedbackservice.repository.FeedbackRepository;
import dev.bengi.feedbackservice.repository.QuestionSetRepository;
import dev.bengi.feedbackservice.service.FeedbackService;
import lombok.RequiredArgsConstructor;

import java.time.Instant;
import java.time.ZonedDateTime;
import java.util.*;

@RequiredArgsConstructor
public class FeedbackServiceImpl implements FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final QuestionSetRepository questionSetRepository;


    @Override
    public Feedback createFeedback(CreateFeedbackRequest request) {
        QuestionCategory category = null;
        if (request.getCategory() != null) {
            try {
                category = QuestionCategory.valueOf(String.valueOf(request.getCategory()));
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Invalid category: "+ request.getCategory());
            }
        }

        return Feedback.builder()
                .projectId(request.getProjectId())
                .userId(request.getUserId())
                .title(request.getTitle())
                .description(request.getDescription())
                .category(category)
                .privacyLevel(request.getPrivacyLevel())
                .submittedAt(ZonedDateTime.now())
                .build();
    }
     @Override
    public Feedback submitFeedback(Long userId, SubmitFeedbackRequest request) {

        //Validate exist question-set
        QuestionSet set = questionSetRepository.findById(request.getQuestionSetId())
                .orElseThrow(() -> new RuntimeException("Question set not found"));

        Feedback feedback = Feedback.builder()
                .projectId(request.getProjectId())
                .userId(userId)
                .questionSet(set)
                .title(request.getTitle())
                .description(request.getDescription())
                .additionalComments(request.getAdditionalComments())
                .category(request.getCategory() != null ?
                        QuestionCategory.valueOf(String.valueOf(request.getCategory())) : null)
                .privacyLevel(request.getPrivacyLevel())
                .submittedAt(ZonedDateTime.now())
                .build();

        //Add answer after builder feedback
         if (request.getResponse() != null) {
             request.getResponse().forEach(response -> {
                 Answer answer = Answer.builder()
                         .type(response.getType())
                         .value(response.getValue())
                         .build();
                 feedback.addAnswer(answer);
             });
         }

        return feedbackRepository.save(feedback);
    }
}
