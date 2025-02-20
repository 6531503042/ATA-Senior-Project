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
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class FeedbackSubmissionServiceImpl implements FeedbackSubmissionService {
    private final FeedbackSubmissionRepository submissionRepository;
    private final FeedbackRepository feedbackRepository;
    private final QuestionRepository questionRepository;

    @Override
    public FeedbackSubmissionResponse submitFeedback(FeedbackSubmissionRequest request) {
        log.debug("Processing feedback submission for feedback ID: {}", request.getFeedbackId());
        
        // Get the feedback
        Feedback feedback = feedbackRepository.findById(request.getFeedbackId())
                .orElseThrow(() -> new IllegalArgumentException("Feedback not found with ID: " + request.getFeedbackId()));
        
        // Validate user is allowed to submit
        Long userId = Long.parseLong(request.getUserId());
        Set<Long> projectMembers = feedback.getProject().getMemberIds();
        if (!projectMembers.contains(userId)) {
            log.error("User {} not allowed to submit feedback {} - not a project member", userId, feedback.getId());
            throw new IllegalArgumentException("User not allowed to submit this feedback - not a project member");
        }
        
        // Check if feedback is active and within time window
        LocalDateTime now = LocalDateTime.now();
        if (!feedback.isActive() || now.isBefore(feedback.getStartDate()) || now.isAfter(feedback.getEndDate())) {
            log.error("Feedback {} is not active or outside submission window", feedback.getId());
            throw new IllegalArgumentException("Feedback is not active or outside submission window");
        }

        // Validate privacy level based on user role and feedback settings
        validatePrivacyLevel(request.getPrivacyLevel(), userId, feedback);
        
        // Create submission
        FeedbackSubmission submission = FeedbackSubmission.builder()
                .feedback(feedback)
                .submittedBy(request.getPrivacyLevel() == PrivacyLevel.ANONYMOUS ? null : request.getUserId())
                .responses(request.getResponses())
                .overallComments(request.getOverallComments())
                .privacyLevel(request.getPrivacyLevel())
                .submittedAt(now)
                .reviewed(false)
                .build();
        
        FeedbackSubmission savedSubmission = submissionRepository.save(submission);
        log.info("Successfully saved feedback submission with ID: {}", savedSubmission.getId());
        
        return mapToResponse(savedSubmission);
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
    @Transactional(readOnly = true)
    public FeedbackSubmissionResponse getSubmission(Long id) {
        log.debug("Retrieving feedback submission with ID: {}", id);
        return submissionRepository.findById(id)
                .map(submission -> {
                    log.debug("Found feedback submission with ID: {}", id);
                    return mapToResponse(submission);
                })
                .orElseThrow(() -> {
                    log.error("Feedback submission not found with ID: {}", id);
                    return new IllegalArgumentException("Submission not found");
                });
    }

    @Override
    @Transactional(readOnly = true)
    public List<FeedbackSubmissionResponse> getSubmissionsByFeedback(Long feedbackId) {
        log.debug("Retrieving submissions for feedback ID: {}", feedbackId);
        List<FeedbackSubmissionResponse> submissions = submissionRepository.findByFeedbackId(feedbackId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        log.debug("Found {} submissions for feedback ID: {}", submissions.size(), feedbackId);
        return submissions;
    }

    @Override
    @Transactional(readOnly = true)
    public List<FeedbackSubmissionResponse> getSubmissionsByUser(String userId) {
        log.debug("Retrieving submissions for user ID: {}", userId);
        List<FeedbackSubmissionResponse> submissions = submissionRepository.findBySubmittedBy(userId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        log.debug("Found {} submissions for user ID: {}", submissions.size(), userId);
        return submissions;
    }

    @Override
    @Transactional(readOnly = true)
    public List<FeedbackSubmissionResponse> getPendingReviewSubmissions() {
        log.debug("Retrieving pending review submissions");
        List<FeedbackSubmissionResponse> submissions = submissionRepository.findByReviewedFalse()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        log.debug("Found {} pending review submissions", submissions.size());
        return submissions;
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> validateFeedbackSubmission(Long feedbackId, Map<Long, String> responses) {
        log.debug("Validating feedback submission for feedback ID: {}", feedbackId);
        Map<String, Object> result = new HashMap<>();
        
        try {
            Feedback feedback = feedbackRepository.findById(feedbackId)
                    .orElseThrow(() -> new IllegalArgumentException("Feedback not found"));
            
            List<Question> questions = questionRepository.findAllById(feedback.getQuestionIds());
            
            // Check if all required questions are answered
            List<Question> unansweredRequiredQuestions = questions.stream()
                    .filter(Question::isRequired)
                    .filter(q -> !responses.containsKey(q.getId()) || 
                               responses.get(q.getId()).trim().isEmpty())
                    .collect(Collectors.toList());
            
            if (!unansweredRequiredQuestions.isEmpty()) {
                log.warn("Required questions not answered: {}", 
                    unansweredRequiredQuestions.stream().map(Question::getId).collect(Collectors.toList()));
                result.put("isValid", false);
                result.put("message", "Required questions are not answered");
                result.put("unansweredQuestions", unansweredRequiredQuestions.stream()
                        .map(Question::getId)
                        .collect(Collectors.toList()));
                return result;
            }
            
            // Check if all answers are for valid questions
            List<Long> invalidQuestionIds = responses.keySet().stream()
                    .filter(qId -> !feedback.getQuestionIds().contains(qId))
                    .collect(Collectors.toList());
            
            if (!invalidQuestionIds.isEmpty()) {
                log.warn("Invalid question IDs found in responses: {}", invalidQuestionIds);
                result.put("isValid", false);
                result.put("message", "Invalid question IDs found in responses");
                result.put("invalidQuestionIds", invalidQuestionIds);
                return result;
            }
            
            // Validate each response against question rules
            for (Question question : questions) {
                String response = responses.get(question.getId());
                if (response != null && !validateResponse(response, question.getValidationRules())) {
                    log.warn("Response validation failed for question: {}", question.getId());
                    result.put("isValid", false);
                    result.put("message", "Response validation failed for question: " + question.getId());
                    result.put("questionId", question.getId());
                    return result;
                }
            }
            
            // All validations passed
            log.debug("Validation successful for feedback ID: {}", feedbackId);
            result.put("isValid", true);
            result.put("message", "Validation successful");
            return result;
        } catch (Exception e) {
            log.error("Error during feedback validation: {}", e.getMessage());
            result.put("isValid", false);
            result.put("message", "Validation error: " + e.getMessage());
            return result;
        }
    }

    private boolean validateResponse(String response, String validationRules) {
        if (validationRules == null || validationRules.isEmpty()) {
            return true;
        }
        
        Map<String, Integer> rules = parseValidationRules(validationRules);
        
        if (rules.containsKey("minLength") && response.length() < rules.get("minLength")) {
            log.debug("Response failed minLength validation: {} < {}", response.length(), rules.get("minLength"));
            return false;
        }
        
        if (rules.containsKey("maxLength") && response.length() > rules.get("maxLength")) {
            log.debug("Response failed maxLength validation: {} > {}", response.length(), rules.get("maxLength"));
            return false;
        }
        
        return true;
    }

    private Map<String, Integer> parseValidationRules(String validationRules) {
        Map<String, Integer> rules = new HashMap<>();
        
        if (validationRules == null || validationRules.isEmpty()) {
            return rules;
        }
        
        try {
            String[] ruleArray = validationRules.split(",");
            for (String rule : ruleArray) {
                String[] parts = rule.split(":");
                if (parts.length == 2) {
                    rules.put(parts[0], Integer.parseInt(parts[1]));
                }
            }
        } catch (Exception e) {
            log.warn("Error parsing validation rules: {}", e.getMessage());
        }
        
        return rules;
    }

    @Override
    @Transactional(readOnly = true)
    public List<FeedbackSubmissionResponse> getAllSubmissions() {
        log.debug("Getting all feedback submissions");
        return submissionRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Long> getSubmissionStatistics() {
        log.debug("Getting submission statistics");
        Map<String, Long> statistics = new HashMap<>();
        
        // Total submissions
        statistics.put("totalSubmissions", submissionRepository.count());
        
        // Pending review submissions
        statistics.put("pendingReviews", submissionRepository.countByReviewedFalse());
        
        // Submissions by feedback status
        statistics.put("activeSubmissions", 
            submissionRepository.countByFeedback_Active(true));
        
        // Average responses per feedback
        Double avgResponses = submissionRepository.getAverageResponsesPerFeedback();
        statistics.put("averageResponses", 
            avgResponses != null ? Math.round(avgResponses) : 0);
        
        return statistics;
    }

    private FeedbackSubmissionResponse mapToResponse(FeedbackSubmission submission) {
        List<Question> questions = questionRepository.findAllById(submission.getFeedback().getQuestionIds());
        
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
                .feedbackId(submission.getFeedback().getId())
                .submittedBy(submission.getPrivacyLevel() == PrivacyLevel.ANONYMOUS ? null : submission.getSubmittedBy())
                .responses(submission.getResponses())
                .questionDetails(questionDetails)
                .overallComments(submission.getOverallComments())
                .privacyLevel(submission.getPrivacyLevel())
                .submittedAt(submission.getSubmittedAt())
                .updatedAt(submission.getUpdatedAt())
                .build();
    }
} 