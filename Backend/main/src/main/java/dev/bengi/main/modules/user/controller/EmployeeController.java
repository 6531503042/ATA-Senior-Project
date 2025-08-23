package dev.bengi.main.modules.user.controller;

import dev.bengi.main.common.pagination.PageResponse;
import dev.bengi.main.common.pagination.PaginationService;
import dev.bengi.main.modules.feedback.dto.FeedbackResponseDto;
import dev.bengi.main.modules.feedback.service.FeedbackService;
import dev.bengi.main.modules.projects.dto.ProjectResponseDto;
import dev.bengi.main.modules.projects.service.ProjectService;
import dev.bengi.main.modules.submit.dto.SubmitResponseDto;
import dev.bengi.main.modules.submit.service.SubmitService;
import dev.bengi.main.modules.user.dto.UserResponseDto;
import dev.bengi.main.modules.user.service.UserManagementService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Map;

@RestController
@RequestMapping("/api/employees")
@RequiredArgsConstructor
public class EmployeeController {
    
    private final UserManagementService userManagementService;
    private final ProjectService projectService;
    private final FeedbackService feedbackService;
    private final SubmitService submitService;
    private final PaginationService paginationService;
    
    @GetMapping("/profile")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public Mono<ResponseEntity<UserResponseDto>> getMyProfile(Authentication auth) {
        String username = auth.getName();
        return userManagementService.findUserByUsername(username)
                .map(ResponseEntity::ok);
    }
    
    @GetMapping("/my-projects")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public Mono<ResponseEntity<PageResponse<ProjectResponseDto>>> getMyProjects(
            Authentication auth, 
            ServerWebExchange exchange) {
        
        String username = auth.getName();
        var pageRequest = paginationService.parsePageRequest(exchange);
        
        return userManagementService.findUserByUsername(username)
                .flatMap(user -> projectService.getProjectsByMember(user.id(), pageRequest))
                .map(ResponseEntity::ok);
    }
    
    @GetMapping("/my-feedbacks")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public Mono<ResponseEntity<PageResponse<FeedbackResponseDto>>> getMyAvailableFeedbacks(
            Authentication auth,
            ServerWebExchange exchange) {
        
        String username = auth.getName();
        var pageRequest = paginationService.parsePageRequest(exchange);
        
        return feedbackService.findAvailableFeedbacks(pageRequest, username)
                .map(ResponseEntity::ok);
    }
    
    @GetMapping("/my-submissions")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public Mono<ResponseEntity<PageResponse<SubmitResponseDto>>> getMySubmissions(
            Authentication auth,
            ServerWebExchange exchange) {
        
        String username = auth.getName();
        var pageRequest = paginationService.parsePageRequest(exchange);
        
        return submitService.getByUser(username, pageRequest)
                .map(ResponseEntity::ok);
    }
    
    @GetMapping("/pending-feedbacks")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public Flux<FeedbackResponseDto> getPendingFeedbacks(Authentication auth) {
        String username = auth.getName();
        return feedbackService.getPendingFeedbacksForUser(username);
    }
    
    @GetMapping("/dashboard-summary")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public Mono<ResponseEntity<Map<String, Object>>> getEmployeeDashboardSummary(Authentication auth) {
        String username = auth.getName();
        return getEmployeeSummaryData(username)
                .map(ResponseEntity::ok);
    }
    
    @GetMapping("/activity-summary")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public Mono<ResponseEntity<Map<String, Object>>> getActivitySummary(Authentication auth) {
        String username = auth.getName();
        return getEmployeeActivityData(username)
                .map(ResponseEntity::ok);
    }
    
    @GetMapping("/performance-metrics")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public Mono<ResponseEntity<Map<String, Object>>> getPerformanceMetrics(Authentication auth) {
        String username = auth.getName();
        return getEmployeePerformanceData(username)
                .map(ResponseEntity::ok);
    }
    
    @GetMapping("/department-colleagues")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public Mono<ResponseEntity<PageResponse<UserResponseDto>>> getDepartmentColleagues(
            Authentication auth,
            ServerWebExchange exchange) {
        
        String username = auth.getName();
        var pageRequest = paginationService.parsePageRequest(exchange);
        
        return userManagementService.findUserByUsername(username)
                .flatMap(user -> {
                    if (user.departmentId() == null) {
                        // Return empty result if user has no department
                        return Mono.just(PageResponse.<UserResponseDto>empty(pageRequest));
                    }
                    return userManagementService.findUsersByDepartment(user.departmentId(), pageRequest);
                })
                .map(ResponseEntity::ok);
    }
    
    @GetMapping("/statistics")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public Mono<ResponseEntity<Map<String, Object>>> getEmployeeStatistics(Authentication auth) {
        String username = auth.getName();
        return getDetailedEmployeeStats(username)
                .map(ResponseEntity::ok);
    }
    
    // Helper methods for data aggregation
    
    private Mono<Map<String, Object>> getEmployeeSummaryData(String username) {
        return userManagementService.findUserByUsername(username)
                .flatMap(user -> {
                    Map<String, Object> summary = new java.util.HashMap<>();
                    summary.put("user", user);
                    
                    // Get counts asynchronously
                    return Mono.zip(
                        projectService.countProjectsByMember(user.id()),
                        feedbackService.countAvailableFeedbacksForUser(username),
                        submitService.countSubmissionsByUser(username),
                        feedbackService.countPendingFeedbacksForUser(username)
                    ).map(counts -> {
                        summary.put("projectCount", counts.getT1());
                        summary.put("availableFeedbacks", counts.getT2());
                        summary.put("totalSubmissions", counts.getT3());
                        summary.put("pendingFeedbacks", counts.getT4());
                        summary.put("timestamp", java.time.LocalDateTime.now());
                        return summary;
                    });
                });
    }
    
    private Mono<Map<String, Object>> getEmployeeActivityData(String username) {
        Map<String, Object> activity = new java.util.HashMap<>();
        
        return userManagementService.findUserByUsername(username)
                .flatMap(user -> {
                    activity.put("userId", user.id());
                    activity.put("username", username);
                    activity.put("lastLoginAt", user.lastLoginAt());
                    
                    // Get recent activity data
                    java.time.LocalDateTime thirtyDaysAgo = java.time.LocalDateTime.now().minusDays(30);
                    
                    return Mono.zip(
                        submitService.countSubmissionsSince(username, thirtyDaysAgo),
                        projectService.countProjectsJoinedSince(user.id(), thirtyDaysAgo),
                        feedbackService.countFeedbacksCompletedSince(username, thirtyDaysAgo)
                    ).map(counts -> {
                        activity.put("submissionsLast30Days", counts.getT1());
                        activity.put("projectsJoinedLast30Days", counts.getT2());
                        activity.put("feedbacksCompletedLast30Days", counts.getT3());
                        
                        // Calculate activity score (0-100)
                        long activityScore = Math.min(100, 
                            (counts.getT1() * 10 + counts.getT2() * 20 + counts.getT3() * 15) / 3
                        );
                        activity.put("activityScore", activityScore);
                        
                        return activity;
                    });
                });
    }
    
    private Mono<Map<String, Object>> getEmployeePerformanceData(String username) {
        Map<String, Object> performance = new java.util.HashMap<>();
        
        return userManagementService.findUserByUsername(username)
                .flatMap(user -> {
                    performance.put("userId", user.id());
                    performance.put("username", username);
                    
                    // Get performance metrics
                    java.time.LocalDateTime quarterAgo = java.time.LocalDateTime.now().minusMonths(3);
                    
                    return Mono.zip(
                        submitService.getAverageSubmissionTime(username, quarterAgo),
                        submitService.getSubmissionCompletionRate(username, quarterAgo),
                        feedbackService.getAverageRatingGiven(username, quarterAgo),
                        projectService.getProjectContributionScore(user.id(), quarterAgo)
                    ).map(metrics -> {
                        performance.put("averageSubmissionTimeMinutes", metrics.getT1());
                        performance.put("completionRate", metrics.getT2());
                        performance.put("averageRatingGiven", metrics.getT3());
                        performance.put("contributionScore", metrics.getT4());
                        
                        // Calculate overall performance score
                        double performanceScore = (
                            (metrics.getT2() * 0.4) +  // Completion rate weight
                            (Math.min(5.0, metrics.getT3()) / 5.0 * 0.3 * 100) +  // Rating weight
                            (metrics.getT4() * 0.3)  // Contribution weight
                        );
                        performance.put("overallPerformanceScore", Math.round(performanceScore));
                        
                        return performance;
                    });
                });
    }
    
    private Mono<Map<String, Object>> getDetailedEmployeeStats(String username) {
        return userManagementService.findUserByUsername(username)
                .flatMap(user -> {
                    Map<String, Object> stats = new java.util.HashMap<>();
                    stats.put("user", user);
                    
                    // Get comprehensive statistics
                    return Mono.zip(
                        getEmployeeSummaryData(username),
                        getEmployeeActivityData(username),
                        getEmployeePerformanceData(username)
                    ).map(data -> {
                        stats.put("summary", data.getT1());
                        stats.put("activity", data.getT2());
                        stats.put("performance", data.getT3());
                        stats.put("generatedAt", java.time.LocalDateTime.now());
                        return stats;
                    });
                });
    }
}
