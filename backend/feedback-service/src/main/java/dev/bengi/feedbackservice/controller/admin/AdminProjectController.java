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
import reactor.core.publisher.Mono;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/admin/projects")
@PreAuthorize("hasRole('ADMIN')")
public class AdminProjectController {
    private final ProjectService projectService;

    @PostMapping("/create")
    public Mono<ResponseEntity<ProjectResponse>> createProject(@Valid @RequestBody CreateProjectRequest request) {
        try {
            log.info("Creating new project with name: {}", request.getName());
            return projectService.createProject(request)
                .map(response -> ResponseEntity.status(HttpStatus.CREATED).body(response));
        } catch (Exception e) {
            log.error("Error creating project: {}", e.getMessage(), e);
            throw e;
        }
    }

    @PutMapping("/{id}")
    public Mono<ResponseEntity<ProjectResponse>> updateProject(
            @PathVariable Long id,
            @Valid @RequestBody CreateProjectRequest request) {
        try {
            log.info("Updating project with ID: {}", id);
            return projectService.updateProject(id, request)
                .map(ResponseEntity::ok);
        } catch (Exception e) {
            log.error("Error updating project: {}", e.getMessage(), e);
            throw e;
        }
    }

    @DeleteMapping("/{id}")
    public Mono<ResponseEntity<Void>> deleteProject(@PathVariable Long id) {
        try {
            log.info("Deleting project with ID: {}", id);
            return projectService.deleteProject(id)
                .then(Mono.just(ResponseEntity.noContent().<Void>build()));
        } catch (Exception e) {
            log.error("Error deleting project: {}", e.getMessage(), e);
            throw e;
        }
    }

    @GetMapping("/all")
    public Mono<ResponseEntity<List<ProjectResponse>>> getAllProjects() {
        try {
            log.info("Fetching all projects");
            return projectService.getAllProjects()
                .map(ResponseEntity::ok);
        } catch (Exception e) {
            log.error("Error fetching projects: {}", e.getMessage(), e);
            throw e;
        }
    }

    @GetMapping("/{id}")
    public Mono<ResponseEntity<ProjectResponse>> getProjectById(@PathVariable Long id) {
        try {
            log.info("Fetching project with ID: {}", id);
            return projectService.getProjectById(id)
                .map(ResponseEntity::ok);
        } catch (Exception e) {
            log.error("Error fetching project: {}", e.getMessage(), e);
            throw e;
        }
    }

    @PostMapping("/{projectId}/members")
    public Mono<ResponseEntity<ProjectResponse>> addProjectMembers(
            @PathVariable Long projectId,
            @Valid @RequestBody AddProjectMemberRequest request) {
        try {
            log.info("Adding members to project ID: {}", projectId);
            return projectService.addProjectMembers(projectId, request)
                .map(ResponseEntity::ok);
        } catch (Exception e) {
            log.error("Error adding members to project: {}", e.getMessage(), e);
            throw e;
        }
    }

    @DeleteMapping("/{projectId}/members")
    public Mono<ResponseEntity<ProjectResponse>> removeProjectMembers(
            @PathVariable Long projectId,
            @RequestBody List<Long> memberIds) {
        try {
            log.info("Removing members from project ID: {}", projectId);
            return projectService.removeProjectMembers(projectId, memberIds)
                .map(ResponseEntity::ok);
        } catch (Exception e) {
            log.error("Error removing members from project: {}", e.getMessage(), e);
            throw e;
        }
    }

    @GetMapping("/member/{memberId}")
    public Mono<ResponseEntity<List<ProjectResponse>>> getProjectsByMemberId(@PathVariable Long memberId) {
        try {
            log.info("Fetching projects for member ID: {}", memberId);
            return projectService.getProjectsByMemberId(memberId)
                .map(ResponseEntity::ok);
        } catch (Exception e) {
            log.error("Error fetching projects for member: {}", e.getMessage(), e);
            throw e;
        }
    }
}
