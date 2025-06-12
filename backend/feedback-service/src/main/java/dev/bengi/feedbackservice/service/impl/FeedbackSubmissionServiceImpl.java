package dev.bengi.feedbackservice.service.impl;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import dev.bengi.feedbackservice.domain.enums.PrivacyLevel;
import dev.bengi.feedbackservice.domain.model.Feedback;
import dev.bengi.feedbackservice.domain.model.FeedbackSubmission;
import dev.bengi.feedbackservice.domain.model.Question;
import dev.bengi.feedbackservice.domain.payload.request.FeedbackSubmissionRequest;
import dev.bengi.feedbackservice.domain.payload.response.FeedbackSubmissionResponse;
import dev.bengi.feedbackservice.domain.payload.response.QuestionDetailsResponse;
import dev.bengi.feedbackservice.repository.FeedbackRepository;
import dev.bengi.feedbackservice.repository.FeedbackSubmissionRepository;
import dev.bengi.feedbackservice.repository.QuestionRepository;
import dev.bengi.feedbackservice.service.FeedbackSubmissionService;
import dev.bengi.feedbackservice.util.ReactiveHelper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class FeedbackSubmissionServiceImpl implements FeedbackSubmissionService {
    private final FeedbackSubmissionRepository submissionRepository;
    private final FeedbackRepository feedbackRepository;
    private final QuestionRepository questionRepository;

    @Override
    public Mono<FeedbackSubmissionResponse> submitFeedback(FeedbackSubmissionRequest request) {
        log.debug("Processing feedback submission for feedback ID: {}", request.getFeedbackId());
        
        return feedbackRepository.findById(request.getFeedbackId())
            .switchIfEmpty(Mono.error(new IllegalArgumentException("Feedback not found with ID: " + request.getFeedbackId())))
            .flatMap(feedback -> {
                // Validate user is allowed to submit
                Long userId = Long.parseLong(request.getUserId());
                Set<Long> projectMembers = feedback.getProject().getMemberIds();
                if (!projectMembers.contains(userId)) {
                    log.error("User {} not allowed to submit feedback {} - not a project member", userId, feedback.getId());
                    return Mono.error(new IllegalArgumentException("User not allowed to submit this feedback - not a project member"));
                }
                
                // Check if feedback is active and within time window
                LocalDateTime now = LocalDateTime.now();
                if (!feedback.isActive() || now.isBefore(feedback.getStartDate()) || now.isAfter(feedback.getEndDate())) {
                    log.error("Feedback {} is not active or outside submission window", feedback.getId());
                    return Mono.error(new IllegalArgumentException("Feedback is not active or outside submission window"));
                }

                // Validate privacy level based on user role and feedback settings
                try {
                    validatePrivacyLevel(request.getPrivacyLevel(), userId, feedback);
                } catch (IllegalArgumentException e) {
                    return Mono.error(e);
                }
                
                // Create submission
                FeedbackSubmission submission = FeedbackSubmission.builder()
                    .feedbackId(feedback.getId())
                    .userId(request.getPrivacyLevel() == PrivacyLevel.ANONYMOUS ? null : request.getUserId())
                    .submittedAt(now)
                    .isAnonymous(request.getPrivacyLevel() == PrivacyLevel.ANONYMOUS)
                    .build();
                
                return submissionRepository.save(submission)
                    .doOnSuccess(saved -> log.info("Successfully saved feedback submission with ID: {}", saved.getId()))
                    .map(this::mapToResponse);
            });
    }

    private void validatePrivacyLevel(PrivacyLevel privacyLevel, Long userId, Feedback feedback) {
        // Check if user has permission for the selected privacy level
        switch (privacyLevel) {
            case CONFIDENTIAL:
                if (!hasConfidentialPermission(userId, feedback)) {
                    log.error("User {} does not have permission to submit confidential feedback", userId);
                    throw new IllegalArgumentException("You do not have permission to submit confidential feedback");
                }
                break;
            case PRIVATE:
                if (!hasPrivatePermission(userId, feedback)) {
                    log.error("User {} does not have permission to submit private feedback", userId);
                    throw new IllegalArgumentException("You do not have permission to submit private feedback");
                }
                break;
            case ANONYMOUS:
                if (!feedback.isAllowAnonymous()) {
                    log.error("Anonymous feedback is not allowed for feedback {}", feedback.getId());
                    throw new IllegalArgumentException("Anonymous feedback is not allowed for this feedback");
                }
                break;
            case PUBLIC:
                // Public feedback is always allowed for project members
                break;
            default:
                log.error("Invalid privacy level: {}", privacyLevel);
                throw new IllegalArgumentException("Invalid privacy level");
        }
    }

    private boolean hasConfidentialPermission(Long userId, Feedback feedback) {
        // All project members can submit confidential feedback
        return feedback.getProject().getMemberIds().contains(userId);
    }

    private boolean hasPrivatePermission(Long userId, Feedback feedback) {
        // All project members can submit private feedback
        return feedback.getProject().getMemberIds().contains(userId);
    }

    @Override
    public Mono<FeedbackSubmissionResponse> getSubmission(Long id) {
        log.debug("Retrieving feedback submission with ID: {}", id);
        return submissionRepository.findById(id)
            .doOnNext(submission -> log.debug("Found feedback submission with ID: {}", id))
            .map(this::mapToResponse)
            .switchIfEmpty(Mono.error(new IllegalArgumentException("Submission not found")))
            .doOnError(e -> log.error("Feedback submission not found with ID: {}", id));
    }

    @Override
    public Flux<FeedbackSubmissionResponse> getSubmissionsByFeedback(Long feedbackId) {
        log.debug("Retrieving submissions for feedback ID: {}", feedbackId);
        return submissionRepository.findByFeedbackId(feedbackId)
            .map(this::mapToResponse)
            .doOnComplete(() -> log.debug("Completed retrieving submissions for feedback ID: {}", feedbackId));
    }

    @Override
    public Flux<FeedbackSubmissionResponse> getSubmissionsByUser(String userId) {
        log.debug("Retrieving submissions for user ID: {}", userId);
        return submissionRepository.findByUserId(userId)
            .map(this::mapToResponse)
            .doOnComplete(() -> log.debug("Completed retrieving submissions for user ID: {}", userId));
    }

    @Override
    public Flux<FeedbackSubmissionResponse> getPendingReviewSubmissions() {
        log.debug("Retrieving pending review submissions");
        // Implement a method in the repository to find submissions where reviewed = false
        // For now, using a workaround with filter
        return submissionRepository.findAll()
            .filter(submission -> !submission.isReviewed())
            .map(this::mapToResponse)
            .doOnComplete(() -> log.debug("Completed retrieving pending review submissions"));
    }

    @Override
    public Mono<Map<String, Object>> validateFeedbackSubmission(Long feedbackId, Map<Long, String> responses) {
        log.debug("Validating feedback submission for feedback ID: {}", feedbackId);
        
        return feedbackRepository.findById(feedbackId)
            .switchIfEmpty(Mono.error(new IllegalArgumentException("Feedback not found")))
            .flatMap(feedback -> {
                return questionRepository.findAllById(feedback.getQuestionIds())
                    .collectList()
                    .flatMap(questions -> {
                        Map<String, Object> result = new HashMap<>();
                        
                        // Check if all required questions are answered
                        var unansweredRequiredQuestions = questions.stream()
                            .filter(Question::isRequired)
                            .filter(q -> !responses.containsKey(q.getId()) || 
                                        responses.get(q.getId()).trim().isEmpty())
                            .map(Question::getId)
                            .toList();
                        
                        if (!unansweredRequiredQuestions.isEmpty()) {
                            log.warn("Required questions not answered: {}", unansweredRequiredQuestions);
                            result.put("isValid", false);
                            result.put("message", "Required questions are not answered");
                            result.put("unansweredQuestions", unansweredRequiredQuestions);
                            return Mono.just(result);
                        }
                        
                        // Validate each response against question validation rules
                        for (Question question : questions) {
                            String response = responses.get(question.getId());
                            if (response != null && !response.trim().isEmpty()) {
                                String validationRules = question.getValidationRules();
                                if (validationRules != null && !validationRules.isEmpty() && 
                                    !validateResponse(response, validationRules)) {
                                    log.warn("Response for question {} did not pass validation", question.getId());
                                    result.put("isValid", false);
                                    result.put("message", "Response to question " + question.getId() + 
                                                         " does not meet validation criteria");
                                    result.put("invalidQuestion", question.getId());
                                    return Mono.just(result);
                                }
                            }
                        }
                        
                        // All validations passed
                        result.put("isValid", true);
                        result.put("message", "Validation successful");
                        return Mono.just(result);
                    });
            });
    }

    private boolean validateResponse(String response, String validationRules) {
        if (validationRules == null || validationRules.isEmpty()) {
            return true; // No validation rules specified
        }
        
        Map<String, Integer> rules = parseValidationRules(validationRules);
        
        // Apply validation rules (simplified for now)
        if (rules.containsKey("minLength") && response.length() < rules.get("minLength")) {
            return false;
        }
        if (rules.containsKey("maxLength") && response.length() > rules.get("maxLength")) {
            return false;
        }
        // Add more validation rules as needed
        
        return true;
    }

    private Map<String, Integer> parseValidationRules(String validationRules) {
        Map<String, Integer> rules = new HashMap<>();
        
        // Parse the validation rules string (assuming format like "minLength:5,maxLength:100")
        if (validationRules != null && !validationRules.isEmpty()) {
            String[] rulePairs = validationRules.split(",");
            for (String pair : rulePairs) {
                String[] keyValue = pair.trim().split(":");
                if (keyValue.length == 2) {
                    try {
                        rules.put(keyValue[0].trim(), Integer.parseInt(keyValue[1].trim()));
                    } catch (NumberFormatException e) {
                        log.warn("Invalid validation rule format: {}", pair);
                    }
                }
            }
        }
        
        return rules;
    }

    @Override
    public Flux<FeedbackSubmissionResponse> getAllSubmissions() {
        log.debug("Retrieving all submissions");
        return submissionRepository.findAll()
            .map(this::mapToResponse)
            .doOnComplete(() -> log.debug("Completed retrieving all submissions"));
    }

    @Override
    public Mono<Map<String, Long>> getSubmissionStatistics() {
        log.debug("Calculating submission statistics");
        
        return Mono.fromCallable(() -> {
            Map<String, Long> statistics = new HashMap<>();
            
            Long totalCount = ReactiveHelper.safeBlockLong(submissionRepository.count());
            statistics.put("totalSubmissions", totalCount);
            
            // Add more statistics gathering as needed
            
            return statistics;
        });
    }

    private FeedbackSubmissionResponse mapToResponse(FeedbackSubmission submission) {
        // Change the approach to handle reactive types
        return questionRepository.findAllById(submission.getFeedback() != null ? 
                submission.getFeedback().getQuestionIds() : List.of())
            .collectList()
            .map(questions -> {
                List<QuestionDetailsResponse> questionDetails = questions.stream()
                    .map(question -> QuestionDetailsResponse.builder()
                        .id(question.getId())
                        .text(question.getText())
                        .description(question.getDescription())
                        .questionType(question.getQuestionType())
                        .category(question.getCategory().toString())
                        .choices(question.getChoices())
                        .response(submission.getResponses().get(question.getId()))
                        .build())
                    .collect(Collectors.toList());
                
                return FeedbackSubmissionResponse.builder()
                    .id(submission.getId())
                    .feedbackId(submission.getFeedbackId())
                    .submittedBy(submission.getSubmittedBy())
                    .responses(submission.getResponses())
                    .questionDetails(questionDetails)
                    .overallComments(submission.getOverallComments())
                    .privacyLevel(submission.getPrivacyLevel())
                    .submittedAt(submission.getSubmittedAt())
                    .updatedAt(submission.getUpdatedAt())
                    .build();
            })
            .block(); // This is not ideal in a reactive application, but needed for this refactoring stage
    }
} 