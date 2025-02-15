package dev.bengi.feedbackservice.controller;

import dev.bengi.feedbackservice.domain.payload.request.FeedbackScoreRequest;
import dev.bengi.feedbackservice.domain.payload.response.FeedbackScoreResponse;
import dev.bengi.feedbackservice.domain.enums.QuestionCategory;
import dev.bengi.feedbackservice.service.FeedbackScoreService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/scores")
@RequiredArgsConstructor
public class UserFeedbackScoreController {
    private final FeedbackScoreService scoreService;

    @PostMapping("/create")
    public ResponseEntity<FeedbackScoreResponse> createScore(
            @Valid @RequestBody FeedbackScoreRequest request) {
        return ResponseEntity.ok(scoreService.createScore(request));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<FeedbackScoreResponse> updateScore(
            @PathVariable Long id,
            @Valid @RequestBody FeedbackScoreRequest request) {
        return ResponseEntity.ok(scoreService.updateScore(id, request));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteScore(@PathVariable Long id) {
        scoreService.deleteScore(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<FeedbackScoreResponse> getScore(@PathVariable Long id) {
        return ResponseEntity.ok(scoreService.getScore(id));
    }

    @GetMapping("/get-all")
    public ResponseEntity<List<FeedbackScoreResponse>> getAllScores() {
        return ResponseEntity.ok(scoreService.getAllScores());
    }

    @GetMapping("/submission/{submissionId}")
    public ResponseEntity<List<FeedbackScoreResponse>> getScoresBySubmission(
            @PathVariable Long submissionId) {
        return ResponseEntity.ok(scoreService.getScoresBySubmission(submissionId));
    }

    // Dashboard endpoints
    @GetMapping("/satisfaction")
    public ResponseEntity<Double> getOverallSatisfactionScore() {
        return ResponseEntity.ok(scoreService.getOverallSatisfactionScore());
    }

    @GetMapping("/categories")
    public ResponseEntity<Map<QuestionCategory, Double>> getCategoryScores() {
        return ResponseEntity.ok(scoreService.getCategoryScores());
    }

    @GetMapping("/recent")
    public ResponseEntity<List<FeedbackScoreResponse>> getRecentScores() {
        return ResponseEntity.ok(scoreService.getRecentScores());
    }

    @GetMapping("/metrics")
    public ResponseEntity<Map<String, Double>> getScoringMetrics() {
        return ResponseEntity.ok(scoreService.getScoringMetrics());
    }

    @GetMapping("/priority-distribution")
    public ResponseEntity<Map<String, Long>> getPriorityDistribution() {
        return ResponseEntity.ok(scoreService.getPriorityDistribution());
    }
} 