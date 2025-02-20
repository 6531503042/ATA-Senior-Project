package dev.bengi.feedbackservice.controller;

import dev.bengi.feedbackservice.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
public class DashboardController {
    private final DashboardService dashboardService;

    // Project Dashboard Endpoints
    @GetMapping("/projects/metrics")
    public ResponseEntity<Map<String, Object>> getProjectMetrics() {
        return ResponseEntity.ok(dashboardService.getProjectDashboardMetrics());
    }

    // Question Dashboard Endpoints
    @GetMapping("/questions/overview")
    public ResponseEntity<Map<String, Object>> getQuestionOverview() {
        return ResponseEntity.ok(dashboardService.getQuestionDashboardMetrics());
    }

    @GetMapping("/questions/types")
    public ResponseEntity<Map<String, Object>> getQuestionTypeMetrics() {
        return ResponseEntity.ok(dashboardService.getQuestionTypeMetrics());
    }

    @GetMapping("/questions/categories")
    public ResponseEntity<Map<String, Object>> getQuestionCategoryMetrics() {
        return ResponseEntity.ok(dashboardService.getQuestionCategoryMetrics());
    }

    @GetMapping("/questions/responses")
    public ResponseEntity<Map<String, Object>> getQuestionResponseMetrics() {
        return ResponseEntity.ok(dashboardService.getQuestionResponseMetrics());
    }

    @GetMapping("/questions/performance")
    public ResponseEntity<Map<String, Object>> getPerformanceMetrics() {
        return ResponseEntity.ok(dashboardService.getPerformanceMetricsGraph());
    }

    // Feedback Dashboard Endpoints
    @GetMapping("/feedback/metrics")
    public ResponseEntity<Map<String, Object>> getFeedbackMetrics() {
        return ResponseEntity.ok(dashboardService.getFeedbackDashboardMetrics());
    }

    @GetMapping("/feedback/satisfaction")
    public ResponseEntity<Map<String, Object>> getFeedbackSatisfaction() {
        return ResponseEntity.ok(dashboardService.getFeedbackSatisfactionMetrics());
    }

    @GetMapping("/feedback/sentiment")
    public ResponseEntity<Map<String, Object>> getFeedbackSentiment() {
        return ResponseEntity.ok(dashboardService.getFeedbackSentimentDistribution());
    }

    @GetMapping("/feedback/yearly-analysis")
    public ResponseEntity<Map<String, Object>> getYearlyAnalysis() {
        return ResponseEntity.ok(dashboardService.getYearOverYearAnalysis());
    }
} 