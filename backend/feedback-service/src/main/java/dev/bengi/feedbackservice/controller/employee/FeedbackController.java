package dev.bengi.feedbackservice.controller.employee;

import dev.bengi.feedbackservice.domain.payload.response.FeedbackResponse;
import dev.bengi.feedbackservice.service.FeedbackService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController("employeeFeedbackController")
@RequiredArgsConstructor
@RequestMapping("api/v1/employee/feedbacks")
@Slf4j
@PreAuthorize("hasRole('USER')")
public class FeedbackController {

    private final FeedbackService feedbackService;

    @GetMapping("/my-feedbacks")
    public ResponseEntity<List<FeedbackResponse>> getMyFeedbacks(
            @RequestHeader("X-User-Id") Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        log.info("User {} retrieving personal feedbacks", userId);
        List<FeedbackResponse> feedbacks = feedbackService.getFeedbacksByUser(userId, page, size);
        return ResponseEntity.ok(feedbacks);
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<FeedbackResponse>> getProjectFeedbacks(
            @PathVariable Long projectId,
            @RequestHeader("X-User-Id") Long userId) {
        log.info("User {} retrieving feedbacks for project {}", userId, projectId);
        List<FeedbackResponse> feedbacks = feedbackService.getFeedbacksByProjectId(projectId);
        return ResponseEntity.ok(feedbacks);
    }

    @GetMapping("/{feedbackId}")
    public ResponseEntity<FeedbackResponse> getFeedbackDetails(
            @PathVariable Long feedbackId,
            @RequestHeader("X-User-Id") Long userId) {
        log.info("User {} retrieving feedback details for {}", userId, feedbackId);
        FeedbackResponse feedback = feedbackService.getFeedbackById(feedbackId);
        return ResponseEntity.ok(feedback);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleException(Exception e) {
        log.error("Employee feedback controller error: {}", e.getMessage(), e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body("An error occurred: " + e.getMessage());
    }
}