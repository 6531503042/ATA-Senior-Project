package dev.bengi.feedbackservice.controller;

import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import dev.bengi.feedbackservice.domain.model.Feedback;
import dev.bengi.feedbackservice.domain.model.Project;
import dev.bengi.feedbackservice.domain.payload.request.CreateFeedbackRequest;
import dev.bengi.feedbackservice.service.FeedbackService;
import dev.bengi.feedbackservice.service.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import reactor.core.publisher.Mono;

@Slf4j
@RestController
@RequestMapping("/api/v1/admin/feedbacks")
@RequiredArgsConstructor
public class FeedbackController {
    private final FeedbackService feedbackService;
    private final ProjectService projectService;

    @PostMapping("/create")
    @PreAuthorize("hasRole('ADMIN')")
    public Mono<ResponseEntity<Feedback>> createFeedback(@Valid @RequestBody CreateFeedbackRequest request) {
        log.debug("Creating new feedback: {}", request.getTitle());
        
        // Get current authenticated user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String currentUser = auth.getName();
        
        // Create a Mono chain to execute all operations reactively
        return projectService.getProject(request.getProjectId())
            .flatMap(project -> {
                // Get member IDs from project
                Set<Long> memberIds = project.getMemberIds();
                
                if (memberIds == null || memberIds.isEmpty()) {
                    log.error("Project ID: {} has no team members", project.getId());
                    return Mono.error(new RuntimeException("Project ID: " + project.getId() + " has no team members. Please add team members to the project first."));
                }
                
                Feedback feedback = Feedback.builder()
                        .title(request.getTitle())
                        .description(request.getDescription())
                        .project(project)
                        .questionIds(request.getQuestionIds())
                        .startDate(request.getStartDate())
                        .endDate(request.getEndDate())
                        .createdBy(currentUser)
                        .active(true)
                        .build();
                
                return feedbackService.createFeedback(feedback)
                        .map(createdFeedback -> {
                            log.info("Created new feedback with ID: {}", createdFeedback.getId());
                            return ResponseEntity.ok(createdFeedback);
                        });
            });
    }

    @PutMapping("/update/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Mono<ResponseEntity<Feedback>> updateFeedback(@PathVariable Long id, @Valid @RequestBody CreateFeedbackRequest request) {
        log.debug("Updating feedback with ID: {}", id);
        
        // Get current authenticated user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String currentUser = auth.getName();
        
        // Fetch existing feedback and project in parallel and then combine them
        return feedbackService.getFeedbackById(id)
            .zipWith(projectService.getProject(request.getProjectId()), 
                (existingFeedback, project) -> {
                    // Update the feedback with new values
                    existingFeedback.setTitle(request.getTitle());
                    existingFeedback.setDescription(request.getDescription());
                    existingFeedback.setProject(project);
                    existingFeedback.setQuestionIds(request.getQuestionIds());
                    existingFeedback.setStartDate(request.getStartDate());
                    existingFeedback.setEndDate(request.getEndDate());
                    
                    return existingFeedback;
                })
            .flatMap(feedback -> feedbackService.updateFeedback(id, feedback))
            .map(updatedFeedback -> {
                log.info("Updated feedback with ID: {}", updatedFeedback.getId());
                return ResponseEntity.ok(updatedFeedback);
            });
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Mono<ResponseEntity<Void>> deleteFeedback(@PathVariable Long id) {
        log.debug("Deleting feedback with ID: {}", id);
        return feedbackService.deleteFeedback(id)
            .then(Mono.just(ResponseEntity.ok().<Void>build()));
    }

    @GetMapping("/get/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public Mono<ResponseEntity<Feedback>> getFeedback(@PathVariable Long id) {
        log.debug("Fetching feedback with ID: {}", id);
        return feedbackService.getFeedbackById(id)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @GetMapping("/get-all")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public Mono<ResponseEntity<List<Feedback>>> getAllFeedbacks() {
        log.debug("Fetching all feedbacks");
        return feedbackService.getAllFeedbacks()
                .collectList()
                .map(ResponseEntity::ok);
    }

    @GetMapping("/project/{projectId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public Mono<ResponseEntity<List<Feedback>>> getFeedbacksByProject(@PathVariable Long projectId) {
        log.debug("Fetching feedbacks for project ID: {}", projectId);
        return feedbackService.getFeedbacksByProject(projectId)
                .collectList()
                .map(ResponseEntity::ok);
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public Mono<ResponseEntity<List<Feedback>>> getFeedbacksByUser(@PathVariable String userId) {
        log.debug("Fetching feedbacks for user ID: {}", userId);
        return feedbackService.getFeedbacksByUser(userId)
                .collectList()
                .map(ResponseEntity::ok);
    }

    // Dashboard endpoints
    @GetMapping("/statistics")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public Mono<ResponseEntity<Map<String, Long>>> getFeedbackStatistics() {
        log.debug("Fetching feedback statistics");
        return feedbackService.getFeedbackStatistics()
                .map(ResponseEntity::ok);
    }

    @GetMapping("/metrics")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public Mono<ResponseEntity<Map<String, Double>>> getFeedbackMetrics() {
        log.debug("Fetching feedback metrics");
        return feedbackService.getFeedbackMetrics()
                .map(ResponseEntity::ok);
    }

    @GetMapping("/recent")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public Mono<ResponseEntity<List<Feedback>>> getRecentFeedbacks() {
        log.debug("Fetching recent feedbacks");
        return feedbackService.getRecentFeedbacks()
                .collectList()
                .map(ResponseEntity::ok);
    }

    @GetMapping("/department/{departmentId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public Mono<ResponseEntity<List<Feedback>>> getFeedbacksByDepartment(@PathVariable String departmentId) {
        return feedbackService.getFeedbacksByDepartment(departmentId)
                .collectList()
                .map(ResponseEntity::ok);
    }

    @GetMapping("/department/{departmentId}/wide")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public Mono<ResponseEntity<List<Feedback>>> getDepartmentWideFeedbacks(@PathVariable String departmentId) {
        return feedbackService.getDepartmentWideFeedbacks(departmentId)
                .collectList()
                .map(ResponseEntity::ok);
    }

    @PostMapping("/{id}/activate")
    @PreAuthorize("hasRole('ADMIN')")
    public Mono<ResponseEntity<Feedback>> activateFeedback(@PathVariable Long id) {
        return feedbackService.activateFeedback(id)
                .map(ResponseEntity::ok);
    }

    @PostMapping("/{id}/close")
    @PreAuthorize("hasRole('ADMIN')")
    public Mono<ResponseEntity<Feedback>> closeFeedback(@PathVariable Long id) {
        return feedbackService.closeFeedback(id)
                .map(ResponseEntity::ok);
    }

    @PostMapping("/{feedbackId}/users/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public Mono<ResponseEntity<Feedback>> addTargetUser(
            @PathVariable Long feedbackId,
            @PathVariable String userId) {
        return feedbackService.addTargetUser(feedbackId, userId)
                .map(ResponseEntity::ok);
    }

    @DeleteMapping("/{feedbackId}/users/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public Mono<ResponseEntity<Feedback>> removeTargetUser(
            @PathVariable Long feedbackId,
            @PathVariable String userId) {
        return feedbackService.removeTargetUser(feedbackId, userId)
                .map(ResponseEntity::ok);
    }

    @PostMapping("/{feedbackId}/departments/{departmentId}")
    @PreAuthorize("hasRole('ADMIN')")
    public Mono<ResponseEntity<Feedback>> addTargetDepartment(
            @PathVariable Long feedbackId,
            @PathVariable String departmentId) {
        return feedbackService.addTargetDepartment(feedbackId, departmentId)
                .map(ResponseEntity::ok);
    }

    @DeleteMapping("/{feedbackId}/departments/{departmentId}")
    @PreAuthorize("hasRole('ADMIN')")
    public Mono<ResponseEntity<Feedback>> removeTargetDepartment(
            @PathVariable Long feedbackId,
            @PathVariable String departmentId) {
        return feedbackService.removeTargetDepartment(feedbackId, departmentId)
                .map(ResponseEntity::ok);
    }
} 