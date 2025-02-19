package dev.bengi.feedbackservice.controller;

import dev.bengi.feedbackservice.domain.model.Feedback;
import dev.bengi.feedbackservice.domain.payload.request.FeedbackSubmissionRequest;
import dev.bengi.feedbackservice.domain.payload.response.ApiErrorResponse;
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

import java.time.LocalDateTime;
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
@CrossOrigin(origins = "http://localhost:3000", 
             allowedHeaders = {"Authorization", "Content-Type", "X-Requested-With", "Accept", "Origin", 
                             "Access-Control-Request-Method", "Access-Control-Request-Headers"},
             exposedHeaders = {"Authorization", "Refresh-Token"},
             methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, 
                       RequestMethod.DELETE, RequestMethod.OPTIONS, RequestMethod.PATCH},
             allowCredentials = "true",
             maxAge = 3600)
public class FeedbackSubmissionController {
    private final FeedbackSubmissionService submissionService;
    private final FeedbackPermissionService permissionService;
    private final FeedbackService feedbackService;

    @GetMapping("/available")
    public ResponseEntity<?> getAvailableFeedbacks() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiErrorResponse.builder()
                        .timestamp(LocalDateTime.now())
                        .status(HttpStatus.UNAUTHORIZED.value())
                        .error("Authentication Error")
                        .message("No authentication found")
                        .path("/api/v1/feedback-submissions/available")
                        .build());
            }

            Map<String, Object> details = (Map<String, Object>) auth.getDetails();
            if (details == null || !details.containsKey("userId")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiErrorResponse.builder()
                        .timestamp(LocalDateTime.now())
                        .status(HttpStatus.UNAUTHORIZED.value())
                        .error("Authentication Error")
                        .message("No user details found in authentication")
                        .path("/api/v1/feedback-submissions/available")
                        .build());
            }

            Long userId = (Long) details.get("userId");
            String username = auth.getName();
            
            if (userId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiErrorResponse.builder()
                        .timestamp(LocalDateTime.now())
                        .status(HttpStatus.UNAUTHORIZED.value())
                        .error("Authentication Error")
                        .message("Could not extract user ID from authentication")
                        .path("/api/v1/feedback-submissions/available")
                        .build());
            }

            List<FeedbackDetailsResponse> feedbacks = feedbackService.getAvailableFeedbacksForUser(userId.toString());
            return ResponseEntity.ok(feedbacks);
        } catch (Exception e) {
            log.error("Error getting available feedbacks: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiErrorResponse.builder()
                    .timestamp(LocalDateTime.now())
                    .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                    .error("Server Error")
                    .message("Error retrieving available feedbacks")
                    .path("/api/v1/feedback-submissions/available")
                    .details(List.of(e.getMessage()))
                    .build());
        }
    }

    @GetMapping("/feedback/{feedbackId}/details")
    public ResponseEntity<?> getFeedbackDetails(@PathVariable Long feedbackId) {
        String userId = getCurrentUserId();
        log.debug("Getting feedback details for feedback {} by user {}", feedbackId, userId);
        
        try {
            if (!permissionService.hasPermissionToSubmitFeedback(userId, feedbackId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiErrorResponse.builder()
                        .timestamp(LocalDateTime.now())
                        .status(HttpStatus.FORBIDDEN.value())
                        .error("Access Denied")
                        .message("You don't have permission to view this feedback")
                        .path("/api/v1/feedback-submissions/feedback/" + feedbackId + "/details")
                        .build());
            }

            FeedbackDetailsResponse details = feedbackService.getFeedbackDetails(feedbackId);
            return ResponseEntity.ok(details);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiErrorResponse.builder()
                    .timestamp(LocalDateTime.now())
                    .status(HttpStatus.NOT_FOUND.value())
                    .error("Not Found")
                    .message("Feedback not found")
                    .path("/api/v1/feedback-submissions/feedback/" + feedbackId + "/details")
                    .build());
        } catch (Exception e) {
            log.error("Error getting feedback details for feedback {}: {}", feedbackId, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiErrorResponse.builder()
                    .timestamp(LocalDateTime.now())
                    .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                    .error("Server Error")
                    .message("Error retrieving feedback details")
                    .path("/api/v1/feedback-submissions/feedback/" + feedbackId + "/details")
                    .details(List.of(e.getMessage()))
                    .build());
        }
    }

    @GetMapping("/feedback/{feedbackId}/validate")
    public ResponseEntity<?> validateFeedbackSubmission(
            @PathVariable Long feedbackId,
            @RequestBody Map<Long, String> responses) {
        String userId = getCurrentUserId();
        log.debug("Validating feedback submission for feedback {} by user {}", feedbackId, userId);
        
        try {
            if (!permissionService.hasPermissionToSubmitFeedback(userId, feedbackId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiErrorResponse.builder()
                        .timestamp(LocalDateTime.now())
                        .status(HttpStatus.FORBIDDEN.value())
                        .error("Access Denied")
                        .message("You don't have permission to submit this feedback")
                        .path("/api/v1/feedback-submissions/feedback/" + feedbackId + "/validate")
                        .build());
            }

            Map<String, Object> validationResult = submissionService.validateFeedbackSubmission(feedbackId, responses);
            return ResponseEntity.ok(validationResult);
        } catch (Exception e) {
            log.error("Error validating feedback submission for feedback {}: {}", feedbackId, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiErrorResponse.builder()
                    .timestamp(LocalDateTime.now())
                    .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                    .error("Validation Error")
                    .message(e.getMessage())
                    .path("/api/v1/feedback-submissions/feedback/" + feedbackId + "/validate")
                    .build());
        }
    }

    @PostMapping("/submit")
    public ResponseEntity<?> submitFeedback(
            @Valid @RequestBody FeedbackSubmissionRequest request) {
        String userId = getCurrentUserId();
        log.debug("Submitting feedback {} by user {}", request.getFeedbackId(), userId);
        
        try {
            if (!permissionService.hasPermissionToSubmitFeedback(userId, request.getFeedbackId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiErrorResponse.builder()
                        .timestamp(LocalDateTime.now())
                        .status(HttpStatus.FORBIDDEN.value())
                        .error("Access Denied")
                        .message("You don't have permission to submit this feedback")
                        .path("/api/v1/feedback-submissions/submit")
                        .build());
            }

            Map<String, Object> validationResult = submissionService.validateFeedbackSubmission(
                request.getFeedbackId(), request.getResponses());
            
            if (!(boolean) validationResult.get("isValid")) {
                return ResponseEntity.badRequest()
                    .body(ApiErrorResponse.builder()
                        .timestamp(LocalDateTime.now())
                        .status(HttpStatus.BAD_REQUEST.value())
                        .error("Validation Error")
                        .message(validationResult.get("message").toString())
                        .path("/api/v1/feedback-submissions/submit")
                        .details(List.of(validationResult.get("message").toString()))
                        .build());
            }

            request.setUserId(userId);
            FeedbackSubmissionResponse response = submissionService.submitFeedback(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error submitting feedback {}: {}", request.getFeedbackId(), e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiErrorResponse.builder()
                    .timestamp(LocalDateTime.now())
                    .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                    .error("Submission Error")
                    .message(e.getMessage())
                    .path("/api/v1/feedback-submissions/submit")
                    .build());
        }
    }

    @GetMapping("/my-submissions")
    public ResponseEntity<?> getMySubmissions() {
        String userId = getCurrentUserId();
        log.debug("Getting submissions for user {}", userId);
        
        try {
            List<FeedbackSubmissionResponse> submissions = submissionService.getSubmissionsByUser(userId);
            return ResponseEntity.ok(submissions);
        } catch (Exception e) {
            log.error("Error getting submissions for user {}: {}", userId, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiErrorResponse.builder()
                    .timestamp(LocalDateTime.now())
                    .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                    .error("Retrieval Error")
                    .message("Error retrieving your submissions")
                    .path("/api/v1/feedback-submissions/my-submissions")
                    .details(List.of(e.getMessage()))
                    .build());
        }
    }

    @GetMapping("/feedback/{feedbackId}")
    public ResponseEntity<?> getSubmissionsByFeedback(
            @PathVariable Long feedbackId) {
        String userId = getCurrentUserId();
        log.debug("Getting submissions for feedback {} by user {}", feedbackId, userId);
        
        try {
            if (!permissionService.hasPermissionToViewFeedbackSubmissions(userId, feedbackId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiErrorResponse.builder()
                        .timestamp(LocalDateTime.now())
                        .status(HttpStatus.FORBIDDEN.value())
                        .error("Access Denied")
                        .message("You don't have permission to view submissions for this feedback")
                        .path("/api/v1/feedback-submissions/feedback/" + feedbackId)
                        .build());
            }

            List<FeedbackSubmissionResponse> submissions = submissionService.getSubmissionsByFeedback(feedbackId);
            return ResponseEntity.ok(submissions);
        } catch (Exception e) {
            log.error("Error getting submissions for feedback {}: {}", feedbackId, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiErrorResponse.builder()
                    .timestamp(LocalDateTime.now())
                    .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                    .error("Retrieval Error")
                    .message("Error retrieving feedback submissions")
                    .path("/api/v1/feedback-submissions/feedback/" + feedbackId)
                    .details(List.of(e.getMessage()))
                    .build());
        }
    }

    @GetMapping("/{submissionId}")
    public ResponseEntity<?> getSubmission(@PathVariable Long submissionId) {
        String userId = getCurrentUserId();
        log.debug("Getting submission {} by user {}", submissionId, userId);
        
        try {
            FeedbackSubmissionResponse submission = submissionService.getSubmission(submissionId);
            
            if (!userId.equals(submission.getSubmittedBy()) && 
                !permissionService.hasPermissionToViewFeedbackSubmissions(userId, submission.getFeedbackId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiErrorResponse.builder()
                        .timestamp(LocalDateTime.now())
                        .status(HttpStatus.FORBIDDEN.value())
                        .error("Access Denied")
                        .message("You don't have permission to view this submission")
                        .path("/api/v1/feedback-submissions/" + submissionId)
                        .build());
            }

            return ResponseEntity.ok(submission);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiErrorResponse.builder()
                    .timestamp(LocalDateTime.now())
                    .status(HttpStatus.NOT_FOUND.value())
                    .error("Not Found")
                    .message("Submission not found")
                    .path("/api/v1/feedback-submissions/" + submissionId)
                    .build());
        } catch (Exception e) {
            log.error("Error getting submission {}: {}", submissionId, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiErrorResponse.builder()
                    .timestamp(LocalDateTime.now())
                    .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                    .error("Server Error")
                    .message("Error retrieving submission")
                    .path("/api/v1/feedback-submissions/" + submissionId)
                    .details(List.of(e.getMessage()))
                    .build());
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
