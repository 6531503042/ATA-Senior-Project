package dev.bengi.feedbackservice.controller;

import dev.bengi.feedbackservice.domain.model.Feedback;
import dev.bengi.feedbackservice.domain.payload.request.FeedbackSubmissionRequest;
import dev.bengi.feedbackservice.domain.payload.response.FeedbackDetailsResponse;
import dev.bengi.feedbackservice.domain.payload.response.FeedbackSubmissionResponse;
import dev.bengi.feedbackservice.service.FeedbackPermissionService;
import dev.bengi.feedbackservice.service.FeedbackService;
import dev.bengi.feedbackservice.service.FeedbackSubmissionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Base64;
import java.nio.charset.StandardCharsets;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;

@Slf4j
@RestController
@RequestMapping("/api/v1/feedback-submissions")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class FeedbackSubmissionController {
    private final FeedbackSubmissionService submissionService;
    private final FeedbackPermissionService permissionService;
    private final FeedbackService feedbackService;

    @GetMapping("/available")
    public ResponseEntity<List<FeedbackDetailsResponse>> getAvailableFeedbacks() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null) {
                log.error("No authentication found");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            Map<String, Object> details = (Map<String, Object>) auth.getDetails();
            if (details == null || !details.containsKey("userId")) {
                log.error("No user details found in authentication");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            Long userId = (Long) details.get("userId");
            String username = auth.getName();
            
            log.debug("Getting available feedbacks for user ID: {} ({})", userId, username);
            
            if (userId == null) {
                log.error("Could not extract user ID from authentication");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            List<FeedbackDetailsResponse> feedbacks = feedbackService.getAvailableFeedbacksForUser(userId.toString());
            log.debug("Found {} available feedbacks for user {}", feedbacks.size(), userId);
            return ResponseEntity.ok(feedbacks);
        } catch (Exception e) {
            log.error("Error getting available feedbacks: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/feedback/{feedbackId}/details")
    public ResponseEntity<FeedbackDetailsResponse> getFeedbackDetails(@PathVariable Long feedbackId) {
        String userId = getCurrentUserId();
        log.debug("Getting feedback details for feedback {} by user {}", feedbackId, userId);
        
        try {
            if (!permissionService.hasPermissionToSubmitFeedback(userId, feedbackId)) {
                log.warn("User {} does not have permission to view feedback {}", userId, feedbackId);
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            FeedbackDetailsResponse details = feedbackService.getFeedbackDetails(feedbackId);
            log.debug("Successfully retrieved details for feedback {}", feedbackId);
            return ResponseEntity.ok(details);
        } catch (IllegalArgumentException e) {
            log.error("Feedback {} not found", feedbackId);
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Error getting feedback details for feedback {}: {}", feedbackId, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/feedback/{feedbackId}/validate")
    public ResponseEntity<Map<String, Object>> validateFeedbackSubmission(
            @PathVariable Long feedbackId,
            @RequestBody Map<Long, String> responses) {
        String userId = getCurrentUserId();
        log.debug("Validating feedback submission for feedback {} by user {}", feedbackId, userId);
        
        try {
            if (!permissionService.hasPermissionToSubmitFeedback(userId, feedbackId)) {
                log.warn("User {} does not have permission to submit feedback {}", userId, feedbackId);
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            Map<String, Object> validationResult = submissionService.validateFeedbackSubmission(feedbackId, responses);
            log.debug("Validation result for feedback {}: {}", feedbackId, validationResult);
            return ResponseEntity.ok(validationResult);
        } catch (Exception e) {
            log.error("Error validating feedback submission for feedback {}: {}", feedbackId, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/submit")
    public ResponseEntity<FeedbackSubmissionResponse> submitFeedback(
            @Valid @RequestBody FeedbackSubmissionRequest request) {
        String userId = getCurrentUserId();
        log.debug("Submitting feedback {} by user {}", request.getFeedbackId(), userId);
        
        try {
            if (!permissionService.hasPermissionToSubmitFeedback(userId, request.getFeedbackId())) {
                log.warn("User {} does not have permission to submit feedback {}", userId, request.getFeedbackId());
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            Map<String, Object> validationResult = submissionService.validateFeedbackSubmission(
                request.getFeedbackId(), request.getResponses());
            
            if (!(boolean) validationResult.get("isValid")) {
                log.warn("Invalid feedback submission for feedback {}: {}", 
                    request.getFeedbackId(), validationResult.get("message"));
                return ResponseEntity.badRequest().build();
            }

            request.setUserId(userId);
            FeedbackSubmissionResponse response = submissionService.submitFeedback(request);
            log.info("Successfully submitted feedback {} by user {}", request.getFeedbackId(), userId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error submitting feedback {}: {}", request.getFeedbackId(), e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/my-submissions")
    public ResponseEntity<List<FeedbackSubmissionResponse>> getMySubmissions() {
        String userId = getCurrentUserId();
        log.debug("Getting submissions for user {}", userId);
        
        try {
            List<FeedbackSubmissionResponse> submissions = submissionService.getSubmissionsByUser(userId);
            log.debug("Found {} submissions for user {}", submissions.size(), userId);
            return ResponseEntity.ok(submissions);
        } catch (Exception e) {
            log.error("Error getting submissions for user {}: {}", userId, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/feedback/{feedbackId}")
    public ResponseEntity<List<FeedbackSubmissionResponse>> getSubmissionsByFeedback(
            @PathVariable Long feedbackId) {
        String userId = getCurrentUserId();
        log.debug("Getting submissions for feedback {} by user {}", feedbackId, userId);
        
        try {
            if (!permissionService.hasPermissionToViewFeedbackSubmissions(userId, feedbackId)) {
                log.warn("User {} does not have permission to view submissions for feedback {}", userId, feedbackId);
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            List<FeedbackSubmissionResponse> submissions = submissionService.getSubmissionsByFeedback(feedbackId);
            log.debug("Found {} submissions for feedback {}", submissions.size(), feedbackId);
            return ResponseEntity.ok(submissions);
        } catch (Exception e) {
            log.error("Error getting submissions for feedback {}: {}", feedbackId, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{submissionId}")
    public ResponseEntity<FeedbackSubmissionResponse> getSubmission(
            @PathVariable Long submissionId) {
        String userId = getCurrentUserId();
        log.debug("Getting submission {} by user {}", submissionId, userId);
        
        try {
            FeedbackSubmissionResponse submission = submissionService.getSubmission(submissionId);
            
            if (!userId.equals(submission.getSubmittedBy()) && 
                !permissionService.hasPermissionToViewFeedbackSubmissions(userId, submission.getFeedbackId())) {
                log.warn("User {} does not have permission to view submission {}", userId, submissionId);
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            log.debug("Successfully retrieved submission {}", submissionId);
            return ResponseEntity.ok(submission);
        } catch (Exception e) {
            log.error("Error getting submission {}: {}", submissionId, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    private String getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getDetails() instanceof Map) {
            Map<String, Object> details = (Map<String, Object>) auth.getDetails();
            if (details.containsKey("userId")) {
                return String.valueOf(details.get("userId"));
            }
        }
        return auth.getName(); // Fallback to username if userId not found
    }
}
