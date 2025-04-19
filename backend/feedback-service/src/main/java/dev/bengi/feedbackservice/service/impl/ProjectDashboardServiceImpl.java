package dev.bengi.feedbackservice.service.impl;

import dev.bengi.feedbackservice.repository.ProjectRepository;
import dev.bengi.feedbackservice.service.ProjectDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/**
 * Implementation for project dashboard metrics
 * 
 * Note: Using block() for backward compatibility. This should be refactored to a fully
 * reactive approach in the future.
 */
@Service
@RequiredArgsConstructor
public class ProjectDashboardServiceImpl implements ProjectDashboardService {
    
    private final ProjectRepository projectRepository;

    @Override
    public int getActiveProjectsCount() {
        Long count = projectRepository.countActiveProjects().block();
        return count != null ? count.intValue() : 0;
    }

    @Override
    public int getCompletedProjectsCount() {
        Long count = projectRepository.countCompletedProjects().block();
        return count != null ? count.intValue() : 0;
    }
}