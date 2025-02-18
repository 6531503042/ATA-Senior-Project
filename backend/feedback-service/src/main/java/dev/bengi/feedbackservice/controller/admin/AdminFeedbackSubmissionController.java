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

@Slf4j
@RestController
@RequestMapping({"/api/v1/admin/submissions", "/api/admin/submissions"})
@RequiredArgsConstructor
public class AdminFeedbackSubmissionController {
    private final FeedbackSubmissionService submissionService;

    @GetMapping("/all")
    public ResponseEntity<List<FeedbackSubmissionResponse>> getAllSubmissions() {
        log.debug("Admin requesting all feedback submissions");
        return ResponseEntity.ok(submissionService.getAllSubmissions());
    }

    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Long>> getSubmissionStatistics() {
        log.debug("Admin requesting submission statistics");
        return ResponseEntity.ok(submissionService.getSubmissionStatistics());
    }

    @GetMapping("/pending")
    public ResponseEntity<List<FeedbackSubmissionResponse>> getPendingSubmissions() {
        log.debug("Admin requesting pending review submissions");
        return ResponseEntity.ok(submissionService.getPendingReviewSubmissions());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<FeedbackSubmissionResponse>> getUserSubmissions(
            @PathVariable String userId) {
        log.debug("Admin requesting submissions for user: {}", userId);
        return ResponseEntity.ok(submissionService.getSubmissionsByUser(userId));
    }

    @GetMapping("/feedback/{feedbackId}")
    public ResponseEntity<List<FeedbackSubmissionResponse>> getFeedbackSubmissions(
            @PathVariable Long feedbackId) {
        log.debug("Admin requesting submissions for feedback: {}", feedbackId);
        return ResponseEntity.ok(submissionService.getSubmissionsByFeedback(feedbackId));
    }
} 