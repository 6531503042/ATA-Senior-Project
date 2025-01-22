package dev.bengi.feedbackservice.controller.admin;

import dev.bengi.feedbackservice.dto.AdminDashboardResponse;
import dev.bengi.feedbackservice.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin/dashboard")
@RequiredArgsConstructor
public class DashboardController {
    private final DashboardService dashboardService;

    @GetMapping
    public ResponseEntity<AdminDashboardResponse> getAdminDashboard() {
        AdminDashboardResponse dashboard = dashboardService.generateAdminDashboard();
        return ResponseEntity.ok(dashboard);
    }
}