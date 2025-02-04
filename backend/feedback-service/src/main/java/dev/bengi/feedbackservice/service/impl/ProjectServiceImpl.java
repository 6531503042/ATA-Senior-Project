package dev.bengi.feedbackservice.service.impl;

import dev.bengi.feedbackservice.foreign.UserClient;
import dev.bengi.feedbackservice.domain.model.Project;
import dev.bengi.feedbackservice.domain.payload.request.AddProjectMemberRequest;
import dev.bengi.feedbackservice.domain.payload.request.CreateProjectRequest;
import dev.bengi.feedbackservice.domain.payload.response.ProjectResponse;
import dev.bengi.feedbackservice.repository.ProjectRepository;
import dev.bengi.feedbackservice.service.ProjectService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;
    private final UserClient userClient;

    private ProjectResponse mapToProjectResponse(Project project) {
        return ProjectResponse.builder()
                .id(project.getId())
                .name(project.getName())
                .description(project.getDescription())
                .memberIds(project.getMemberIds())
                .projectStartDate(project.getProjectStartDate())
                .projectEndDate(project.getProjectEndDate())
                .createdAt(project.getCreatedAt())
                .updatedAt(project.getUpdatedAt())
                .build();
    }

    @Override
    @Transactional
    public ProjectResponse createProject(CreateProjectRequest request) {
        log.info("Creating new project with name: {}", request.getName());

        Project project = Project.builder()
                .name(request.getName())
                .description(request.getDescription())
                .memberIds(new ArrayList<>())
                .projectStartDate(request.getProjectStartDate())
                .projectEndDate(request.getProjectEndDate())
                .build();

        try {
            Project savedProject = projectRepository.save(project);
            log.info("Project created successfully with ID: {}", savedProject.getId());
            return mapToProjectResponse(savedProject);
        } catch (Exception e) {
            log.error("Error creating project: {}", e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to create project");
        }
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
            log.info("Project updated successfully with ID: {}", updatedProject.getId());
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

        if (!projectRepository.existsById(id)) {
            log.error("Project not found with ID: {}", id);
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found");
        }

        try {
            projectRepository.deleteById(id);
            log.info("Project deleted successfully with ID: {}", id);
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
        log.info("Adding members to project ID: {}", projectId);

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> {
                    log.error("Project not found with ID: {}", projectId);
                    return new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found");
                });

        // Verify all users exist
        request.getMemberIds().forEach(userId -> {
            try {
                if (!userClient.checkUserExists(userId).getBody()) {
                    log.error("User not found with ID: {}", userId);
                    throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found with ID: " + userId);
                }
            } catch (Exception e) {
                log.error("Error checking user existence: {}", e.getMessage(), e);
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to verify user existence");
            }
        });

        // Add new members
        List<Long> currentMembers = project.getMemberIds();
        request.getMemberIds().forEach(memberId -> {
            if (!currentMembers.contains(memberId)) {
                currentMembers.add(memberId);
            }
        });

        try {
            Project updatedProject = projectRepository.save(project);
            log.info("Members added successfully to project ID: {}", projectId);
            return mapToProjectResponse(updatedProject);
        } catch (Exception e) {
            log.error("Error adding members to project: {}", e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to add members to project");
        }
    }

    @Override
    @Transactional
    public ProjectResponse removeProjectMembers(Long projectId, List<Long> memberIds) {
        log.info("Removing members from project ID: {}", projectId);

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> {
                    log.error("Project not found with ID: {}", projectId);
                    return new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found");
                });

        // Remove members
        List<Long> currentMembers = project.getMemberIds();
        currentMembers.removeAll(memberIds);

        try {
            Project updatedProject = projectRepository.save(project);
            log.info("Members removed successfully from project ID: {}", projectId);
            return mapToProjectResponse(updatedProject);
        } catch (Exception e) {
            log.error("Error removing members from project: {}", e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to remove members from project");
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProjectResponse> getProjectsByMemberId(Long memberId) {
        log.info("Fetching projects for member ID: {}", memberId);

        try {
            List<Project> projects = projectRepository.findByMemberIdsContaining(memberId);
            List<ProjectResponse> responses = projects.stream()
                    .map(this::mapToProjectResponse)
                    .collect(Collectors.toList());
            log.info("Found {} projects for member ID: {}", responses.size(), memberId);
            return responses;
        } catch (Exception e) {
            log.error("Error fetching projects for member: {}", e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to fetch projects for member");
        }
    }
}
