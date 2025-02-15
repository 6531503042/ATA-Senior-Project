package dev.bengi.feedbackservice.controller.admin.dashboard;

import dev.bengi.feedbackservice.service.ProjectDashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class ProjectDashboardController {

    @Autowired
    private ProjectDashboardService projectDashboardService;

    @GetMapping("/active-projects-count")
    public int getActiveProjectsCount() {
        return projectDashboardService.getActiveProjectsCount();
    }

    @GetMapping("/completed-projects-count")
    public int getCompletedProjectsCount() {
        return projectDashboardService.getCompletedProjectsCount();
    }
}
