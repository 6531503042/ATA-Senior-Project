package dev.bengi.main.modules.dashboard.controller;

import dev.bengi.main.modules.dashboard.dto.DashboardDtos.*;
import dev.bengi.main.modules.dashboard.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;
    
    @GetMapping("/quick-stats")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public Mono<ResponseEntity<Map<String, Object>>> quickStats(Authentication auth) {
        String userId = auth != null ? auth.getName() : null;
        return dashboardService.getQuickStats(userId).map(ResponseEntity::ok);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public Mono<ResponseEntity<DashboardStats>> get(Authentication auth) {
        String username = auth != null ? auth.getName() : null;
        return dashboardService.getStats(username).map(ResponseEntity::ok);
    }

    @GetMapping("/advanced")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public Mono<ResponseEntity<EnhancedDashboardStats>> getAdvanced(Authentication auth) {
        String username = auth != null ? auth.getName() : null;
        return dashboardService.getAdvancedStats(username).map(ResponseEntity::ok);
    }

    @GetMapping("/metrics")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public Mono<ResponseEntity<AdvancedMetrics>> getMetrics() {
        return dashboardService.getAdvancedMetrics().map(ResponseEntity::ok);
    }

    @GetMapping("/departments")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public Mono<ResponseEntity<java.util.List<DepartmentMetrics>>> getDepartmentMetrics() {
        return dashboardService.getDepartmentMetrics().map(ResponseEntity::ok);
    }

    @GetMapping("/timeseries")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public Mono<ResponseEntity<java.util.List<TimeSeriesMetric>>> getTimeSeriesData() {
        return dashboardService.getTimeSeriesData().map(ResponseEntity::ok);
    }

    // Individual stats endpoints for dashboard cards
    @GetMapping("/stats/users")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public Mono<ResponseEntity<Map<String, Object>>> getUsersStats() {
        return dashboardService.getUsersStats().map(ResponseEntity::ok);
    }

    @GetMapping("/stats/departments")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public Mono<ResponseEntity<Map<String, Object>>> getDepartmentsStats() {
        return dashboardService.getDepartmentsStats().map(ResponseEntity::ok);
    }

    @GetMapping("/stats/questions")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public Mono<ResponseEntity<Map<String, Object>>> getQuestionsStats() {
        return dashboardService.getQuestionsStats().map(ResponseEntity::ok);
    }

    @GetMapping("/stats/feedbacks")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public Mono<ResponseEntity<Map<String, Object>>> getFeedbacksStats() {
        return dashboardService.getFeedbacksStats().map(ResponseEntity::ok);
    }

    @GetMapping("/stats/submissions")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public Mono<ResponseEntity<Map<String, Object>>> getSubmissionsStats() {
        return dashboardService.getSubmissionsStats().map(ResponseEntity::ok);
    }

    @GetMapping("/stats/projects")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public Mono<ResponseEntity<Map<String, Object>>> getProjectsStats() {
        return dashboardService.getProjectsStats().map(ResponseEntity::ok);
    }

    // Interactive and real-time dashboard features
    
    @GetMapping("/activity-feed")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public Flux<ActivityFeed> getActivityFeed(@RequestParam(defaultValue = "20") int limit) {
        return dashboardService.getActivityFeed(limit);
    }
    
    @GetMapping("/quick-actions")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public Flux<QuickAction> getQuickActions(Authentication auth) {
        // Extract user role from authentication
        String userRole = auth.getAuthorities().stream()
                .map(Object::toString)
                .filter(role -> role.startsWith("ROLE_"))
                .map(role -> role.substring(5))
                .findFirst()
                .orElse("USER");
        return dashboardService.getQuickActions(userRole);
    }
    
    @GetMapping("/widgets")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public Flux<DashboardWidget> getCustomizableWidgets(Authentication auth) {
        String username = auth != null ? auth.getName() : null;
        return dashboardService.getCustomizableWidgets(username);
    }
    
    @GetMapping("/realtime-metrics")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public Mono<ResponseEntity<java.util.Map<String, Object>>> getRealTimeMetrics() {
        return dashboardService.getRealTimeMetrics().map(ResponseEntity::ok);
    }
    
    @GetMapping("/notifications")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public Flux<RealTimeUpdate> getRecentNotifications(
            Authentication auth,
            @RequestParam(defaultValue = "10") int limit) {
        String username = auth != null ? auth.getName() : null;
        return dashboardService.getRecentNotifications(username, limit);
    }
    
    @GetMapping("/health")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public Mono<ResponseEntity<java.util.Map<String, Long>>> getSystemHealth() {
        return dashboardService.getSystemHealthMetrics().map(ResponseEntity::ok);
    }
}


