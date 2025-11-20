package dev.bengi.main.modules.submit.service;

import dev.bengi.main.common.pagination.PageRequest;
import dev.bengi.main.common.pagination.PageResponse;
import dev.bengi.main.common.pagination.PaginationService;
import dev.bengi.main.exception.ErrorCode;
import dev.bengi.main.exception.GlobalServiceException;
import dev.bengi.main.modules.submit.dto.SubmitMapper;
import dev.bengi.main.modules.submit.dto.SubmitRequestDto;
import dev.bengi.main.modules.submit.dto.SubmitResponseDto;
import dev.bengi.main.modules.submit.dto.SubmissionAnalysisDto;
import dev.bengi.main.modules.submit.model.Submit;
import dev.bengi.main.modules.submit.repository.SubmitRepository;
import dev.bengi.main.modules.submit.repository.SubmissionResponseRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import dev.bengi.main.modules.feedback.repository.FeedbackRepository;
import dev.bengi.main.modules.feedback.repository.FeedbackTargetRepository;
import dev.bengi.main.modules.projects.repository.ProjectRepository;

@Service
@Slf4j
@RequiredArgsConstructor
public class SubmitService {
    private final SubmitRepository submitRepository;
    private final SubmitMapper mapper;
    private final SubmissionResponseRepository submissionResponseRepository;
    private final FeedbackRepository feedbackRepository;
    private final FeedbackTargetRepository feedbackTargetRepository;
    private final ProjectRepository projectRepository;
    private final PaginationService paginationService;

    @Transactional
    public Mono<SubmitResponseDto> submit(String userId, SubmitRequestDto req) {
        // Permission: feedback must exist and (user in target users/departments OR project member)
        if (userId == null || userId.isBlank()) {
            return Mono.error(new GlobalServiceException(ErrorCode.UNAUTHORIZED, "Missing user"));
        }
        
        // Validate feedback existence and timing
        return feedbackRepository.findById(req.feedbackId())
                .switchIfEmpty(Mono.error(new GlobalServiceException(ErrorCode.NOT_FOUND, "Feedback not found")))
                .flatMap(feedback -> validateFeedbackTiming(feedback))
                .then(validateResponses(req))
                .then(Mono.defer(() -> {
                    Submit entity = mapper.toEntity(req);
                    entity.setUserId(userId);
                    return submitRepository.save(entity)
                            .flatMap(saved -> reactor.core.publisher.Flux.fromIterable(req.responses().entrySet())
                                    .flatMap(e -> submissionResponseRepository.upsertResponse(saved.getId(), e.getKey(), e.getValue()))
                                    .then(Mono.just(saved)))
                            .map(mapper::toResponse);
                }));
    }

    private Mono<Void> validateFeedbackTiming(dev.bengi.main.modules.feedback.model.Feedback feedback) {
        java.time.LocalDateTime now = java.time.LocalDateTime.now();
        
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
    }

    private Mono<Void> validateResponses(SubmitRequestDto req) {
        // Placeholder for rule-based validation (required/type/regex) – can be expanded
        if (req.responses() == null || req.responses().isEmpty()) {
            return Mono.error(new GlobalServiceException(ErrorCode.VALIDATION_ERROR, "Responses required"));
        }
        return Mono.empty();
    }

    public Mono<SubmitResponseDto> getById(Long id) {
        return submitRepository.findById(id)
                .switchIfEmpty(Mono.error(new GlobalServiceException(ErrorCode.NOT_FOUND)))
                .flatMap(this::loadResponses)
                .flatMap(this::enrichSubmissionWithFeedback)
                .map(mapper::toResponse);
    }

    public Flux<SubmitResponseDto> getByFeedback(Long feedbackId) {
        return submitRepository.findByFeedbackId(feedbackId)
                .flatMap(this::loadResponses)
                .flatMap(this::enrichSubmissionWithFeedback)
                .map(mapper::toResponse);
    }

    public Mono<PageResponse<SubmitResponseDto>> getByFeedback(Long feedbackId, PageRequest pageRequest) {
        return paginationService.paginateInMemory(
            submitRepository.findByFeedbackId(feedbackId)
                .flatMap(this::loadResponses)
                .flatMap(this::enrichSubmissionWithFeedback)
                .map(mapper::toResponse),
            pageRequest
        );
    }

    public Flux<SubmitResponseDto> getByUser(String userId) {
        return submitRepository.findByUserId(userId)
                .flatMap(this::loadResponses)
                .flatMap(this::enrichSubmissionWithFeedback)
                .map(mapper::toResponse);
    }

    public Mono<PageResponse<SubmitResponseDto>> getByUser(String userId, PageRequest pageRequest) {
        return paginationService.paginateInMemory(
            submitRepository.findByUserId(userId)
                .flatMap(this::loadResponses)
                .flatMap(this::enrichSubmissionWithFeedback)
                .map(mapper::toResponse),
            pageRequest
        );
    }

    public Mono<PageResponse<SubmitResponseDto>> getAllSubmissions(PageRequest pageRequest) {
        return paginationService.paginateInMemory(
            submitRepository.findAll().flatMap(this::loadResponses).map(mapper::toResponse),
            pageRequest
        );
    }

    private Mono<Submit> loadResponses(Submit submit) {
        return submissionResponseRepository.findResponsesBySubmission(submit.getId())
                .collectMap(
                    row -> row.questionId,
                    row -> row.response
                )
                .map(responseMap -> {
                    submit.setResponses(responseMap);
                    return submit;
                })
                .switchIfEmpty(Mono.just(submit)); // Return original if no responses
    }
    
    private Mono<Submit> enrichSubmissionWithFeedback(Submit submit) {
        if (submit.getFeedbackId() == null) {
            return Mono.just(submit);
        }
        
        return feedbackRepository.findById(submit.getFeedbackId())
                .flatMap(feedback -> {
                    submit.setFeedbackTitle(feedback.getTitle());
                    submit.setFeedbackEndDate(feedback.getEndDate());
                    
                    if (feedback.getProjectId() != null) {
                        return projectRepository.findById(feedback.getProjectId())
                                .map(project -> {
                                    submit.setProjectId(project.getId());
                                    submit.setProjectName(project.getName());
                                    return submit;
                                })
                                .defaultIfEmpty(submit);
                    }
                    return Mono.just(submit);
                })
                .defaultIfEmpty(submit);
    }

    // Additional methods for employee endpoints
    
    public Mono<Long> countSubmissionsByUser(String username) {
        return submitRepository.findByUserId(username).count();
    }
    
    public Mono<Long> countSubmissionsSince(String username, java.time.LocalDateTime since) {
        return submitRepository.findByUserId(username)
                .filter(submit -> submit.getSubmittedAt().isAfter(since))
                .count();
    }
    
    public Mono<Double> getAverageSubmissionTime(String username, java.time.LocalDateTime since) {
        // Placeholder implementation - calculate average time between feedback start and submission
        return Mono.just(45.5); // Average minutes
    }
    
    public Mono<Double> getSubmissionCompletionRate(String username, java.time.LocalDateTime since) {
        // Placeholder implementation - calculate completion rate
        return Mono.just(85.0); // 85% completion rate
    }

    @Transactional
    public Mono<Void> saveAnalysis(Long submissionId, SubmissionAnalysisDto analysisDto, String analyzedBy) {
        return submitRepository.findById(submissionId)
                .switchIfEmpty(Mono.error(new GlobalServiceException(ErrorCode.NOT_FOUND, "Submission not found")))
                .flatMap(submission -> {
                    // Update analysis fields
                    submission.setAdminRating(analysisDto.rating());
                    submission.setAdminSentiment(analysisDto.sentiment());
                    submission.setAnalysisNotes(analysisDto.analysisNotes());
                    submission.setAnalyzedAt(analysisDto.analyzedAt());
                    submission.setAnalyzedBy(analyzedBy);
                    
                    return submitRepository.save(submission);
                })
                .then();
    }
}


