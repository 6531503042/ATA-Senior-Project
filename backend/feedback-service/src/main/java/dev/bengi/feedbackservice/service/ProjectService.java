package dev.bengi.feedbackservice.service;

import dev.bengi.feedbackservice.domain.model.Project;
import dev.bengi.feedbackservice.domain.payload.request.AddProjectMemberRequest;
import dev.bengi.feedbackservice.domain.payload.request.CreateProjectRequest;
import dev.bengi.feedbackservice.domain.payload.response.ProjectResponse;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;

public interface ProjectService {
    @Transactional
    Mono<ProjectResponse> createProject(CreateProjectRequest request);

    @Transactional
    Mono<ProjectResponse> updateProject(Long id, CreateProjectRequest request);

    @Transactional
    Mono<Void> deleteProject(Long id);

    @Transactional(readOnly = true)
    Mono<ProjectResponse> getProjectById(Long id);

    @Transactional(readOnly = true)
    Mono<List<ProjectResponse>> getAllProjects();

    @Transactional
    Mono<ProjectResponse> addProjectMembers(Long projectId, AddProjectMemberRequest request);

    @Transactional
    Mono<ProjectResponse> removeProjectMembers(Long projectId, List<Long> memberIds);

    @Transactional(readOnly = true)
    Mono<List<ProjectResponse>> getProjectsByMemberId(Long memberId);

    Mono<Project> createProject(Project project);
    Mono<Project> updateProject(Long id, Project project);
    Mono<Project> getProject(Long id);
    Mono<List<Project>> getActiveProjects();
    Mono<List<Project>> getCompletedProjects();
    
    // Dashboard methods
    Mono<Map<String, Long>> getProjectStatistics();
    Mono<List<Project>> getRecentProjects();
    Mono<Map<String, Long>> getProjectsByStatus();
}
