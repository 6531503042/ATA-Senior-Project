package dev.bengi.feedbackservice.service.impl;

import dev.bengi.feedbackservice.repository.ProjectRepository;
import dev.bengi.feedbackservice.service.ProjectDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProjectDashboardServiceImpl implements ProjectDashboardService {
    
    private final ProjectRepository projectRepository;

    @Override
    public int getActiveProjectsCount() {
        return projectRepository.countActiveProjects().intValue();
    }

    @Override
    public int getCompletedProjectsCount() {
        return projectRepository.countCompletedProjects().intValue();
    }
}