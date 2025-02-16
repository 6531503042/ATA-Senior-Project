package dev.bengi.feedbackservice.service;

import dev.bengi.feedbackservice.domain.model.Project;
import dev.bengi.feedbackservice.domain.payload.request.AddProjectMemberRequest;
import dev.bengi.feedbackservice.domain.payload.request.CreateProjectRequest;
import dev.bengi.feedbackservice.domain.payload.response.ProjectResponse;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

public interface ProjectService {
    @Transactional
    ProjectResponse createProject(CreateProjectRequest request);

    @Transactional
    ProjectResponse updateProject(Long id, CreateProjectRequest request);

    @Transactional
    void deleteProject(Long id);

    @Transactional(readOnly = true)
    ProjectResponse getProjectById(Long id);

    @Transactional(readOnly = true)
    List<ProjectResponse> getAllProjects();

    @Transactional
    ProjectResponse addProjectMembers(Long projectId, AddProjectMemberRequest request);

    @Transactional
    ProjectResponse removeProjectMembers(Long projectId, List<Long> memberIds);

    @Transactional(readOnly = true)
    List<ProjectResponse> getProjectsByMemberId(Long memberId);

    Project createProject(Project project);
    Project updateProject(Long id, Project project);
    Project getProject(Long id);
    List<Project> getActiveProjects();
    List<Project> getCompletedProjects();
    
    // Dashboard methods
    Map<String, Long> getProjectStatistics();
    List<Project> getRecentProjects();
    Map<String, Long> getProjectsByStatus();
}
