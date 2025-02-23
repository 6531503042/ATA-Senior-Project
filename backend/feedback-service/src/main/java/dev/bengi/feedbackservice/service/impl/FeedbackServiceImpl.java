package dev.bengi.feedbackservice.service.impl;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import dev.bengi.feedbackservice.domain.enums.AnswerType;
import dev.bengi.feedbackservice.domain.enums.QuestionType;
import dev.bengi.feedbackservice.domain.model.Feedback;
import dev.bengi.feedbackservice.domain.model.Project;
import dev.bengi.feedbackservice.domain.model.Question;
import dev.bengi.feedbackservice.domain.payload.response.AnswerOptionResponse;
import dev.bengi.feedbackservice.domain.payload.response.FeedbackDetailsResponse;
import dev.bengi.feedbackservice.domain.payload.response.QuestionResponse;
import dev.bengi.feedbackservice.repository.FeedbackRepository;
import dev.bengi.feedbackservice.repository.FeedbackSubmissionRepository;
import dev.bengi.feedbackservice.repository.QuestionRepository;
import dev.bengi.feedbackservice.service.FeedbackPermissionService;
import dev.bengi.feedbackservice.service.FeedbackService;
import dev.bengi.feedbackservice.service.UserService;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class FeedbackServiceImpl implements FeedbackService {
    private final FeedbackRepository feedbackRepository;
    private final FeedbackSubmissionRepository submissionRepository;
    private final QuestionRepository questionRepository;
    private final UserService userService;
    private final FeedbackPermissionService permissionService;
    private static final Logger log = LoggerFactory.getLogger(FeedbackServiceImpl.class);

    @Override
    @Transactional
    public Feedback createFeedback(Feedback feedback) {
        log.debug("Creating new feedback: {}", feedback.getTitle());
        
        // Validate project exists and has members
        Project project = feedback.getProject();
        if (project == null) {
            throw new IllegalArgumentException("Feedback must be associated with a project");
        }
        
        Set<Long> memberIds = project.getMemberIds();
        if (memberIds == null || memberIds.isEmpty()) {
            throw new IllegalArgumentException("Project has no members");
        }
        
        // Set creation time
        LocalDateTime now = LocalDateTime.now();
        feedback.setCreatedAt(now);
        feedback.setUpdatedAt(now);
        
        // Validate questions exist
        List<Long> questionIds = feedback.getQuestionIds();
        if (questionIds == null || questionIds.isEmpty()) {
            throw new IllegalArgumentException("Feedback must have at least one question");
        }
        
        boolean questionsExist = questionRepository.findAllById(questionIds)
                .size() == questionIds.size();
        if (!questionsExist) {
            throw new IllegalArgumentException("One or more questions do not exist");
        }
        
        return feedbackRepository.save(feedback);
    }

    @Override
    public Feedback updateFeedback(Long id, Feedback feedback) {
        Feedback existingFeedback = getFeedback(id);
        feedback.setId(id);
        return feedbackRepository.save(feedback);
    }

    @Override
    public void deleteFeedback(Long id) {
        feedbackRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Feedback getFeedback(Long id) {
        return feedbackRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Feedback not found"));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Feedback> getAllFeedbacks() {
        return feedbackRepository.findAll().stream()
                .filter(Feedback::isActive)  // Only return active feedbacks
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<Feedback> getFeedbacksByProject(Long projectId) {
        return feedbackRepository.findByProjectId(projectId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Feedback> getFeedbacksByUser(String userId) {
        try {
            Long userIdLong = Long.parseLong(userId);
            return feedbackRepository.findByProjectMemberId(userIdLong);
        } catch (NumberFormatException e) {
            log.error("Invalid user ID format: {}", userId);
            throw new IllegalArgumentException("Invalid user ID format", e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<FeedbackDetailsResponse> getAvailableFeedbacksForUser(String userId) {
        log.debug("Getting available feedbacks for user: {}", userId);
        
        // Get all feedbacks where the user is a project member
        List<Feedback> userFeedbacks = feedbackRepository.findByProjectMemberId(Long.parseLong(userId));
        
        // Filter active feedbacks and map to response
        return userFeedbacks.stream()
                .filter(Feedback::isActive)  // Only return active feedbacks
                .filter(feedback -> {
                    LocalDateTime now = LocalDateTime.now();
                    return feedback.getStartDate().isBefore(now) && 
                           feedback.getEndDate().isAfter(now);
                })
                .map(feedback -> {
                    List<Question> questions = questionRepository.findAllById(feedback.getQuestionIds());
                    return FeedbackDetailsResponse.builder()
                            .id(feedback.getId())
                            .title(feedback.getTitle())
                            .description(feedback.getDescription())
                            .projectName(feedback.getProject().getName())
                            .questions(mapToQuestionResponses(questions))
                            .startDate(feedback.getStartDate())
                            .endDate(feedback.getEndDate())
                            .active(feedback.isActive())
                            .alreadySubmitted(hasUserSubmitted(feedback))
                            .validationRules(getValidationRules(feedback))
                            .build();
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public FeedbackDetailsResponse getFeedbackDetails(Long feedbackId) {
        log.debug("Getting feedback details for ID: {}", feedbackId);
        
        Feedback feedback = getFeedback(feedbackId);
        List<Question> questions = questionRepository.findAllById(feedback.getQuestionIds());
        
        FeedbackDetailsResponse response = FeedbackDetailsResponse.builder()
                .id(feedback.getId())
                .title(feedback.getTitle())
                .description(feedback.getDescription())
                .projectName(feedback.getProject().getName())
                .questions(mapToQuestionResponses(questions))
                .startDate(feedback.getStartDate())
                .endDate(feedback.getEndDate())
                .active(feedback.isActive())
                .alreadySubmitted(hasUserSubmitted(feedback))
                .validationRules(getValidationRules(feedback))
                .build();
                
        log.debug("Successfully built feedback details response for ID: {}", feedbackId);
        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Long> getFeedbackStatistics() {
        Map<String, Long> statistics = new HashMap<>();
        statistics.put("totalFeedbacks", feedbackRepository.count());
        statistics.put("activeFeedbacks", feedbackRepository.countActiveFeedbacks());
        return statistics;
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Double> getFeedbackMetrics() {
        Map<String, Double> metrics = new HashMap<>();
        metrics.put("averageResponseTime", feedbackRepository.getAverageResponseTime());
        return metrics;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Feedback> getRecentFeedbacks() {
        return feedbackRepository.findRecentFeedbacks();
    }

    private List<QuestionResponse> mapToQuestionResponses(List<Question> questions) {
        return questions.stream()
                .map(q -> QuestionResponse.builder()
                        .id(q.getId())
                        .text(q.getText())
                        .content(q.getText())  // Using text as content
                        .required(q.isRequired())
                        .type(q.getQuestionType())  // Map questionType to type
                        .category(q.getCategory())
                        .answerType(mapQuestionTypeToAnswerType(q.getQuestionType()))  // Map questionType to answerType
                        .answers(mapChoicesToAnswerOptions(q.getChoices()))  // Map choices to answers
                        .createdAt(q.getCreatedAt() != null ? q.getCreatedAt().atZone(java.time.ZoneId.systemDefault()) : null)
                        .updatedAt(q.getUpdatedAt() != null ? q.getUpdatedAt().atZone(java.time.ZoneId.systemDefault()) : null)
                        .description(q.getDescription())
                        .validationRules(q.getValidationRules())
                        .build())
                .collect(Collectors.toList());
    }

    private AnswerType mapQuestionTypeToAnswerType(QuestionType questionType) {
        if (questionType == null) return null;
        switch (questionType) {
            case MULTIPLE_CHOICE:
                return AnswerType.MULTIPLE_CHOICE;
            case SINGLE_CHOICE:
                return AnswerType.SINGLE_CHOICE;
            case TEXT_BASED:
                return AnswerType.TEXT;
            case RATING:
                return AnswerType.RATING;
            case SENTIMENT:
                return AnswerType.SENTIMENT;
            default:
                return null;
        }
    }

    private List<AnswerOptionResponse> mapChoicesToAnswerOptions(List<String> choices) {
        if (choices == null) return new ArrayList<>();
        return choices.stream()
                .map(choice -> AnswerOptionResponse.builder()
                        .text(choice)
                        .value(choice)
                        .build())
                .collect(Collectors.toList());
    }

    private boolean hasUserSubmitted(Feedback feedback) {
        String userId = getCurrentUserId();
        if (userId == null) {
            return false;
        }
        return submissionRepository.existsByFeedbackIdAndSubmittedBy(feedback.getId(), userId);
    }

    private String getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getDetails() instanceof Map) {
            Map<String, Object> details = (Map<String, Object>) auth.getDetails();
            if (details.containsKey("userId")) {
                return String.valueOf(details.get("userId"));
            }
        }
        return auth.getName();
    }

    private Map<String, Object> getValidationRules(Feedback feedback) {
        Map<String, Object> rules = new HashMap<>();
        rules.put("minQuestions", feedback.getQuestionIds().size());
        rules.put("maxQuestions", feedback.getQuestionIds().size());
        rules.put("requiresComments", true);
        return rules;
    }
}
