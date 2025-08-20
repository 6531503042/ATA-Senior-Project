package dev.bengi.main.modules.dashboard.controller;

import dev.bengi.main.modules.dashboard.dto.DashboardDtos.DashboardStats;
import dev.bengi.main.modules.dashboard.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public Mono<ResponseEntity<DashboardStats>> get(Authentication auth) {
        String username = auth != null ? auth.getName() : null;
        return dashboardService.getStats(username).map(ResponseEntity::ok);
    }
}


