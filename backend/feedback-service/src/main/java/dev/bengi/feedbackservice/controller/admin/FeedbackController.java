package dev.bengi.feedbackservice.controller.admin;

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
@RequestMapping("api/v1/admin/feedback")
@Slf4j
public class FeedbackController {

    private final FeedbackService feedbackService;

    @PostMapping("/create")
    public ResponseEntity<Feedback> createFeedback(
            @Valid @RequestBody CreateFeedbackRequest request) {
        log.info("Admin creating feedback: {}", request);
        Feedback feedbackResponse = feedbackService.createFeedback(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(feedbackResponse);
    }

    @GetMapping("/all")
    public ResponseEntity<CollectionResponse<Feedback>> getAllFeedbacks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String status) {
        log.info("Admin retrieving all feedbacks - Page: {}, Size: {}", page, size);
        Page<Feedback> feedbackPage = feedbackService.getAllFeedbacks(page, size);

        CollectionResponse<Feedback> response = CollectionResponse.<Feedback>builder()
                .items(feedbackPage.getContent())
                .page(page)
                .size(size)
                .totalElements(feedbackPage.getTotalElements())
                .totalPages(feedbackPage.getTotalPages())
                .build();

        return ResponseEntity.ok(response);
    }

//    @PutMapping("/{feedbackId}/status")
//    public ResponseEntity<Feedback> updateFeedbackStatus(
//            @PathVariable Long feedbackId,
//            @Valid @RequestBody UpdateFeedbackStatusRequest request) {
//        log.info("Admin updating feedback status: {} to {}", feedbackId, request.getStatus());
//        Feedback updatedFeedback = feedbackService.updateFeedbackStatus(feedbackId, request);
//        return ResponseEntity.ok(updatedFeedback);
//    }

//    @DeleteMapping("/{feedbackId}")
//    public ResponseEntity<Void> deleteFeedback(@PathVariable Long feedbackId) {
//        log.info("Admin deleting feedback: {}", feedbackId);
//        feedbackService.deleteFeedback(feedbackId);
//        return ResponseEntity.noContent().build();
//    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleException(Exception e) {
        log.error("Admin feedback controller error: {}", e.getMessage(), e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body("An error occurred: " + e.getMessage());
    }
}