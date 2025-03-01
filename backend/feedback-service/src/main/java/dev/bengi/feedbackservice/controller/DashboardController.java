package dev.bengi.feedbackservice.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import dev.bengi.feedbackservice.domain.payload.response.ApiErrorResponse;
import dev.bengi.feedbackservice.service.DashboardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
public class DashboardController {
    private final DashboardService dashboardService;

    // Project Dashboard Endpoints
    @GetMapping("/projects/metrics")
    public ResponseEntity<?> getProjectMetrics() {
        try {
            log.debug("Fetching project dashboard metrics");
            Map<String, Object> metrics = dashboardService.getProjectDashboardMetrics();
            return ResponseEntity.ok(metrics);
        } catch (Exception e) {
            log.error("Error fetching project dashboard metrics: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiErrorResponse.builder()
                    .timestamp(LocalDateTime.now())
                    .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                    .error("Server Error")
                    .message("Error retrieving project dashboard metrics")
                    .path("/api/v1/dashboard/projects/metrics")
                    .details(List.of(e.getMessage()))
                    .build());
        }
    }

    // Question Dashboard Endpoints
    @GetMapping("/questions/overview")
    public ResponseEntity<?> getQuestionOverview() {
        try {
            log.debug("Fetching question dashboard overview");
            Map<String, Object> metrics = dashboardService.getQuestionDashboardMetrics();
            return ResponseEntity.ok(metrics);
        } catch (Exception e) {
            log.error("Error fetching question dashboard overview: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiErrorResponse.builder()
                    .timestamp(LocalDateTime.now())
                    .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                    .error("Server Error")
                    .message("Error retrieving question dashboard overview")
                    .path("/api/v1/dashboard/questions/overview")
                    .details(List.of(e.getMessage()))
                    .build());
        }
    }

    @GetMapping("/questions/types")
    public ResponseEntity<?> getQuestionTypeMetrics() {
        try {
            log.debug("Fetching question type metrics");
            Map<String, Object> metrics = dashboardService.getQuestionTypeMetrics();
            return ResponseEntity.ok(metrics);
        } catch (Exception e) {
            log.error("Error fetching question type metrics: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiErrorResponse.builder()
                    .timestamp(LocalDateTime.now())
                    .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                    .error("Server Error")
                    .message("Error retrieving question type metrics")
                    .path("/api/v1/dashboard/questions/types")
                    .details(List.of(e.getMessage()))
                    .build());
        }
    }

    @GetMapping("/questions/categories")
    public ResponseEntity<?> getQuestionCategoryMetrics() {
        try {
            log.debug("Fetching question category metrics");
            Map<String, Object> metrics = dashboardService.getQuestionCategoryMetrics();
            return ResponseEntity.ok(metrics);
        } catch (Exception e) {
            log.error("Error fetching question category metrics: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiErrorResponse.builder()
                    .timestamp(LocalDateTime.now())
                    .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                    .error("Server Error")
                    .message("Error retrieving question category metrics")
                    .path("/api/v1/dashboard/questions/categories")
                    .details(List.of(e.getMessage()))
                    .build());
        }
    }

    @GetMapping("/questions/responses")
    public ResponseEntity<?> getQuestionResponseMetrics() {
        try {
            log.debug("Fetching question response metrics");
            Map<String, Object> metrics = dashboardService.getQuestionResponseMetrics();
            return ResponseEntity.ok(metrics);
        } catch (Exception e) {
            log.error("Error fetching question response metrics: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiErrorResponse.builder()
                    .timestamp(LocalDateTime.now())
                    .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                    .error("Server Error")
                    .message("Error retrieving question response metrics")
                    .path("/api/v1/dashboard/questions/responses")
                    .details(List.of(e.getMessage()))
                    .build());
        }
    }

    @GetMapping("/questions/performance")
    public ResponseEntity<?> getPerformanceMetrics() {
        try {
            log.debug("Fetching question performance metrics");
            Map<String, Object> metrics = dashboardService.getPerformanceMetricsGraph();
            return ResponseEntity.ok(metrics);
        } catch (Exception e) {
            log.error("Error fetching question performance metrics: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiErrorResponse.builder()
                    .timestamp(LocalDateTime.now())
                    .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                    .error("Server Error")
                    .message("Error retrieving question performance metrics")
                    .path("/api/v1/dashboard/questions/performance")
                    .details(List.of(e.getMessage()))
                    .build());
        }
    }

    // Feedback Dashboard Endpoints
    @GetMapping("/feedback/metrics")
    public ResponseEntity<?> getFeedbackMetrics() {
        try {
            log.debug("Fetching feedback metrics");
            Map<String, Object> metrics = dashboardService.getFeedbackDashboardMetrics();
            return ResponseEntity.ok(metrics);
        } catch (Exception e) {
            log.error("Error fetching feedback metrics: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiErrorResponse.builder()
                    .timestamp(LocalDateTime.now())
                    .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                    .error("Server Error")
                    .message("Error retrieving feedback metrics")
                    .path("/api/v1/dashboard/feedback/metrics")
                    .details(List.of(e.getMessage()))
                    .build());
        }
    }

    @GetMapping("/feedback/satisfaction")
    public ResponseEntity<?> getFeedbackSatisfaction() {
        try {
            log.debug("Fetching feedback satisfaction metrics");
            Map<String, Object> metrics = dashboardService.getFeedbackSatisfactionMetrics();
            return ResponseEntity.ok(metrics);
        } catch (Exception e) {
            log.error("Error fetching feedback satisfaction metrics: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiErrorResponse.builder()
                    .timestamp(LocalDateTime.now())
                    .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                    .error("Server Error")
                    .message("Error retrieving feedback satisfaction metrics")
                    .path("/api/v1/dashboard/feedback/satisfaction")
                    .details(List.of(e.getMessage()))
                    .build());
        }
    }

    @GetMapping("/feedback/sentiment")
    public ResponseEntity<?> getFeedbackSentiment() {
        try {
            log.debug("Fetching feedback sentiment distribution");
            Map<String, Object> metrics = dashboardService.getFeedbackSentimentDistribution();
            return ResponseEntity.ok(metrics);
        } catch (Exception e) {
            log.error("Error fetching feedback sentiment distribution: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiErrorResponse.builder()
                    .timestamp(LocalDateTime.now())
                    .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                    .error("Server Error")
                    .message("Error retrieving feedback sentiment distribution")
                    .path("/api/v1/dashboard/feedback/sentiment")
                    .details(List.of(e.getMessage()))
                    .build());
        }
    }

    @GetMapping("/feedback/yearly-analysis")
    public ResponseEntity<?> getYearlyAnalysis() {
        try {
            log.debug("Fetching feedback yearly analysis");
            Map<String, Object> metrics = dashboardService.getYearOverYearAnalysis();
            return ResponseEntity.ok(metrics);
        } catch (Exception e) {
            log.error("Error fetching feedback yearly analysis: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiErrorResponse.builder()
                    .timestamp(LocalDateTime.now())
                    .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                    .error("Server Error")
                    .message("Error retrieving feedback yearly analysis")
                    .path("/api/v1/dashboard/feedback/yearly-analysis")
                    .details(List.of(e.getMessage()))
                    .build());
        }
    }
} 