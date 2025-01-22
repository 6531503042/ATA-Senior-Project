package dev.bengi.feedbackservice.controller.employee;

import dev.bengi.feedbackservice.domain.model.Feedback;
import dev.bengi.feedbackservice.domain.payload.request.CreateFeedbackRequest;
import dev.bengi.feedbackservice.dto.CollectionResponse;
import dev.bengi.feedbackservice.service.FeedbackService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/employee/feedback")
@Slf4j
public class FeedbackController {

    private final FeedbackService feedbackService;

    @PostMapping("/create")
    public ResponseEntity<Feedback> createFeedback(
            @Valid @RequestBody CreateFeedbackRequest request,
            @RequestHeader("X-User-Id") Long userId) {
        log.info("User {} creating feedback", userId);
        request.setUserId(userId);
        Feedback feedbackResponse = feedbackService.createFeedback(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(feedbackResponse);
    }

    @GetMapping("/my-feedbacks")
    public ResponseEntity<CollectionResponse<Feedback>> getMyFeedbacks(
            @RequestHeader("X-User-Id") Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        log.info("User {} retrieving personal feedbacks", userId);
        Page<Feedback> feedbackPage = feedbackService.getFeedbacksByUser(userId, page, size);
        
        CollectionResponse<Feedback> response = CollectionResponse.<Feedback>builder()
            .content(feedbackPage.getContent())
            .page(page)
            .size(size)
            .totalElements(feedbackPage.getTotalElements())
            .totalPages(feedbackPage.getTotalPages())
            .build();
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{feedbackId}")
    public ResponseEntity<Feedback> getFeedbackDetails(
            @PathVariable Long feedbackId,
            @RequestHeader("X-User-Id") Long userId) {
        log.info("User {} retrieving feedback details for {}", userId, feedbackId);
        Feedback feedback = feedbackService.getFeedbackById(feedbackId);
        return ResponseEntity.ok(feedback);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleException(Exception e) {
        log.error("Employee feedback controller error: {}", e.getMessage(), e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body("An error occurred: " + e.getMessage());
    }
}