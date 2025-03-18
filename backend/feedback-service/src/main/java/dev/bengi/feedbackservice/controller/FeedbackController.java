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

@Slf4j
@RestController
@RequestMapping("/api/v1/admin/feedbacks")
@RequiredArgsConstructor
public class FeedbackController {
    private final FeedbackService feedbackService;
    private final ProjectService projectService;

    @PostMapping("/create")
    public ResponseEntity<Feedback> createFeedback(@Valid @RequestBody CreateFeedbackRequest request) {
        log.debug("Creating new feedback: {}", request.getTitle());
        
        // Get current authenticated user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String currentUser = auth.getName();
        
        // Fetch the actual project from database
        Project project = projectService.getProject(request.getProjectId());
        
        // Get member IDs from project
        Set<Long> memberIds = project.getMemberIds();
        
        if (memberIds == null || memberIds.isEmpty()) {
            log.error("Project ID: {} has no team members", project.getId());
            throw new RuntimeException("Project ID: " + project.getId() + " has no team members. Please add team members to the project first.");
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
        
        Feedback createdFeedback = feedbackService.createFeedback(feedback);
        log.info("Created new feedback with ID: {}", createdFeedback.getId());
        return ResponseEntity.ok(createdFeedback);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Feedback> updateFeedback(@PathVariable Long id, @Valid @RequestBody CreateFeedbackRequest request) {
        log.debug("Updating feedback with ID: {}", id);
        
        // Get current authenticated user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String currentUser = auth.getName();
        
        // Fetch the existing feedback
        Feedback existingFeedback = feedbackService.getFeedback(id);
        
        // Fetch the actual project from database
        Project project = projectService.getProject(request.getProjectId());
        
        // Update the feedback with new values
        existingFeedback.setTitle(request.getTitle());
        existingFeedback.setDescription(request.getDescription());
        existingFeedback.setProject(project);
        existingFeedback.setQuestionIds(request.getQuestionIds());
        existingFeedback.setStartDate(request.getStartDate());
        existingFeedback.setEndDate(request.getEndDate());
        
        Feedback updatedFeedback = feedbackService.updateFeedback(id, existingFeedback);
        log.info("Updated feedback with ID: {}", updatedFeedback.getId());
        return ResponseEntity.ok(updatedFeedback);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteFeedback(@PathVariable Long id) {
        log.debug("Deleting feedback with ID: {}", id);
        feedbackService.deleteFeedback(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<Feedback> getFeedback(@PathVariable Long id) {
        log.debug("Fetching feedback with ID: {}", id);
        return ResponseEntity.ok(feedbackService.getFeedback(id));
    }

    @GetMapping("/get-all")
    public ResponseEntity<List<Feedback>> getAllFeedbacks() {
        log.debug("Fetching all feedbacks");
        return ResponseEntity.ok(feedbackService.getAllFeedbacks());
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<Feedback>> getFeedbacksByProject(@PathVariable Long projectId) {
        log.debug("Fetching feedbacks for project ID: {}", projectId);
        return ResponseEntity.ok(feedbackService.getFeedbacksByProject(projectId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Feedback>> getFeedbacksByUser(@PathVariable String userId) {
        log.debug("Fetching feedbacks for user ID: {}", userId);
        return ResponseEntity.ok(feedbackService.getFeedbacksByUser(userId));
    }

    // Dashboard endpoints
    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Long>> getFeedbackStatistics() {
        log.debug("Fetching feedback statistics");
        return ResponseEntity.ok(feedbackService.getFeedbackStatistics());
    }

    @GetMapping("/metrics")
    public ResponseEntity<Map<String, Double>> getFeedbackMetrics() {
        log.debug("Fetching feedback metrics");
        return ResponseEntity.ok(feedbackService.getFeedbackMetrics());
    }

    @GetMapping("/recent")
    public ResponseEntity<List<Feedback>> getRecentFeedbacks() {
        log.debug("Fetching recent feedbacks");
        return ResponseEntity.ok(feedbackService.getRecentFeedbacks());
    }
} 