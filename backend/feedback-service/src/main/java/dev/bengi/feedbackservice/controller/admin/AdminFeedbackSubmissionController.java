package dev.bengi.feedbackservice.controller.admin;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import dev.bengi.feedbackservice.domain.payload.response.FeedbackSubmissionResponse;
import dev.bengi.feedbackservice.service.FeedbackSubmissionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;

@Slf4j
@RestController
@RequestMapping({"/api/v1/admin/submissions", "/api/admin/submissions"})
@RequiredArgsConstructor
public class AdminFeedbackSubmissionController {
    private final FeedbackSubmissionService submissionService;

    @GetMapping("/all")
    public Mono<ResponseEntity<List<FeedbackSubmissionResponse>>> getAllSubmissions() {
        log.debug("Admin requesting all feedback submissions");
        return submissionService.getAllSubmissions()
                .collectList()
                .map(ResponseEntity::ok);
    }

    @GetMapping("/statistics")
    public Mono<ResponseEntity<Map<String, Long>>> getSubmissionStatistics() {
        log.debug("Admin requesting submission statistics");
        return submissionService.getSubmissionStatistics()
                .map(ResponseEntity::ok);
    }

    @GetMapping("/pending")
    public Mono<ResponseEntity<List<FeedbackSubmissionResponse>>> getPendingSubmissions() {
        log.debug("Admin requesting pending review submissions");
        return submissionService.getPendingReviewSubmissions()
                .collectList()
                .map(ResponseEntity::ok);
    }

    @GetMapping("/user/{userId}")
    public Mono<ResponseEntity<List<FeedbackSubmissionResponse>>> getUserSubmissions(
            @PathVariable String userId) {
        log.debug("Admin requesting submissions for user: {}", userId);
        return submissionService.getSubmissionsByUser(userId)
                .collectList()
                .map(ResponseEntity::ok);
    }

    @GetMapping("/feedback/{feedbackId}")
    public Mono<ResponseEntity<List<FeedbackSubmissionResponse>>> getFeedbackSubmissions(
            @PathVariable Long feedbackId) {
        log.debug("Admin requesting submissions for feedback: {}", feedbackId);
        return submissionService.getSubmissionsByFeedback(feedbackId)
                .collectList()
                .map(ResponseEntity::ok);
    }
} 