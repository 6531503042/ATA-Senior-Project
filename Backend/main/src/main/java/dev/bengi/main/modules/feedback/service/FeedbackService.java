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
import dev.bengi.main.modules.feedback.dto.FeedbackCreateRequestDto;
import dev.bengi.main.modules.feedback.dto.FeedbackUpdateRequestDto;
import dev.bengi.main.modules.feedback.dto.FeedbackResponseDto;
import dev.bengi.main.modules.feedback.dto.FeedbackMapper;
import dev.bengi.main.modules.projects.repository.ProjectMemberRepository;
import dev.bengi.main.modules.projects.repository.ProjectRepository;
import dev.bengi.main.modules.question.repository.QuestionRepository;
import dev.bengi.main.modules.user.repository.UserRepository;
import dev.bengi.main.modules.user.dto.UserResponseDto;
import dev.bengi.main.modules.department.repository.DepartmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.r2dbc.core.DatabaseClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import io.r2dbc.spi.Row;

@Service
@RequiredArgsConstructor
public class FeedbackService {
    private final FeedbackRepository feedbackRepository;
    private final FeedbackQuestionRepository feedbackQuestionRepository;
    private final FeedbackTargetRepository feedbackTargetRepository;
    private final FeedbackMapper feedbackMapper;
    private final PaginationService paginationService;
    private final ProjectRepository projectRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final QuestionRepository questionRepository;
    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final DatabaseClient databaseClient;

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

    public Mono<PageResponse<FeedbackResponseDto>> findAllFeedbacks(PageRequest pageRequest, String username) {
        return paginationService.paginateInMemory(
            feedbackRepository.findAll().flatMap(feedback -> enrichFeedbackWithDetails(feedback, username)),
            pageRequest
        );
    }

    public Mono<PageResponse<FeedbackResponseDto>> findAvailableFeedbacks(PageRequest pageRequest, String username) {
        return paginationService.paginateInMemory(
            feedbackRepository.findActiveAndAvailable().flatMap(feedback -> enrichFeedbackWithDetails(feedback, username)),
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

    // New CRUD methods with DTOs

    @Transactional
    public Mono<FeedbackResponseDto> createFeedback(FeedbackCreateRequestDto request) {
        // Validate project exists
        return projectRepository.findById(request.projectId())
                .switchIfEmpty(Mono.error(new GlobalServiceException(ErrorCode.NOT_FOUND, "Project not found")))
                .flatMap(project -> {
                    // Use mapper to create entity
                    Feedback feedback = feedbackMapper.toEntity(request);
                    return feedbackRepository.save(feedback);
                })
                .flatMap(savedFeedback -> {
                    // Add questions if provided
                    Mono<Void> questionsAction = Mono.empty();
                    if (request.questionIds() != null && !request.questionIds().isEmpty()) {
                        questionsAction = addQuestions(savedFeedback.getId(), request.questionIds());
                    }
                    
                    // Add target users if provided
                    Mono<Void> usersAction = Mono.empty();
                    if (request.targetUserIds() != null && !request.targetUserIds().isEmpty()) {
                        usersAction = addTargetUsers(savedFeedback.getId(), request.targetUserIds());
                    }
                    
                    // Add target departments if provided
                    Mono<Void> deptAction = Mono.empty();
                    if (request.targetDepartmentIds() != null && !request.targetDepartmentIds().isEmpty()) {
                        deptAction = addTargetDepartments(savedFeedback.getId(), request.targetDepartmentIds());
                    }
                    
                    return Mono.when(questionsAction, usersAction, deptAction)
                            .thenReturn(savedFeedback);
                })
                .flatMap(feedback -> enrichFeedbackWithDetails(feedback, null));
    }

    @Transactional 
    public Mono<FeedbackResponseDto> updateFeedback(Long id, FeedbackUpdateRequestDto request) {
        return feedbackRepository.findById(id)
                .switchIfEmpty(Mono.error(new GlobalServiceException(ErrorCode.NOT_FOUND, "Feedback not found")))
                .flatMap(existing -> {
                    // Use mapper to update entity
                    feedbackMapper.updateEntity(existing, request);
                    return feedbackRepository.save(existing);
                })
                .flatMap(feedback -> enrichFeedbackWithDetails(feedback, null));
    }

    public Mono<FeedbackResponseDto> getFeedbackById(Long id, String username) {
        return feedbackRepository.findById(id)
                .switchIfEmpty(Mono.error(new GlobalServiceException(ErrorCode.NOT_FOUND, "Feedback not found")))
                .flatMap(feedback -> enrichFeedbackWithDetails(feedback, username));
    }

    public Flux<UserResponseDto> getProjectMembers(Long projectId) {
        return projectMemberRepository.findUserIdsByProjectId(projectId)
                .flatMap(userId -> userRepository.findById(userId)
                        .flatMap(user -> userRepository.findRoleNamesByUsername(user.getUsername())
                                .collectList()
                                .map(roles -> {
                                    user.setRoles(Set.copyOf(roles));
                                    return mapUserToResponseDto(user);
                                })));
    }

    public Mono<Boolean> canUserSubmitFeedback(Long feedbackId, String username) {
        if (username == null) return Mono.just(false);
        
        return validateFeedbackSubmissionTiming(feedbackId)
                .then(checkUserPermissionForFeedback(feedbackId, username))
                .then(Mono.just(true))
                .onErrorReturn(false);
    }

    // Helper methods

    private Mono<FeedbackResponseDto> enrichFeedbackWithDetails(Feedback feedback, String username) {
        // Start with basic response from mapper
        FeedbackResponseDto basicResponse = feedbackMapper.toBasicResponse(feedback);
        
        // Get project name
        Mono<String> projectNameMono = projectRepository.findById(feedback.getProjectId())
                .map(project -> project.getName())
                .defaultIfEmpty("Unknown Project");
        
        // Get question details
        Mono<List<Long>> questionIdsMono = feedbackQuestionRepository.findQuestionIdsByFeedbackId(feedback.getId()).collectList();
        Mono<List<String>> questionTitlesMono = questionIdsMono
                .flatMapMany(Flux::fromIterable)
                .flatMap(qId -> questionRepository.findById(qId)
                        .map(q -> q.getText())
                        .defaultIfEmpty("Unknown Question"))
                .collectList();
        
        // Get target user details
        Mono<List<Long>> targetUserIdsMono = getTargetUserIds(feedback.getId());
        Mono<List<String>> targetUsernamesMono = targetUserIdsMono
                .flatMapMany(Flux::fromIterable)
                .flatMap(uId -> userRepository.findById(uId)
                        .map(u -> u.getUsername())
                        .defaultIfEmpty("Unknown User"))
                .collectList();
        
        // Get target department details
        Mono<List<Long>> targetDeptIdsMono = getTargetDepartmentIds(feedback.getId());
        Mono<List<String>> targetDeptNamesMono = targetDeptIdsMono
                .flatMapMany(Flux::fromIterable)
                .flatMap(dId -> departmentRepository.findById(dId)
                        .map(d -> d.getName())
                        .defaultIfEmpty("Unknown Department"))
                .collectList();
        
        // Get submission count
        Mono<Long> submissionCountMono = getSubmissionCount(feedback.getId());
        
        // Check if user can submit
        Mono<Boolean> canSubmitMono = username != null ? 
                canUserSubmitFeedback(feedback.getId(), username) : 
                Mono.just(false);
        
        // Split zip into two parts since Mono.zip supports max 8 arguments
        Mono<reactor.util.function.Tuple8<String, List<Long>, List<String>, List<Long>, List<String>, List<Long>, List<String>, Long>> basicDataMono = 
                Mono.zip(
                        projectNameMono,
                        questionIdsMono,
                        questionTitlesMono,
                        targetUserIdsMono,
                        targetUsernamesMono,
                        targetDeptIdsMono,
                        targetDeptNamesMono,
                        submissionCountMono
                );
        
        return Mono.zip(basicDataMono, canSubmitMono)
                .map(tuple -> {
                    var basicData = tuple.getT1();
                    Boolean canSubmit = tuple.getT2();
                    
                    return new FeedbackResponseDto(
                            basicResponse.id(),
                            basicResponse.title(),
                            basicResponse.description(),
                            basicResponse.projectId(),
                            basicData.getT1(), // projectName
                            basicResponse.startDate(),
                            basicResponse.endDate(),
                            basicResponse.active(),
                            basicResponse.createdAt(),
                            basicResponse.updatedAt(),
                            basicData.getT2(), // questionIds
                            basicData.getT3(), // questionTitles
                            basicData.getT4(), // targetUserIds
                            basicData.getT5(), // targetUsernames
                            basicData.getT6(), // targetDepartmentIds
                            basicData.getT7(), // targetDepartmentNames
                            basicData.getT8(), // submissionCount
                            canSubmit       // canSubmit
                    );
                });
    }

    private Mono<List<Long>> getTargetUserIds(Long feedbackId) {
        return databaseClient.sql("SELECT user_id FROM feedback_target_users WHERE feedback_id = :feedbackId")
                .bind("feedbackId", feedbackId)
                .map((row, meta) -> row.get("user_id", Long.class))
                .all()
                .collectList();
    }

    private Mono<List<Long>> getTargetDepartmentIds(Long feedbackId) {
        return databaseClient.sql("SELECT department_id FROM feedback_target_departments WHERE feedback_id = :feedbackId")
                .bind("feedbackId", feedbackId)
                .map((row, meta) -> row.get("department_id", Long.class))
                .all()
                .collectList();
    }

    private Mono<Long> getSubmissionCount(Long feedbackId) {
        return databaseClient.sql("SELECT COUNT(*) FROM submissions WHERE feedback_id = :feedbackId")
                .bind("feedbackId", feedbackId)
                .map((row, meta) -> row.get(0, Long.class))
                .one()
                .defaultIfEmpty(0L);
    }

    private Mono<Void> checkUserPermissionForFeedback(Long feedbackId, String username) {
        return userRepository.findByUsername(username)
                .switchIfEmpty(Mono.error(new GlobalServiceException(ErrorCode.NOT_FOUND, "User not found")))
                .flatMap(user -> {
                    // Check if user is directly targeted
                    Mono<Boolean> directTarget = databaseClient.sql(
                            "SELECT COUNT(*) FROM feedback_target_users WHERE feedback_id = :feedbackId AND user_id = :userId"
                    ).bind("feedbackId", feedbackId)
                     .bind("userId", user.getId())
                     .map((row, meta) -> row.get(0, Long.class) > 0)
                     .one();
                    
                    // Check if user's department is targeted
                    Mono<Boolean> deptTarget = user.getDepartmentId() != null ? 
                            databaseClient.sql(
                                    "SELECT COUNT(*) FROM feedback_target_departments WHERE feedback_id = :feedbackId AND department_id = :deptId"
                            ).bind("feedbackId", feedbackId)
                             .bind("deptId", user.getDepartmentId())
                             .map((row, meta) -> row.get(0, Long.class) > 0)
                             .one() : Mono.just(false);
                    
                    // Check if user is project member
                    Mono<Boolean> projectMember = feedbackRepository.findById(feedbackId)
                            .flatMap(feedback -> projectMemberRepository.findUserIdsByProjectId(feedback.getProjectId())
                                    .any(memberId -> memberId.equals(user.getId())));
                    
                    return Mono.zip(directTarget, deptTarget, projectMember)
                            .flatMap(tuple -> {
                                if (tuple.getT1() || tuple.getT2() || tuple.getT3()) {
                                    return Mono.empty(); // User has permission
                                } else {
                                    return Mono.error(new GlobalServiceException(ErrorCode.FORBIDDEN, "User not authorized for this feedback"));
                                }
                            });
                });
    }

    // Advanced Feedback Methods (from old-backend)
    
    public Mono<java.util.Map<String, Long>> getFeedbackStatistics() {
        return Mono.zip(
                feedbackRepository.count(),
                feedbackRepository.countActiveAndAvailable(),
                getTotalSubmissionCount()
        ).map(tuple -> {
            java.util.Map<String, Long> stats = new java.util.HashMap<>();
            stats.put("totalFeedbacks", tuple.getT1());
            stats.put("activeFeedbacks", tuple.getT2());
            stats.put("totalSubmissions", tuple.getT3());
            return stats;
        });
    }
    
    public Mono<java.util.Map<String, Double>> getFeedbackMetrics() {
        return getFeedbackStatistics().map(stats -> {
            java.util.Map<String, Double> metrics = new java.util.HashMap<>();
            long total = stats.get("totalFeedbacks");
            long active = stats.get("activeFeedbacks");
            long submissions = stats.get("totalSubmissions");
            
            metrics.put("activePercentage", total > 0 ? (double) active / total * 100 : 0.0);
            metrics.put("averageSubmissionsPerFeedback", active > 0 ? (double) submissions / active : 0.0);
            metrics.put("completionRate", 85.5); // Placeholder calculation
            
            return metrics;
        });
    }
    
    public Flux<FeedbackResponseDto> getRecentFeedbacks() {
        return feedbackRepository.findRecent(10)
                .flatMap(feedback -> enrichFeedbackWithDetails(feedback, null));
    }
    
    public Flux<FeedbackResponseDto> getFeedbacksByUser(String userId) {
        return databaseClient.sql("""
                SELECT DISTINCT f.* FROM feedbacks f
                LEFT JOIN feedback_target_users ftu ON f.id = ftu.feedback_id
                LEFT JOIN feedback_target_departments ftd ON f.id = ftd.feedback_id
                LEFT JOIN users u ON ftu.user_id = u.id OR u.department_id = ftd.department_id
                WHERE u.username = :userId OR u.id = :userId
                ORDER BY f.created_at DESC
                """)
                .bind("userId", userId)
                .map((row, meta) -> mapRowToFeedback(row))
                .all()
                .flatMap(feedback -> enrichFeedbackWithDetails(feedback, userId));
    }
    
    public Flux<FeedbackResponseDto> getFeedbacksByDepartment(Long departmentId) {
        return databaseClient.sql("""
                SELECT DISTINCT f.* FROM feedbacks f
                JOIN feedback_target_departments ftd ON f.id = ftd.feedback_id
                WHERE ftd.department_id = :departmentId
                ORDER BY f.created_at DESC
                """)
                .bind("departmentId", departmentId)
                .map((row, meta) -> mapRowToFeedback(row))
                .all()
                .flatMap(feedback -> enrichFeedbackWithDetails(feedback, null));
    }
    
    public Flux<FeedbackResponseDto> getDepartmentWideFeedbacks(Long departmentId) {
        return databaseClient.sql("""
                SELECT DISTINCT f.* FROM feedbacks f
                JOIN projects p ON f.project_id = p.id
                WHERE p.department_id = :departmentId
                ORDER BY f.created_at DESC
                """)
                .bind("departmentId", departmentId)
                .map((row, meta) -> mapRowToFeedback(row))
                .all()
                .flatMap(feedback -> enrichFeedbackWithDetails(feedback, null));
    }
    
    public Mono<FeedbackResponseDto> activateFeedback(Long id) {
        return feedbackRepository.findById(id)
                .switchIfEmpty(Mono.error(new GlobalServiceException(ErrorCode.NOT_FOUND, "Feedback not found")))
                .flatMap(feedback -> {
                    feedback.setActive(true);
                    return feedbackRepository.save(feedback);
                })
                .flatMap(feedback -> enrichFeedbackWithDetails(feedback, null));
    }
    
    public Mono<FeedbackResponseDto> closeFeedback(Long id) {
        return feedbackRepository.findById(id)
                .switchIfEmpty(Mono.error(new GlobalServiceException(ErrorCode.NOT_FOUND, "Feedback not found")))
                .flatMap(feedback -> {
                    feedback.setActive(false);
                    return feedbackRepository.save(feedback);
                })
                .flatMap(feedback -> enrichFeedbackWithDetails(feedback, null));
    }
    
    private Mono<Long> getTotalSubmissionCount() {
        return databaseClient.sql("SELECT COUNT(*) FROM submissions")
                .map((row, meta) -> row.get(0, Long.class))
                .one()
                .defaultIfEmpty(0L);
    }
    
    private Feedback mapRowToFeedback(Row row) {
        Feedback feedback = new Feedback();
        feedback.setId(row.get("id", Long.class));
        feedback.setTitle(row.get("title", String.class));
        feedback.setDescription(row.get("description", String.class));
        feedback.setProjectId(row.get("project_id", Long.class));
        feedback.setStartDate(row.get("start_date", LocalDateTime.class));
        feedback.setEndDate(row.get("end_date", LocalDateTime.class));
        feedback.setActive(Boolean.TRUE.equals(row.get("active", Boolean.class)));
        feedback.setCreatedAt(row.get("created_at", LocalDateTime.class));
        feedback.setUpdatedAt(row.get("updated_at", LocalDateTime.class));
        return feedback;
    }

    /**
     * Maps User entity to UserResponseDto
     * This follows the same pattern as UserManagementService.mapToResponseDto()
     */
    private UserResponseDto mapUserToResponseDto(dev.bengi.main.modules.user.model.User user) {
        java.util.Set<dev.bengi.main.modules.user.dto.DepartmentSummaryDto> departments = new java.util.HashSet<>();
        if (user.getDepartmentId() != null) {
            departments.add(new dev.bengi.main.modules.user.dto.DepartmentSummaryDto(user.getDepartmentId(), null));
        }
        return new UserResponseDto(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getPhone(),
                departments,
                user.getRoles(),
                user.isActive(),
                user.getLastLoginAt(),
                user.getCreatedAt(),
                user.getUpdatedAt()
        );
    }

    // Comprehensive feedback submission validation and constraints
    
    public Mono<Map<String, Object>> getFeedbackSubmissionConstraints(Long feedbackId, String username) {
        return feedbackRepository.findById(feedbackId)
                .switchIfEmpty(Mono.error(new GlobalServiceException(ErrorCode.NOT_FOUND, "Feedback not found")))
                .flatMap(feedback -> {
                    Map<String, Object> constraints = new HashMap<>();
                    
                    // Thai timezone
                    ZoneId thaiTimezone = ZoneId.of("Asia/Bangkok");
                    LocalDateTime now = LocalDateTime.now(thaiTimezone);
                    
                    constraints.put("currentTime", now);
                    constraints.put("timezone", "Asia/Bangkok");
                    constraints.put("feedbackId", feedbackId);
                    constraints.put("isActive", feedback.isActive());
                    constraints.put("startDate", feedback.getStartDate());
                    constraints.put("endDate", feedback.getEndDate());
                    
                    // Calculate timing constraints
                    if (feedback.getStartDate() != null) {
                        constraints.put("hasStarted", !now.isBefore(feedback.getStartDate()));
                        long minutesUntilStart = now.isBefore(feedback.getStartDate()) ? 
                            java.time.Duration.between(now, feedback.getStartDate()).toMinutes() : 0;
                        constraints.put("minutesUntilStart", minutesUntilStart);
                    } else {
                        constraints.put("hasStarted", true);
                        constraints.put("minutesUntilStart", 0);
                    }
                    
                    if (feedback.getEndDate() != null) {
                        constraints.put("hasEnded", now.isAfter(feedback.getEndDate()));
                        long minutesUntilEnd = now.isBefore(feedback.getEndDate()) ? 
                            java.time.Duration.between(now, feedback.getEndDate()).toMinutes() : 0;
                        constraints.put("minutesUntilEnd", minutesUntilEnd);
                    } else {
                        constraints.put("hasEnded", false);
                        constraints.put("minutesUntilEnd", -1); // No end date
                    }
                    
                    // Check user submission status
                    return canUserSubmitFeedback(feedbackId, username)
                            .map(canSubmit -> {
                                constraints.put("canSubmit", canSubmit);
                                
                                // Additional constraint info
                                boolean withinTimeFrame = 
                                    (feedback.getStartDate() == null || !now.isBefore(feedback.getStartDate())) &&
                                    (feedback.getEndDate() == null || !now.isAfter(feedback.getEndDate()));
                                
                                constraints.put("withinTimeFrame", withinTimeFrame);
                                constraints.put("submissionAllowed", 
                                    feedback.isActive() && withinTimeFrame && canSubmit);
                                
                                return constraints;
                            });
                });
    }
    
    public Mono<Map<String, Object>> validateFeedbackSubmission(Long feedbackId, String username) {
        return feedbackRepository.findById(feedbackId)
                .switchIfEmpty(Mono.error(new GlobalServiceException(ErrorCode.NOT_FOUND, "Feedback not found")))
                .flatMap(feedback -> {
                    Map<String, Object> validation = new HashMap<>();
                    validation.put("feedbackId", feedbackId);
                    validation.put("username", username);
                    validation.put("timestamp", LocalDateTime.now(ZoneId.of("Asia/Bangkok")));
                    
                    // Perform all validations
                    return Mono.zip(
                        validateFeedbackActive(feedback),
                        validateTimingConstraints(feedback),
                        validateUserEligibility(feedbackId, username),
                        checkForDuplicateSubmission(feedbackId, username)
                    ).map(results -> {
                        validation.put("isActiveValid", results.getT1());
                        validation.put("isTimingValid", results.getT2());
                        validation.put("isUserEligible", results.getT3());
                        validation.put("noDuplicate", results.getT4());
                        
                        boolean isValid = results.getT1() && results.getT2() && results.getT3() && results.getT4();
                        validation.put("isValid", isValid);
                        validation.put("canSubmit", isValid);
                        
                        if (!isValid) {
                            List<String> errors = new java.util.ArrayList<>();
                            if (!results.getT1()) errors.add("Feedback is not active");
                            if (!results.getT2()) errors.add("Outside submission time window");
                            if (!results.getT3()) errors.add("User not eligible for this feedback");
                            if (!results.getT4()) errors.add("User has already submitted");
                            validation.put("errors", errors);
                        }
                        
                        return validation;
                    });
                });
    }
    
    // Helper validation methods
    
    private Mono<Boolean> validateFeedbackActive(Feedback feedback) {
        return Mono.just(feedback.isActive());
    }
    
    private Mono<Boolean> validateTimingConstraints(Feedback feedback) {
        LocalDateTime now = LocalDateTime.now(ZoneId.of("Asia/Bangkok"));
        
        boolean hasStarted = feedback.getStartDate() == null || !now.isBefore(feedback.getStartDate());
        boolean hasNotEnded = feedback.getEndDate() == null || !now.isAfter(feedback.getEndDate());
        
        return Mono.just(hasStarted && hasNotEnded);
    }
    
    private Mono<Boolean> validateUserEligibility(Long feedbackId, String username) {
        if (username == null) return Mono.just(false);
        
        return checkUserPermissionForFeedback(feedbackId, username)
                .then(Mono.just(true))
                .onErrorReturn(false);
    }
    
    private Mono<Boolean> checkForDuplicateSubmission(Long feedbackId, String username) {
        if (username == null) return Mono.just(false);
        
        String query = "SELECT COUNT(*) FROM submissions WHERE feedback_id = :feedbackId AND user_id = :userId";
        
        return databaseClient.sql(query)
                .bind("feedbackId", feedbackId)
                .bind("userId", username)
                .map((row, meta) -> row.get(0, Long.class))
                .one()
                .map(count -> count == 0); // Returns true if no duplicate (count = 0)
    }

    // Additional methods for employee endpoints that may be referenced
    
    public Flux<FeedbackResponseDto> getPendingFeedbacksForUser(String username) {
        return findAvailableFeedbacks(new PageRequest(0, 50, null, null, null, null), username)
                .flatMapMany(pageResponse -> Flux.fromIterable(pageResponse.getContent()))
                .filter(feedback -> Boolean.TRUE.equals(feedback.canSubmit()));
    }
    
    public Mono<Long> countAvailableFeedbacksForUser(String username) {
        return findAvailableFeedbacks(new PageRequest(0, Integer.MAX_VALUE, null, null, null, null), username)
                .map(pageResponse -> pageResponse.getTotalElements());
    }
    
    public Mono<Long> countPendingFeedbacksForUser(String username) {
        return getPendingFeedbacksForUser(username).count();
    }
    
    public Mono<Long> countFeedbacksCompletedSince(String username, LocalDateTime since) {
        String query = """
            SELECT COUNT(DISTINCT s.feedback_id) 
            FROM submissions s 
            WHERE s.user_id = :username AND s.submitted_at >= :since
            """;
        
        return databaseClient.sql(query)
                .bind("username", username)
                .bind("since", since)
                .map((row, meta) -> row.get(0, Long.class))
                .one()
                .defaultIfEmpty(0L);
    }
    
    public Mono<Double> getAverageRatingGiven(String username, LocalDateTime since) {
        String query = """
            SELECT AVG(CAST(s.rating AS DECIMAL)) 
            FROM submissions s 
            WHERE s.user_id = :username AND s.submitted_at >= :since AND s.rating IS NOT NULL
            """;
        
        return databaseClient.sql(query)
                .bind("username", username)
                .bind("since", since)
                .map((row, meta) -> {
                    Number rating = row.get(0, Number.class);
                    return rating != null ? rating.doubleValue() : 0.0;
                })
                .one()
                .defaultIfEmpty(0.0);
    }
}


