package dev.bengi.feedbackservice.service.impl;

import java.time.ZonedDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import dev.bengi.feedbackservice.client.UserClient;
import dev.bengi.feedbackservice.domain.model.Project;
import dev.bengi.feedbackservice.domain.payload.request.AddProjectMemberRequest;
import dev.bengi.feedbackservice.domain.payload.request.CreateProjectRequest;
import dev.bengi.feedbackservice.domain.payload.response.ProjectResponse;
import dev.bengi.feedbackservice.repository.ProjectRepository;
import dev.bengi.feedbackservice.service.ProjectMemberService;
import dev.bengi.feedbackservice.service.ProjectService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;
    private final UserClient userClient;
    private final ProjectMemberService projectMemberService;

    private ProjectResponse mapToProjectResponse(Project project) {
        return ProjectResponse.builder()
                .id(project.getId())
                .name(project.getName())
                .description(project.getDescription())
                .memberIds(new ArrayList<>(project.getMemberIds()))
                .projectStartDate(project.getProjectStartDate() != null ? 
                    ZonedDateTime.of(project.getProjectStartDate(), ZoneId.systemDefault()) : null)
                .projectEndDate(project.getProjectEndDate() != null ? 
                    ZonedDateTime.of(project.getProjectEndDate(), ZoneId.systemDefault()) : null)
                .createdAt(project.getCreatedAt() != null ? 
                    ZonedDateTime.of(project.getCreatedAt(), ZoneId.systemDefault()) : null)
                .updatedAt(project.getUpdatedAt() != null ? 
                    ZonedDateTime.of(project.getUpdatedAt(), ZoneId.systemDefault()) : null)
                .build();
    }

    @Override
    @Transactional
    public Mono<ProjectResponse> createProject(CreateProjectRequest request) {
        log.debug("Creating new project: {}", request.getName());
        
        Project project = Project.builder()
                .name(request.getName())
                .description(request.getDescription())
                .projectStartDate(request.getProjectStartDate() != null ? request.getProjectStartDate().toLocalDateTime() : null)
                .projectEndDate(request.getProjectEndDate() != null ? request.getProjectEndDate().toLocalDateTime() : null)
                .build();
        
        // Initialize before saving
        project.initializeForCreate();

        return projectRepository.save(project)
            .doOnSuccess(savedProject -> log.info("Created new project with ID: {}", savedProject.getId()))
            .map(this::mapToProjectResponse);
    }

    @Override
    @Transactional
    public Mono<ProjectResponse> updateProject(Long id, CreateProjectRequest request) {
        log.info("Updating project with ID: {}", id);

        return projectRepository.findById(id)
            .switchIfEmpty(Mono.error(() -> {
                log.error("Project not found with ID: {}", id);
                return new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found");
            }))
            .flatMap(existingProject -> {
                existingProject.setName(request.getName());
                existingProject.setDescription(request.getDescription());
                existingProject.setProjectStartDate(request.getProjectStartDate() != null ? request.getProjectStartDate().toLocalDateTime() : null);
                existingProject.setProjectEndDate(request.getProjectEndDate() != null ? request.getProjectEndDate().toLocalDateTime() : null);
                
                // Initialize for update
                existingProject.initializeForUpdate();
                
                return projectRepository.save(existingProject);
            })
            .doOnSuccess(project -> log.info("Project updated successfully with ID: {}", id))
            .doOnError(e -> log.error("Error updating project: {}", e.getMessage(), e))
            .map(this::mapToProjectResponse);
    }

    @Override
    @Transactional
    public Mono<Void> deleteProject(Long id) {
        log.info("Deleting project with ID: {}", id);

        return projectRepository.existsById(id)
            .flatMap(exists -> {
                if (!exists) {
                    log.error("Project not found with ID: {}", id);
                    return Mono.error(new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found"));
                }
                return projectRepository.deleteById(id)
                    .doOnSuccess(v -> log.info("Project deleted successfully with ID: {}", id));
            });
    }

    @Override
    @Transactional(readOnly = true)
    public Mono<ProjectResponse> getProjectById(Long id) {
        log.info("Fetching project with ID: {}", id);

        return projectRepository.findById(id)
            .switchIfEmpty(Mono.error(() -> {
                log.error("Project not found with ID: {}", id);
                return new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found");
            }))
            .map(this::mapToProjectResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Mono<List<ProjectResponse>> getAllProjects() {
        log.info("Fetching all projects");

        return projectRepository.findAll()
            .map(this::mapToProjectResponse)
            .collectList()
            .doOnSuccess(responses -> log.info("Found {} projects", responses.size()))
            .doOnError(e -> log.error("Error fetching projects: {}", e.getMessage(), e));
    }

    @Override
    @Transactional
    public Mono<ProjectResponse> addProjectMembers(Long projectId, AddProjectMemberRequest request) {
        log.debug("Adding members to project ID: {}", projectId);
        
        return getProject(projectId)
            .flatMap(project -> {
                Set<Long> newMemberIds = new HashSet<>(request.getMemberIds());
                
                // Add new members through user service
                boolean syncSuccess = projectMemberService.syncProjectMembers(
                    projectId, 
                    newMemberIds
                );
                
                if (!syncSuccess) {
                    log.error("Failed to sync project members for project: {}", projectId);
                    return Mono.error(new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to sync project members"));
                }

                // Update project's memberIds
                project.setMemberIds(newMemberIds);
                return projectRepository.save(project.initializeForUpdate());
            })
            .doOnSuccess(project -> log.info("Successfully added members to project ID: {}", projectId))
            .map(this::mapToProjectResponse);
    }

    @Override
    @Transactional
    public Mono<ProjectResponse> removeProjectMembers(Long projectId, List<Long> memberIds) {
        log.debug("Removing members from project ID: {}", projectId);
        
        return getProject(projectId)
            .flatMap(project -> {
                // Get current members
                Set<Long> currentMembers = projectMemberService.getProjectMembers(projectId);
                
                // Remove specified members
                currentMembers.removeAll(memberIds);
                
                // Sync updated member list
                boolean syncSuccess = projectMemberService.syncProjectMembers(projectId, currentMembers);
                
                if (!syncSuccess) {
                    log.error("Failed to sync project members for project: {}", projectId);
                    return Mono.error(new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to sync project members"));
                }

                project.setMemberIds(currentMembers);
                return projectRepository.save(project.initializeForUpdate());
            })
            .doOnSuccess(project -> log.info("Successfully removed members from project ID: {}", projectId))
            .map(this::mapToProjectResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Mono<List<ProjectResponse>> getProjectsByMemberId(Long memberId) {
        log.info("Fetching projects for member ID: {}", memberId);

        return projectRepository.findAll()
            .filter(project -> projectMemberService.isProjectMember(memberId, project.getId()))
            .map(this::mapToProjectResponse)
            .collectList()
            .doOnSuccess(responses -> log.info("Found {} projects for member ID: {}", responses.size(), memberId))
            .doOnError(e -> log.error("Error fetching projects for member: {}", e.getMessage(), e));
    }

    @Override
    @Transactional(readOnly = true)
    public Mono<List<Project>> getActiveProjects() {
        return projectRepository.findActiveProjectsOrderByCreatedAt()
            .collectList();
    }

    @Override
    @Transactional(readOnly = true)
    public Mono<List<Project>> getCompletedProjects() {
        return projectRepository.findCompletedProjectsOrderByEndDate()
            .collectList();
    }

    @Override
    @Transactional(readOnly = true)
    public Mono<Map<String, Long>> getProjectStatistics() {
        return Mono.zip(
            projectRepository.count(),
            projectRepository.countActiveProjects(),
            projectRepository.countCompletedProjects()
        ).map(tuple -> {
            Map<String, Long> statistics = new HashMap<>();
            statistics.put("total", tuple.getT1());
            statistics.put("active", tuple.getT2());
            statistics.put("completed", tuple.getT3());
            return statistics;
        });
    }

    @Override
    @Transactional(readOnly = true)
    public Mono<List<Project>> getRecentProjects() {
        return projectRepository.findAll()
            .sort((p1, p2) -> p2.getCreatedAt().compareTo(p1.getCreatedAt()))
            .take(5)
            .collectList();
    }

    @Override
    @Transactional(readOnly = true)
    public Mono<Map<String, Long>> getProjectsByStatus() {
        return Mono.zip(
            projectRepository.countActiveProjects(),
            projectRepository.countCompletedProjects()
        ).map(tuple -> {
            Map<String, Long> statusMap = new HashMap<>();
            statusMap.put("active", tuple.getT1());
            statusMap.put("completed", tuple.getT2());
            return statusMap;
        });
    }

    @Override
    @Transactional(readOnly = true)
    public Mono<Project> getProject(Long id) {
        return projectRepository.findById(id)
            .switchIfEmpty(Mono.error(new RuntimeException("Project not found")));
    }

    @Override
    @Transactional
    public Mono<Project> updateProject(Long id, Project project) {
        return getProject(id)
            .flatMap(existingProject -> {
                project.setId(id);
                project.initializeForUpdate();
                return projectRepository.save(project);
            });
    }

    @Override
    @Transactional
    public Mono<Project> createProject(Project project) {
        project.initializeForCreate();
        return projectRepository.save(project);
    }
}
