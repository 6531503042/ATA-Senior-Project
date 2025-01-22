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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZonedDateTime;

@RequiredArgsConstructor
@Service
public class FeedbackServiceImpl implements FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final QuestionSetRepository questionSetRepository;


    @Override
    @Transactional
    public Feedback createFeedback(CreateFeedbackRequest request) {
        log.info("Creating feedback for project: {}", request.getProjectId());
        
        // Validate project existence
        validateProject(request.getProjectId());

        QuestionCategory category = parseCategory(request.getCategory());

        try {
            Feedback feedback = Feedback.builder()
                .projectId(request.getProjectId())
                .userId(request.getUserId())
                .title(request.getTitle())
                .description(request.getDescription())
                .category(category)
                .privacyLevel(request.getPrivacyLevel())
                .submittedAt(ZonedDateTime.now())
                .build();

            Feedback savedFeedback = feedbackRepository.save(feedback);
            log.info("Feedback created successfully with ID: {}", savedFeedback.getId());
            return savedFeedback;
        } catch (Exception e) {
            log.error("Error creating feedback: {}", e.getMessage(), e);
            throw new FeedbackValidationException("Failed to create feedback", e);
        }
    }


    @Override
    public Page<Feedback> getAllFeedbacks(int page, int size, String status) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("submittedAt").descending());
        
        if (status != null && !status.isEmpty()) {
            return feedbackRepository.findByStatus(status, pageable);
        }
        
        return feedbackRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Feedback getFeedbackById(Long id) {
        return feedbackRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Feedback not found"));
    }

    @Override
    public Feedback updateFeedbackStatus(Long feedbackId, UpdateFeedbackStatusRequest request) {
        Feedback feedback = feedbackRepository.findById(feedbackId)
            .orElseThrow(() -> new FeedbackValidationException("Feedback not found"));
        
        feedback.setStatus(request.getStatus());
        feedback.setAdminComment(request.getAdminComment());
        
        return feedbackRepository.save(feedback);
    }

    @Override
    public void deleteFeedback(Long feedbackId) {
        if (!feedbackRepository.existsById(feedbackId)) {
            throw new FeedbackValidationException("Feedback not found");
        }
        feedbackRepository.deleteById(feedbackId);
    }

    @Override
    public Page<Feedback> getFeedbacksByUser(Long userId, int page, int size) {
    Pageable pageable = PageRequest.of(page, size, Sort.by("submittedAt").descending());
    return feedbackRepository.findByUserId(userId, pageable);
}

    

    @Cacheable(value = "feedbackCache", key = "#projectId")
    @Override
    public Page<Feedback> getFeedbackByProject(Long projectId, int page, int size) {
        log.info("Retrieving feedback for project: {} (Page: {}, Size: {})", projectId, page, size);
        Pageable pageable = PageRequest.of(page, size, Sort.by("submittedAt").descending());
        return feedbackRepository.findByProjectId(projectId, pageable);
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

    private QuestionCategory parseCategory(String category) {
        if (category != null) return null;

        try {
            return QuestionCategory.valueOf(category);
        } catch (IllegalArgumentException e) {
            log.warn("Invalid category: {}", categoryStr);
            throw new FeedbackValidationException("Invalid feedback category: " + categoryStr);
        }
    }

    private void validateProject(Long projectId) {
        if (!projectRepository.existsById(projectId)) {
            throw new RuntimeException("Project not found");
        }
    }
}
