package dev.bengi.feedbackservice.service.impl;

import dev.bengi.feedbackservice.domain.enums.QuestionCategory;
import dev.bengi.feedbackservice.domain.model.Answer;
import dev.bengi.feedbackservice.domain.model.Feedback;
import dev.bengi.feedbackservice.domain.model.Question;
import dev.bengi.feedbackservice.domain.model.QuestionSet;
import dev.bengi.feedbackservice.domain.payload.request.CreateFeedbackRequest;
import dev.bengi.feedbackservice.domain.payload.request.SubmitFeedbackRequest;

import dev.bengi.feedbackservice.exception.FeedbackValidationException;
import dev.bengi.feedbackservice.repository.FeedbackRepository;
import dev.bengi.feedbackservice.repository.ProjectRepository;
import dev.bengi.feedbackservice.repository.QuestionRepository;
import dev.bengi.feedbackservice.repository.QuestionSetRepository;
import dev.bengi.feedbackservice.service.FeedbackService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZonedDateTime;
import java.util.List;

@RequiredArgsConstructor
@Service
@Slf4j
public class FeedbackServiceImpl implements FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final ProjectRepository projectRepository;
    private final QuestionSetRepository questionSetRepository;
    private final QuestionRepository questionRepository;

    @Override
    @Transactional
    public Feedback createFeedback(CreateFeedbackRequest request) {
        log.info("Creating feedback for project: {}", request.getProjectId());
        
        // Validate project existence
        validateProject(request.getProjectId());

        try {
            Feedback feedback = Feedback.builder()
                .projectId(request.getProjectId())
                .userId(request.getUserId())
                .feedbackStartDate(request.getFeedbackStartDate())
                .feedbackEndDate(request.getFeedbackEndDate())
                .title(request.getTitle())
                .description(request.getDescription())
                .category(parseCategory(request.getCategory()))
                .build();


                if (request.getQuestionIds() != null && !request.getQuestionIds().isEmpty()) {
                    feedback.setQuestionIds(request.getQuestionIds());
                }
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
        log.info("Fetching all feedbacks with page {} and size {}", page, size);
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        return feedbackRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Feedback getFeedbackById(Long id) {
        return feedbackRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Feedback not found"));
    }

//    @Override
//    public Feedback updateFeedbackStatus(Long feedbackId, UpdateFeedbackStatusRequest request) {
//        Feedback feedback = feedbackRepository.findById(feedbackId)
//            .orElseThrow(() -> new FeedbackValidationException("Feedback not found"));
//
//        feedback.setStatus(request.getStatus());
//        feedback.setAdminComment(request.getAdminComment());
//
//        return feedbackRepository.save(feedback);
//    }
//
//    @Override
//    public void deleteFeedback(Long feedbackId) {
//        if (!feedbackRepository.existsById(feedbackId)) {
//            throw new FeedbackValidationException("Feedback not found");
//        }
//        feedbackRepository.deleteById(feedbackId);
//    }

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

    //  @Override
    // public Feedback submitFeedback(Long userId, SubmitFeedbackRequest request) {

    //     //Validate exist question-set
    //     QuestionSet set = questionSetRepository.findById(request.getQuestionSetId())
    //             .orElseThrow(() -> new RuntimeException("Question set not found"));

    //     Feedback feedback = Feedback.builder()
    //             .projectId(request.getProjectId())
    //             .userId(userId)
    //             .questionIds(request.getQuestionIds())
    //             .title(request.getTitle())
    //             .description(request.getDescription())
    //             .additionalComments(request.getAdditionalComments())
    //             .category(request.getCategory() != null ?
    //                     QuestionCategory.valueOf(String.valueOf(request.getCategory())) : null)
    //             .privacyLevel(request.getPrivacyLevel())
    //             .submittedAt(ZonedDateTime.now())
    //             .build();

    //     //Add answer after builder feedback
    //      if (request.getResponse() != null) {
    //          request.getResponse().forEach(response -> {
    //              Answer answer = Answer.builder()
    //                      .type(response.getType())
    //                      .build();
    //              feedback.addAnswer(answer);
    //          });
    //      }

    //     return feedbackRepository.save(feedback);
    // }

    private QuestionCategory parseCategory(String category) {
        if (category != null) return null;

        try {
            return QuestionCategory.valueOf(category);
        } catch (IllegalArgumentException e) {
            log.warn("Invalid category: {}", category);
            throw new FeedbackValidationException("Invalid feedback category: " + category);
        }
    }

    private void validateProject(Long projectId) {
        if (!projectRepository.existsById(projectId)) {
            throw new RuntimeException("Project not found");
        }
    }
}
