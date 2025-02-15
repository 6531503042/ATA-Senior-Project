package dev.bengi.feedbackservice.service.impl;

import dev.bengi.feedbackservice.foreign.UserClient;
import dev.bengi.feedbackservice.domain.model.Project;
import dev.bengi.feedbackservice.domain.payload.request.AddProjectMemberRequest;
import dev.bengi.feedbackservice.domain.payload.request.CreateProjectRequest;
import dev.bengi.feedbackservice.domain.payload.response.ProjectResponse;
import dev.bengi.feedbackservice.repository.ProjectRepository;
import dev.bengi.feedbackservice.service.ProjectService;
import dev.bengi.feedbackservice.service.ProjectMemberService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

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
                .projectStartDate(project.getProjectStartDate())
                .projectEndDate(project.getProjectEndDate())
                .createdAt(project.getCreatedAt())
                .updatedAt(project.getUpdatedAt())
                .build();
    }

    @Override
    @Transactional
    public ProjectResponse createProject(CreateProjectRequest request) {
        log.debug("Creating new project: {}", request.getName());
        
        Project project = Project.builder()
                .name(request.getName())
                .description(request.getDescription())
                .projectStartDate(request.getProjectStartDate())
                .projectEndDate(request.getProjectEndDate())
                .build();

        Project savedProject = projectRepository.save(project);
        log.info("Created new project with ID: {}", savedProject.getId());
        return mapToProjectResponse(savedProject);
    }

    @Override
    @Transactional
    public ProjectResponse updateProject(Long id, CreateProjectRequest request) {
        log.info("Updating project with ID: {}", id);

        Project existingProject = projectRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("Project not found with ID: {}", id);
                    return new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found");
                });

        existingProject.setName(request.getName());
        existingProject.setDescription(request.getDescription());
        existingProject.setProjectStartDate(request.getProjectStartDate());
        existingProject.setProjectEndDate(request.getProjectEndDate());

        try {
            Project updatedProject = projectRepository.save(existingProject);
            log.info("Project updated successfully with ID: {}", id);
            return mapToProjectResponse(updatedProject);
        } catch (Exception e) {
            log.error("Error updating project: {}", e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to update project");
        }
    }

    @Override
    @Transactional
    public void deleteProject(Long id) {
        log.info("Deleting project with ID: {}", id);

        try {
            if (!projectRepository.existsById(id)) {
                log.error("Project not found with ID: {}", id);
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found");
            }
            projectRepository.deleteById(id);
            log.info("Project deleted successfully with ID: {}", id);
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            log.error("Error deleting project: {}", e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to delete project");
        }
    }

    @Override
    @Transactional(readOnly = true)
    public ProjectResponse getProjectById(Long id) {
        log.info("Fetching project with ID: {}", id);

        Project project = projectRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("Project not found with ID: {}", id);
                    return new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found");
                });

        return mapToProjectResponse(project);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProjectResponse> getAllProjects() {
        log.info("Fetching all projects");

        try {
            List<Project> projects = projectRepository.findAll();
            List<ProjectResponse> responses = projects.stream()
                    .map(this::mapToProjectResponse)
                    .collect(Collectors.toList());
            log.info("Found {} projects", responses.size());
            return responses;
        } catch (Exception e) {
            log.error("Error fetching projects: {}", e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to fetch projects");
        }
    }

    @Override
    @Transactional
    public ProjectResponse addProjectMembers(Long projectId, AddProjectMemberRequest request) {
        log.debug("Adding members to project ID: {}", projectId);
        
        Project project = getProject(projectId);
        Set<Long> newMemberIds = new HashSet<>(request.getMemberIds());
        
        // Add new members through user service
        boolean syncSuccess = projectMemberService.syncProjectMembers(
            projectId, 
            newMemberIds
        );
        
        if (!syncSuccess) {
            log.error("Failed to sync project members for project: {}", projectId);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to sync project members");
        }

        // Update project's memberIds
        project.setMemberIds(newMemberIds);
        project = projectRepository.save(project);

        log.info("Successfully added members to project ID: {}", projectId);
        return mapToProjectResponse(project);
    }

    @Override
    @Transactional
    public ProjectResponse removeProjectMembers(Long projectId, List<Long> memberIds) {
        log.debug("Removing members from project ID: {}", projectId);
        
        Project project = getProject(projectId);
        
        // Get current members
        Set<Long> currentMembers = projectMemberService.getProjectMembers(projectId);
        
        // Remove specified members
        currentMembers.removeAll(memberIds);
        
        // Sync updated member list
        boolean syncSuccess = projectMemberService.syncProjectMembers(projectId, currentMembers);
        
        if (!syncSuccess) {
            log.error("Failed to sync project members for project: {}", projectId);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to sync project members");
        }

        log.info("Successfully removed members from project ID: {}", projectId);
        return mapToProjectResponse(project);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProjectResponse> getProjectsByMemberId(Long memberId) {
        log.info("Fetching projects for member ID: {}", memberId);

        try {
            // Get all projects
            List<Project> allProjects = projectRepository.findAll();
            
            // Filter projects where user is a member
            List<Project> memberProjects = allProjects.stream()
                .filter(project -> projectMemberService.isProjectMember(memberId, project.getId()))
                .collect(Collectors.toList());

            List<ProjectResponse> responses = memberProjects.stream()
                .map(this::mapToProjectResponse)
                .collect(Collectors.toList());

            log.info("Found {} projects for member ID: {}", responses.size(), memberId);
            return responses;
        } catch (Exception e) {
            log.error("Error fetching projects for member: {}", e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to fetch projects for member");
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<Project> getActiveProjects() {
        return projectRepository.findAll().stream()
                .filter(p -> p.getProjectEndDate().isAfter(ZonedDateTime.now()))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<Project> getCompletedProjects() {
        return projectRepository.findAll().stream()
                .filter(p -> p.getProjectEndDate().isBefore(ZonedDateTime.now()))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Long> getProjectStatistics() {
        Map<String, Long> statistics = new HashMap<>();
        statistics.put("total", projectRepository.count());
        statistics.put("active", projectRepository.countActiveProjects());
        statistics.put("completed", projectRepository.countCompletedProjects());
        return statistics;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Project> getRecentProjects() {
        return projectRepository.findAll().stream()
                .sorted((p1, p2) -> p2.getCreatedAt().compareTo(p1.getCreatedAt()))
                .limit(5)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Long> getProjectsByStatus() {
        Map<String, Long> statusMap = new HashMap<>();
        Long activeCount = projectRepository.countActiveProjects();
        Long completedCount = projectRepository.countCompletedProjects();
        
        statusMap.put("active", activeCount);
        statusMap.put("completed", completedCount);
        return statusMap;
    }

    @Override
    @Transactional(readOnly = true)
    public Project getProject(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));
    }

    @Override
    @Transactional
    public Project updateProject(Long id, Project project) {
        Project existingProject = getProject(id);
        project.setId(id);
        project.setUpdatedAt(ZonedDateTime.now());
        return projectRepository.save(project);
    }

    @Override
    @Transactional
    public Project createProject(Project project) {
        project.setCreatedAt(ZonedDateTime.now());
        project.setUpdatedAt(ZonedDateTime.now());
        return projectRepository.save(project);
    }
}
