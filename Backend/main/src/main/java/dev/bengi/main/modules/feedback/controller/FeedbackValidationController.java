package dev.bengi.main.modules.feedback.controller;

import dev.bengi.main.modules.feedback.service.FeedbackService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.Map;

@RestController
@RequestMapping("/api/feedbacks/validation")
@RequiredArgsConstructor
public class FeedbackValidationController {
    
    private final FeedbackService feedbackService;
    
    @GetMapping("/{feedbackId}/can-submit")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public Mono<ResponseEntity<Boolean>> canSubmitFeedback(
            @PathVariable Long feedbackId,
            Authentication auth) {
        String username = auth.getName();
        return feedbackService.canUserSubmitFeedback(feedbackId, username)
                .map(ResponseEntity::ok);
    }
    
    @GetMapping("/{feedbackId}/constraints")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public Mono<ResponseEntity<Map<String, Object>>> getFeedbackConstraints(
            @PathVariable Long feedbackId,
            Authentication auth) {
        String username = auth.getName();
        return feedbackService.getFeedbackSubmissionConstraints(feedbackId, username)
                .map(ResponseEntity::ok);
    }
    
    @PostMapping("/{feedbackId}/validate")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public Mono<ResponseEntity<Map<String, Object>>> validateSubmission(
            @PathVariable Long feedbackId,
            Authentication auth) {
        String username = auth.getName();
        return feedbackService.validateFeedbackSubmission(feedbackId, username)
                .map(ResponseEntity::ok);
    }
}
