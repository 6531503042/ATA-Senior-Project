package dev.bengi.feedbackservice.service.impl;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

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
import dev.bengi.feedbackservice.util.ReactiveHelper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class FeedbackServiceImpl implements FeedbackService {
    private final FeedbackRepository feedbackRepository;
    private final FeedbackSubmissionRepository submissionRepository;
    private final QuestionRepository questionRepository;
    private final UserService userService;
    private final FeedbackPermissionService permissionService;

    @Override
    public Mono<Feedback> createFeedback(Feedback feedback) {
        log.debug("Creating new feedback: {}", feedback.getTitle());
        
        return Mono.just(feedback)
            .flatMap(f -> {
                // Validate project exists and has members
                Project project = f.getProject();
                if (project == null) {
                    return Mono.error(new IllegalArgumentException("Feedback must be associated with a project"));
                }
                
                Set<Long> memberIds = project.getMemberIds();
                if (memberIds == null || memberIds.isEmpty()) {
                    return Mono.error(new IllegalArgumentException("Project has no members"));
                }
                
                // Set creation time and metadata
                LocalDateTime now = LocalDateTime.now();
                f.setCreatedAt(now);
                f.setUpdatedAt(now);
                f.setActive(true);
                f.setStatus("DRAFT");
                f.setProjectId(project.getId());
                
                // Validate questions exist
                List<Long> questionIds = f.getQuestionIds();
                if (questionIds == null || questionIds.isEmpty()) {
                    return Mono.error(new IllegalArgumentException("Feedback must have at least one question"));
                }
                
                return Flux.fromIterable(questionIds)
                    .flatMapSequential(qId -> questionRepository.existsById(qId)
                                      .flatMap(exists -> exists 
                                               ? Mono.just(qId) 
                                               : Mono.error(new RuntimeException("Question not found with id: " + qId))))
                    .collectList()
                    .flatMap(validQuestionIds -> {
                        // Continue with feedback creation
                        f.setQuestionIds(validQuestionIds);
                        return feedbackRepository.save(f);
                    });
            });
    }

    @Override
    public Mono<Feedback> updateFeedback(Long id, Feedback feedback) {
        return feedbackRepository.findById(id)
            .switchIfEmpty(Mono.error(new RuntimeException("Feedback not found with id: " + id)))
            .flatMap(existingFeedback -> {
                existingFeedback.setTitle(feedback.getTitle());
                existingFeedback.setDescription(feedback.getDescription());
                existingFeedback.setQuestionIds(feedback.getQuestionIds());
                existingFeedback.setStartDate(feedback.getStartDate());
                existingFeedback.setEndDate(feedback.getEndDate());
                existingFeedback.setUpdatedAt(LocalDateTime.now());
                
                if (feedback.getProject() != null) {
                    existingFeedback.setProject(feedback.getProject());
                    existingFeedback.setProjectId(feedback.getProject().getId());
                }
                
                return feedbackRepository.save(existingFeedback);
            });
    }

    @Override
    public Mono<Void> deleteFeedback(Long id) {
        return feedbackRepository.findById(id)
            .switchIfEmpty(Mono.error(new RuntimeException("Feedback not found with id: " + id)))
            .flatMap(feedback -> {
                feedback.setActive(false);
                feedback.setUpdatedAt(LocalDateTime.now());
                return feedbackRepository.save(feedback);
            })
            .then();
    }

    @Override
    public Mono<Feedback> getFeedbackById(Long id) {
        return feedbackRepository.findById(id)
            .switchIfEmpty(Mono.error(new RuntimeException("Feedback not found with id: " + id)));
    }

    @Override
    public Flux<Feedback> getAllFeedbacks() {
        return feedbackRepository.findByActive(true);
    }

    @Override
    public Flux<Feedback> getFeedbacksByDepartment(String departmentId) {
        return feedbackRepository.findByDepartmentIdAndActive(departmentId, true);
    }

    @Override
    public Flux<Feedback> getDepartmentWideFeedbacks(String departmentId) {
        return feedbackRepository.findByDepartmentIdAndIsDepartmentWideAndActive(departmentId, true, true);
    }

    @Override
    public Flux<Feedback> getFeedbacksByUser(String userId) {
        return feedbackRepository.findByTargetUserIdsContainingAndActive(userId, true);
    }

    @Override
    public Mono<Feedback> activateFeedback(Long id) {
        return feedbackRepository.findById(id)
            .switchIfEmpty(Mono.error(new RuntimeException("Feedback not found with id: " + id)))
            .flatMap(feedback -> {
                feedback.setActive(true);
                feedback.setStatus("ACTIVE");
                feedback.setUpdatedAt(LocalDateTime.now());
                return feedbackRepository.save(feedback);
            });
    }

    @Override
    public Mono<Feedback> closeFeedback(Long id) {
        return feedbackRepository.findById(id)
            .switchIfEmpty(Mono.error(new RuntimeException("Feedback not found with id: " + id)))
            .flatMap(feedback -> {
                feedback.setActive(false);
                feedback.setStatus("CLOSED");
                feedback.setUpdatedAt(LocalDateTime.now());
                return feedbackRepository.save(feedback);
            });
    }

    @Override
    public Mono<Feedback> addTargetUser(Long feedbackId, String userId) {
        return feedbackRepository.findById(feedbackId)
            .switchIfEmpty(Mono.error(new RuntimeException("Feedback not found with id: " + feedbackId)))
            .flatMap(feedback -> {
                feedback.getTargetUserIds().add(userId);
                feedback.setUpdatedAt(LocalDateTime.now());
                return feedbackRepository.save(feedback);
            });
    }

    @Override
    public Mono<Feedback> removeTargetUser(Long feedbackId, String userId) {
        return feedbackRepository.findById(feedbackId)
            .switchIfEmpty(Mono.error(new RuntimeException("Feedback not found with id: " + feedbackId)))
            .flatMap(feedback -> {
                feedback.getTargetUserIds().remove(userId);
                feedback.setUpdatedAt(LocalDateTime.now());
                return feedbackRepository.save(feedback);
            });
    }

    @Override
    public Mono<Feedback> addTargetDepartment(Long feedbackId, String departmentId) {
        return feedbackRepository.findById(feedbackId)
            .switchIfEmpty(Mono.error(new RuntimeException("Feedback not found with id: " + feedbackId)))
            .flatMap(feedback -> {
                feedback.getTargetDepartmentIds().add(departmentId);
                feedback.setUpdatedAt(LocalDateTime.now());
                return feedbackRepository.save(feedback);
            });
    }

    @Override
    public Mono<Feedback> removeTargetDepartment(Long feedbackId, String departmentId) {
        return feedbackRepository.findById(feedbackId)
            .switchIfEmpty(Mono.error(new RuntimeException("Feedback not found with id: " + feedbackId)))
            .flatMap(feedback -> {
                feedback.getTargetDepartmentIds().remove(departmentId);
                feedback.setUpdatedAt(LocalDateTime.now());
                return feedbackRepository.save(feedback);
            });
    }

    @Override
    public Flux<Feedback> getFeedbacksByProject(Long projectId) {
        return feedbackRepository.findByProjectId(projectId);
    }

    @Override
    public Flux<FeedbackDetailsResponse> getAvailableFeedbacksForUser(String userId) {
        return feedbackRepository.findByActive(true)
                .flatMap(feedback -> {
                    return Mono.just(feedback)
                            .map(f -> {
                                FeedbackDetailsResponse.FeedbackDetailsResponseBuilder builder = FeedbackDetailsResponse.builder()
                                        .id(f.getId())
                                        .title(f.getTitle())
                                        .description(f.getDescription())
                                        .projectName(f.getProject() != null ? f.getProject().getName() : null)
                                        .startDate(f.getStartDate())
                                        .endDate(f.getEndDate())
                                        .active(f.isActive())
                                        .alreadySubmitted(hasUserSubmitted(f))
                                        .validationRules(getValidationRules(f));

                                return Flux.fromIterable(f.getQuestionIds())
                                        .flatMapSequential(qId -> questionRepository.findById(qId)
                                                                .flatMap(question -> Mono.justOrEmpty(question)))
                                        .collectList()
                                        .map(questions -> {
                                            builder.questions(mapToQuestionResponses(questions));
                                            return builder.build();
                                        });
                            })
                            .flatMap(mono -> mono);
                });
    }

    @Override
    public Mono<FeedbackDetailsResponse> getFeedbackDetails(Long feedbackId) {
        return feedbackRepository.findById(feedbackId)
                .flatMap(feedback -> {
                    FeedbackDetailsResponse.FeedbackDetailsResponseBuilder builder = FeedbackDetailsResponse.builder()
                            .id(feedback.getId())
                            .title(feedback.getTitle())
                            .description(feedback.getDescription())
                            .projectName(feedback.getProject() != null ? feedback.getProject().getName() : null)
                            .startDate(feedback.getStartDate())
                            .endDate(feedback.getEndDate())
                            .active(feedback.isActive())
                            .alreadySubmitted(hasUserSubmitted(feedback))
                            .validationRules(getValidationRules(feedback));

                    return Flux.fromIterable(feedback.getQuestionIds())
                            .flatMapSequential(qId -> questionRepository.findById(qId)
                                            .flatMap(question -> Mono.justOrEmpty(question)))
                            .collectList()
                            .map(questions -> {
                                builder.questions(mapToQuestionResponses(questions));
                                return builder.build();
                            });
                });
    }

    @Override
    public Mono<Map<String, Long>> getFeedbackStatistics() {
        return Mono.zip(
                feedbackRepository.countActiveFeedbacks(),
                submissionRepository.countAll()
            )
            .map(tuple -> {
                Map<String, Long> stats = new HashMap<>();
                stats.put("totalActiveFeedbacks", tuple.getT1());
                stats.put("totalSubmissions", tuple.getT2());
                return stats;
            });
    }

    @Override
    public Mono<Map<String, Double>> getFeedbackMetrics() {
        return feedbackRepository.getAverageResponseTime()
            .map(avgTime -> {
                Map<String, Double> metrics = new HashMap<>();
                metrics.put("averageResponseTimeSeconds", avgTime);
                return metrics;
            });
    }

    @Override
    public Flux<Feedback> getRecentFeedbacks() {
        return feedbackRepository.findRecentFeedbacks();
    }

    private List<QuestionResponse> mapToQuestionResponses(List<Question> questions) {
        return questions.stream().map(q -> {
            QuestionResponse.QuestionResponseBuilder builder = QuestionResponse.builder()
                .id(q.getId())
                .text(q.getText())
                .type(q.getQuestionType())
                .required(q.isRequired())
                .category(q.getCategory())
                .answerType(mapQuestionTypeToAnswerType(q.getQuestionType()));
            
            if (q.getChoices() != null && !q.getChoices().isEmpty()) {
                List<AnswerOptionResponse> options = mapChoicesToAnswerOptions(q.getChoices());
                builder.answers(options);
            }
            
            if (q.getValidationRules() != null) {
                builder.validationRules(q.getValidationRules());
            }
            
            return builder.build();
        }).collect(Collectors.toList());
    }

    private AnswerType mapQuestionTypeToAnswerType(QuestionType questionType) {
        return switch (questionType) {
            case TEXT_BASED -> AnswerType.TEXT;
            case SINGLE_CHOICE -> AnswerType.SINGLE_CHOICE;
            case MULTIPLE_CHOICE -> AnswerType.MULTIPLE_CHOICE;
            case RATING -> AnswerType.RATING;
            case SENTIMENT -> AnswerType.SENTIMENT;
            default -> AnswerType.TEXT;
        };
    }

    private List<AnswerOptionResponse> mapChoicesToAnswerOptions(List<String> choices) {
        return choices.stream().map(choice -> 
            AnswerOptionResponse.builder()
                .value(choice)
                .text(choice)
                .build()
        ).collect(Collectors.toList());
    }

    private boolean hasUserSubmitted(Feedback feedback) {
        try {
            String userId = getCurrentUserId();
            if (userId == null) {
                return false;
            }
            
            return ReactiveHelper.safeBlock(submissionRepository.existsByFeedbackIdAndUserId(feedback.getId(), userId));
        } catch (Exception e) {
            log.error("Error checking if user has submitted feedback", e);
            return false;
        }
    }

    private String getCurrentUserId() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.isAuthenticated()) {
                return authentication.getName();
            }
            return null;
        } catch (Exception e) {
            log.error("Error getting current user ID", e);
            return null;
        }
    }

    private Map<String, Object> getValidationRules(Feedback feedback) {
        Map<String, Object> rules = new HashMap<>();
        rules.put("allowAnonymous", feedback.isAllowAnonymous());
        return rules;
    }
}
