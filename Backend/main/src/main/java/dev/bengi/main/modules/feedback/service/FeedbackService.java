package dev.bengi.main.modules.feedback.service;

import dev.bengi.main.common.pagination.PageRequest;
import dev.bengi.main.common.pagination.PageResponse;
import dev.bengi.main.common.pagination.PaginationService;
import dev.bengi.main.exception.ErrorCode;
import dev.bengi.main.exception.GlobalServiceException;
import dev.bengi.main.modules.feedback.model.Feedback;
import dev.bengi.main.modules.feedback.repository.FeedbackRepository;
import dev.bengi.main.modules.feedback.repository.FeedbackQuestionRepository;
import dev.bengi.main.modules.feedback.repository.FeedbackTargetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class FeedbackService {
    private final FeedbackRepository feedbackRepository;
    private final FeedbackQuestionRepository feedbackQuestionRepository;
    private final FeedbackTargetRepository feedbackTargetRepository;
    private final PaginationService paginationService;

    public Mono<Feedback> get(Long id) {
        return feedbackRepository.findById(id)
                .switchIfEmpty(Mono.error(new GlobalServiceException(ErrorCode.NOT_FOUND)));
    }

    @Transactional
    public Mono<Void> addQuestions(Long feedbackId, java.util.List<Long> questionIds) {
        return Flux.fromIterable(questionIds)
                .flatMap(qid -> feedbackQuestionRepository.addQuestion(feedbackId, qid))
                .then();
    }

    @Transactional
    public Mono<Void> removeQuestions(Long feedbackId, java.util.List<Long> questionIds) {
        return Flux.fromIterable(questionIds)
                .flatMap(qid -> feedbackQuestionRepository.removeQuestion(feedbackId, qid))
                .then();
    }

    @Transactional
    public Mono<Void> addTargetUsers(Long feedbackId, java.util.List<Long> userIds) {
        return Flux.fromIterable(userIds)
                .flatMap(uid -> feedbackTargetRepository.addTargetUser(feedbackId, uid))
                .then();
    }

    @Transactional
    public Mono<Void> removeTargetUsers(Long feedbackId, java.util.List<Long> userIds) {
        return Flux.fromIterable(userIds)
                .flatMap(uid -> feedbackTargetRepository.removeTargetUser(feedbackId, uid))
                .then();
    }

    @Transactional
    public Mono<Void> addTargetDepartments(Long feedbackId, java.util.List<Long> departmentIds) {
        return Flux.fromIterable(departmentIds)
                .flatMap(did -> feedbackTargetRepository.addTargetDepartment(feedbackId, did))
                .then();
    }

    @Transactional
    public Mono<Void> removeTargetDepartments(Long feedbackId, java.util.List<Long> departmentIds) {
        return Flux.fromIterable(departmentIds)
                .flatMap(did -> feedbackTargetRepository.removeTargetDepartment(feedbackId, did))
                .then();
    }

    // Pagination methods
    
    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of(
        "id", "title", "description", "start_date", "end_date", "created_at", "updated_at"
    );

    private static final Set<String> SEARCHABLE_FIELDS = Set.of(
        "title", "description"
    );

    public Mono<PageResponse<Feedback>> findAllFeedbacks(PageRequest pageRequest) {
        return paginationService.paginateInMemory(
            feedbackRepository.findAll(),
            pageRequest
        );
    }

    public Mono<PageResponse<Feedback>> findAvailableFeedbacks(PageRequest pageRequest) {
        return paginationService.paginateInMemory(
            feedbackRepository.findActiveAndAvailable(),
            pageRequest
        );
    }

    // Timing validation methods

    public Mono<Feedback> getAvailableFeedback(Long id) {
        return feedbackRepository.findActiveAndAvailableById(id)
                .switchIfEmpty(Mono.error(new GlobalServiceException(
                    ErrorCode.NOT_FOUND, 
                    "Feedback not found or not available at this time"
                )));
    }

    public Mono<Void> validateFeedbackSubmissionTiming(Long feedbackId) {
        return feedbackRepository.findById(feedbackId)
                .switchIfEmpty(Mono.error(new GlobalServiceException(ErrorCode.NOT_FOUND, "Feedback not found")))
                .flatMap(feedback -> {
                    LocalDateTime now = LocalDateTime.now();
                    
                    // Check if feedback is active
                    if (!feedback.isActive()) {
                        return Mono.error(new GlobalServiceException(
                            ErrorCode.BAD_REQUEST, 
                            "This feedback is not active"
                        ));
                    }
                    
                    // Check start date
                    if (feedback.getStartDate() != null && now.isBefore(feedback.getStartDate())) {
                        return Mono.error(new GlobalServiceException(
                            ErrorCode.BAD_REQUEST, 
                            "Feedback submission has not started yet. Available from: " + feedback.getStartDate()
                        ));
                    }
                    
                    // Check end date
                    if (feedback.getEndDate() != null && now.isAfter(feedback.getEndDate())) {
                        return Mono.error(new GlobalServiceException(
                            ErrorCode.BAD_REQUEST, 
                            "Feedback submission has ended. Deadline was: " + feedback.getEndDate()
                        ));
                    }
                    
                    return Mono.empty();
                });
    }

    public Mono<Boolean> isFeedbackAvailableForSubmission(Long feedbackId) {
        return validateFeedbackSubmissionTiming(feedbackId)
                .then(Mono.just(true))
                .onErrorReturn(false);
    }
}


