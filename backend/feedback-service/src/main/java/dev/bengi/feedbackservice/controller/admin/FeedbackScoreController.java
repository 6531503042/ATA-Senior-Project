package dev.bengi.feedbackservice.controller.admin;

import dev.bengi.feedbackservice.domain.enums.QuestionCategory;
import dev.bengi.feedbackservice.domain.payload.request.FeedbackScoreRequest;
import dev.bengi.feedbackservice.domain.payload.response.FeedbackScoreResponse;
import dev.bengi.feedbackservice.service.FeedbackScoreService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/scores")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class FeedbackScoreController {
    private final FeedbackScoreService scoreService;

    @PostMapping("/submit")
    public ResponseEntity<FeedbackScoreResponse> submitScore(
            @Valid @RequestBody FeedbackScoreRequest request) {
        return ResponseEntity.ok(scoreService.createScore(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FeedbackScoreResponse> updateScore(
            @PathVariable Long id,
            @Valid @RequestBody FeedbackScoreRequest request) {
        return ResponseEntity.ok(scoreService.updateScore(id, request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<FeedbackScoreResponse> getScore(@PathVariable Long id) {
        return ResponseEntity.ok(scoreService.getScore(id));
    }

    @GetMapping("/submission/{submissionId}")
    public ResponseEntity<List<FeedbackScoreResponse>> getScoresBySubmission(
            @PathVariable Long submissionId) {
        return ResponseEntity.ok(scoreService.getScoresBySubmission(submissionId));
    }

    // Score Status Endpoints
    @GetMapping("/status/unscored")
    public ResponseEntity<List<FeedbackScoreResponse>> getUnscoredSubmissions() {
        return ResponseEntity.ok(scoreService.getUnscoredSubmissions());
    }

    @GetMapping("/status/scored")
    public ResponseEntity<List<FeedbackScoreResponse>> getScoredSubmissions() {
        return ResponseEntity.ok(scoreService.getScoredSubmissions());
    }

    @GetMapping("/status/count")
    public ResponseEntity<Map<String, Long>> getScoreStatusCounts() {
        return ResponseEntity.ok(scoreService.getScoreStatusCounts());
    }

    // Statistics Endpoints
    @GetMapping("/metrics")
    public ResponseEntity<Map<String, Double>> getScoringMetrics() {
        return ResponseEntity.ok(scoreService.getScoringMetrics());
    }

    @GetMapping("/categories")
    public ResponseEntity<Map<QuestionCategory, Double>> getCategoryScores() {
        return ResponseEntity.ok(scoreService.getCategoryScores());
    }

    @GetMapping("/recent")
    public ResponseEntity<List<FeedbackScoreResponse>> getRecentScores() {
        return ResponseEntity.ok(scoreService.getRecentScores());
    }

    @GetMapping("/priority-distribution")
    public ResponseEntity<Map<String, Long>> getPriorityDistribution() {
        return ResponseEntity.ok(scoreService.getPriorityDistribution());
    }

    @GetMapping("/statistics/detailed")
    public ResponseEntity<Map<String, Object>> getDetailedStatistics() {
        return ResponseEntity.ok(scoreService.getDetailedStatistics());
    }
} 