package dev.bengi.feedbackservice.controller.admin;

import dev.bengi.feedbackservice.domain.payload.request.AddProjectMemberRequest;
import dev.bengi.feedbackservice.domain.payload.request.CreateProjectRequest;
import dev.bengi.feedbackservice.domain.payload.response.ProjectResponse;
import dev.bengi.feedbackservice.service.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/admin/projects")
@PreAuthorize("hasRole('ADMIN')")
public class ProjectController {
    private final ProjectService projectService;

    @PostMapping("/create")
    public ResponseEntity<ProjectResponse> createProject(@Valid @RequestBody CreateProjectRequest request) {
        try {
            log.info("Creating new project with name: {}", request.getName());
            ProjectResponse response = projectService.createProject(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            log.error("Error creating project: {}", e.getMessage(), e);
            throw e;
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProjectResponse> updateProject(
            @PathVariable Long id,
            @Valid @RequestBody CreateProjectRequest request) {
        try {
            log.info("Updating project with ID: {}", id);
            ProjectResponse response = projectService.updateProject(id, request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error updating project: {}", e.getMessage(), e);
            throw e;
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        try {
            log.info("Deleting project with ID: {}", id);
            projectService.deleteProject(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            log.error("Error deleting project: {}", e.getMessage(), e);
            throw e;
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<ProjectResponse>> getAllProjects() {
        try {
            log.info("Fetching all projects");
            List<ProjectResponse> responses = projectService.getAllProjects();
            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            log.error("Error fetching projects: {}", e.getMessage(), e);
            throw e;
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectResponse> getProjectById(@PathVariable Long id) {
        try {
            log.info("Fetching project with ID: {}", id);
            ProjectResponse response = projectService.getProjectById(id);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error fetching project: {}", e.getMessage(), e);
            throw e;
        }
    }

    @PostMapping("/{projectId}/members")
    public ResponseEntity<ProjectResponse> addProjectMembers(
            @PathVariable Long projectId,
            @Valid @RequestBody AddProjectMemberRequest request) {
        try {
            log.info("Adding members to project ID: {}", projectId);
            ProjectResponse response = projectService.addProjectMembers(projectId, request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error adding members to project: {}", e.getMessage(), e);
            throw e;
        }
    }

    @DeleteMapping("/{projectId}/members")
    public ResponseEntity<ProjectResponse> removeProjectMembers(
            @PathVariable Long projectId,
            @RequestBody List<Long> memberIds) {
        try {
            log.info("Removing members from project ID: {}", projectId);
            ProjectResponse response = projectService.removeProjectMembers(projectId, memberIds);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error removing members from project: {}", e.getMessage(), e);
            throw e;
        }
    }

    @GetMapping("/member/{memberId}")
    public ResponseEntity<List<ProjectResponse>> getProjectsByMemberId(@PathVariable Long memberId) {
        try {
            log.info("Fetching projects for member ID: {}", memberId);
            List<ProjectResponse> responses = projectService.getProjectsByMemberId(memberId);
            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            log.error("Error fetching projects for member: {}", e.getMessage(), e);
            throw e;
        }
    }
}
