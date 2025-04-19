package dev.bengi.feedbackservice.controller.employee;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import dev.bengi.feedbackservice.domain.payload.response.FeedbackDetailsResponse;
import dev.bengi.feedbackservice.service.FeedbackService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Slf4j
@RestController
@RequestMapping("/api/v1/feedback")
@RequiredArgsConstructor
public class EmployeeFeedbackController {
    
    private final FeedbackService feedbackService;
    
    @GetMapping("/available/{userId}")
    public Flux<FeedbackDetailsResponse> getAvailableFeedbacks(@PathVariable String userId) {
        log.info("Getting available feedbacks for user: {}", userId);
        return feedbackService.getAvailableFeedbacksForUser(userId);
    }
    
    @GetMapping("/{feedbackId}")
    public Mono<ResponseEntity<FeedbackDetailsResponse>> getFeedbackDetails(@PathVariable Long feedbackId) {
        log.info("Getting feedback details for ID: {}", feedbackId);
        return feedbackService.getFeedbackDetails(feedbackId)
            .map(ResponseEntity::ok)
            .defaultIfEmpty(ResponseEntity.notFound().build());
    }
} 