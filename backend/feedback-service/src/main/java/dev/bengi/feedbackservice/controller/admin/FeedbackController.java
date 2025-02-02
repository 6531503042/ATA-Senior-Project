package dev.bengi.feedbackservice.controller.admin;

import dev.bengi.feedbackservice.domain.payload.request.CreateFeedbackRequest;
import dev.bengi.feedbackservice.domain.payload.response.FeedbackResponse;
import dev.bengi.feedbackservice.service.FeedbackService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/feedbacks")
@RequiredArgsConstructor
@Slf4j
@PreAuthorize("hasRole('ADMIN')")
public class FeedbackController {

    private final FeedbackService feedbackService;

    @PostMapping
    public ResponseEntity<FeedbackResponse> createFeedback(@Valid @RequestBody CreateFeedbackRequest request) {
        log.info("Creating new feedback with name: {}", request.getName());
        FeedbackResponse response = feedbackService.createFeedback(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<FeedbackResponse> updateFeedback(
            @PathVariable Long id,
            @Valid @RequestBody CreateFeedbackRequest request) {
        log.info("Updating feedback with ID: {}", id);
        FeedbackResponse response = feedbackService.updateFeedback(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFeedback(@PathVariable Long id) {
        log.info("Deleting feedback with ID: {}", id);
        feedbackService.deleteFeedback(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<FeedbackResponse> getFeedbackById(@PathVariable Long id) {
        log.info("Fetching feedback with ID: {}", id);
        FeedbackResponse response = feedbackService.getFeedbackById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<FeedbackResponse>> getAllFeedbacks() {
        log.info("Fetching all feedbacks");
        List<FeedbackResponse> responses = feedbackService.getAllFeedbacks();
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<FeedbackResponse>> getFeedbacksByProjectId(@PathVariable Long projectId) {
        log.info("Fetching feedbacks for project ID: {}", projectId);
        List<FeedbackResponse> responses = feedbackService.getFeedbacksByProjectId(projectId);
        return ResponseEntity.ok(responses);
    }

    @PostMapping("/{id}/questions")
    public ResponseEntity<FeedbackResponse> addQuestionsToFeedback(
            @PathVariable Long id,
            @RequestBody List<Long> questionIds) {
        log.info("Adding questions to feedback ID: {}", id);
        FeedbackResponse response = feedbackService.addQuestionsToFeedback(id, questionIds);
        return ResponseEntity.ok(response);
    }
}