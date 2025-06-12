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
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Base64;
import java.nio.charset.StandardCharsets;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;

/**
 * Controller for handling feedback submission operations
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/submissions")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", 
             allowedHeaders = {"Authorization", "Content-Type", "X-Requested-With", "Accept", "Origin", 
                             "Access-Control-Request-Method", "Access-Control-Request-Headers"},
             exposedHeaders = {"Authorization", "Refresh-Token"},
             methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, 
                       RequestMethod.DELETE, RequestMethod.OPTIONS, RequestMethod.PATCH},
             allowCredentials = "true",
             maxAge = 3600)
@SuppressWarnings({"unchecked", "rawtypes"})
public class FeedbackSubmissionController {
    private final FeedbackSubmissionService submissionService;
    private final FeedbackPermissionService permissionService;
    private final FeedbackService feedbackService;

    @GetMapping("/available")
    public Mono<ResponseEntity<Object>> getAvailableFeedbacks() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) {
            ApiErrorResponse errorResponse = ApiErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.UNAUTHORIZED.value())
                .error("Authentication Error")
                .message("User not authenticated")
                .path("/api/v1/submissions/available")
                .build();
            
            return Mono.just(ResponseEntity.status(HttpStatus.UNAUTHORIZED).body((Object)errorResponse));
        }
        
        Map<String, Object> details = (Map<String, Object>) auth.getDetails();
        if (details == null || !details.containsKey("userId")) {
            ApiErrorResponse errorResponse = ApiErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.UNAUTHORIZED.value())
                .error("Authentication Error")
                .message("User details missing")
                .path("/api/v1/submissions/available")
                .build();
            
            return Mono.just(ResponseEntity.status(HttpStatus.UNAUTHORIZED).body((Object)errorResponse));
        }
        
        String userId = String.valueOf(details.get("userId"));
        
        if (userId == null) {
            ApiErrorResponse errorResponse = ApiErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.UNAUTHORIZED.value())
                .error("Authentication Error")
                .message("User ID missing")
                .path("/api/v1/submissions/available")
                .build();
            
            return Mono.just(ResponseEntity.status(HttpStatus.UNAUTHORIZED).body((Object)errorResponse));
        }

        log.debug("Getting available feedbacks for user {}", userId);

        return feedbackService.getAvailableFeedbacksForUser(userId.toString())
            .collectList()
            .map(list -> ResponseEntity.ok().body((Object)list))
            .switchIfEmpty(Mono.just(ResponseEntity.noContent().build()));
    }

    @GetMapping("/feedback/{feedbackId}/details")
    public Mono<ResponseEntity<Object>> getFeedbackDetails(@PathVariable Long feedbackId) {
        String userId = getCurrentUserId();
        log.debug("Getting feedback details for feedback {} by user {}", feedbackId, userId);
        
        if (!permissionService.hasPermissionToSubmitFeedback(userId, feedbackId)) {
            ApiErrorResponse errorResponse = ApiErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.FORBIDDEN.value())
                .error("Access Denied")
                .message("You don't have permission to view this feedback")
                .path("/api/v1/submissions/feedback/" + feedbackId + "/details")
                .build();
            
            return Mono.just(ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorResponse));
        }

        return feedbackService.getFeedbackDetails(feedbackId)
            .map(details -> ResponseEntity.ok().body((Object)details))
            .switchIfEmpty(Mono.just(ResponseEntity.notFound().build()));
    }

    @GetMapping("/feedback/{feedbackId}/validate")
    public Mono<ResponseEntity<Object>> validateFeedbackSubmission(
            @PathVariable Long feedbackId,
            @RequestBody Map<Long, String> responses) {
        String userId = getCurrentUserId();
        log.debug("Validating feedback submission for feedback {} by user {}", feedbackId, userId);
        
        if (!permissionService.hasPermissionToSubmitFeedback(userId, feedbackId)) {
            ApiErrorResponse errorResponse = ApiErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.FORBIDDEN.value())
                .error("Forbidden")
                .message("You don't have permission to submit feedback")
                .path("/api/v1/submissions/feedback/" + feedbackId + "/validate")
                .build();
            
            Map<String, Object> responseBody = Map.of("error", errorResponse);
            return Mono.just(ResponseEntity.status(HttpStatus.FORBIDDEN).body(responseBody));
        }

        return submissionService.validateFeedbackSubmission(feedbackId, responses)
            .map(validationResult -> ResponseEntity.ok(validationResult));
    }

    @PostMapping("/submit")
    public Mono<ResponseEntity<Object>> submitFeedback(
            @Valid @RequestBody FeedbackSubmissionRequest request) {
        String userId = getCurrentUserId();
        log.debug("Submitting feedback {} by user {}", request.getFeedbackId(), userId);
        
        if (!permissionService.hasPermissionToSubmitFeedback(userId, request.getFeedbackId())) {
            ApiErrorResponse errorResponse = ApiErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.FORBIDDEN.value())
                .error("Access Denied")
                .message("You don't have permission to submit feedback")
                .path("/api/v1/submissions/submit")
                .build();
            
            return Mono.just(ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorResponse));
        }

        request.setUserId(userId);
        
        return submissionService.validateFeedbackSubmission(request.getFeedbackId(), request.getResponses())
            .flatMap(validationResult -> {
                if (!(boolean) validationResult.get("isValid")) {
                    ApiErrorResponse errorResponse = ApiErrorResponse.builder()
                        .timestamp(LocalDateTime.now())
                        .status(HttpStatus.BAD_REQUEST.value())
                        .error("Validation Error")
                        .message("Feedback validation failed")
                        .path("/api/v1/submissions/submit")
                        .build();
                    
                    return Mono.just(ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", errorResponse, "validationResult", validationResult)));
                }
                
                return submissionService.submitFeedback(request)
                    .doOnSuccess(response -> log.info("Feedback submission successful with ID: {}", response.getId()))
                    .map(response -> ResponseEntity.status(HttpStatus.CREATED).body(response));
            });
    }

    @GetMapping("/my-submissions")
    public Mono<ResponseEntity<Object>> getMySubmissions() {
        String userId = getCurrentUserId();
        log.debug("Getting submissions for user {}", userId);
        
        return submissionService.getSubmissionsByUser(userId)
            .collectList()
            .map(submissions -> {
                if (submissions.isEmpty()) {
                    return ResponseEntity.noContent().build();
                }
                return ResponseEntity.ok(submissions);
            });
    }

    @GetMapping("/feedback/{feedbackId}")
    public Mono<ResponseEntity<Object>> getSubmissionsByFeedback(
            @PathVariable Long feedbackId) {
        String userId = getCurrentUserId();
        log.debug("Getting submissions for feedback {} by user {}", feedbackId, userId);
        
        if (!permissionService.hasPermissionToViewFeedbackSubmissions(userId, feedbackId)) {
            ApiErrorResponse errorResponse = ApiErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.FORBIDDEN.value())
                .error("Access Denied")
                .message("You don't have permission to view submissions for this feedback")
                .path("/api/v1/submissions/feedback/" + feedbackId)
                .build();
            
            return Mono.just(ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorResponse));
        }

        return submissionService.getSubmissionsByFeedback(feedbackId)
            .collectList()
            .map(submissions -> {
                if (submissions.isEmpty()) {
                    return ResponseEntity.noContent().build();
                }
                return ResponseEntity.ok(submissions);
            });
    }

    @GetMapping("/{submissionId}")
    public Mono<ResponseEntity<Object>> getSubmission(@PathVariable Long submissionId) {
        String userId = getCurrentUserId();
        log.debug("Getting submission {} by user {}", submissionId, userId);
        
        return submissionService.getSubmission(submissionId)
            .<ResponseEntity<Object>>map(submission -> {
                if (!userId.equals(submission.getSubmittedBy()) && 
                    !permissionService.hasPermissionToViewFeedbackSubmissions(userId, submission.getFeedbackId())) {
                    ApiErrorResponse errorResponse = ApiErrorResponse.builder()
                        .timestamp(LocalDateTime.now())
                        .status(HttpStatus.FORBIDDEN.value())
                        .error("Access Denied")
                        .message("You don't have permission to view this submission")
                        .path("/api/v1/submissions/" + submissionId)
                        .build();
                    
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorResponse);
                }
                
                return ResponseEntity.ok(submission);
            })
            .onErrorResume(IllegalArgumentException.class, e -> {
                ApiErrorResponse errorResponse = ApiErrorResponse.builder()
                    .timestamp(LocalDateTime.now())
                    .status(HttpStatus.NOT_FOUND.value())
                    .error("Not Found")
                    .message("Submission not found")
                    .path("/api/v1/submissions/" + submissionId)
                    .build();
                
                return Mono.just(ResponseEntity.status(HttpStatus.NOT_FOUND).body((Object)errorResponse));
            })
            .onErrorResume(e -> {
                log.error("Error getting submission {}: {}", submissionId, e.getMessage());
                ApiErrorResponse errorResponse = ApiErrorResponse.builder()
                    .timestamp(LocalDateTime.now())
                    .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                    .error("Server Error")
                    .message("Error retrieving submission")
                    .path("/api/v1/submissions/" + submissionId)
                    .build();
                
                return Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body((Object)errorResponse));
            });
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
