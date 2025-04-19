package dev.bengi.feedbackservice.controller;

import dev.bengi.feedbackservice.domain.payload.request.AddProjectMemberRequest;
import dev.bengi.feedbackservice.domain.payload.request.CreateProjectRequest;
import dev.bengi.feedbackservice.domain.payload.response.ProjectResponse;
import dev.bengi.feedbackservice.service.ProjectService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import jakarta.validation.Valid;
import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/projects")
@PreAuthorize("hasRole('ADMIN')")
public class ProjectController {

    private final ProjectService projectService;

    @PostMapping("/create")
    public Mono<ResponseEntity<ProjectResponse>> createProject(@Valid @RequestBody CreateProjectRequest request) {
        log.info("Creating new project: {}", request.getName());
        return projectService.createProject(request)
                .map(response -> ResponseEntity.status(HttpStatus.CREATED).body(response));
    }

    @PutMapping("/{id}")
    public Mono<ResponseEntity<ProjectResponse>> updateProject(
            @PathVariable Long id,
            @Valid @RequestBody CreateProjectRequest request) {
        log.info("Updating project with ID: {}", id);
        return projectService.updateProject(id, request)
                .map(response -> ResponseEntity.ok(response));
    }

    @DeleteMapping("/{id}")
    public Mono<ResponseEntity<Void>> deleteProject(@PathVariable Long id) {
        log.info("Deleting project with ID: {}", id);
        return projectService.deleteProject(id)
                .then(Mono.just(ResponseEntity.noContent().<Void>build()));
    }

    @GetMapping("/all")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public Mono<ResponseEntity<List<ProjectResponse>>> getAllProjects() {
        log.info("Fetching all projects");
        return projectService.getAllProjects()
                .map(ResponseEntity::ok);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public Mono<ResponseEntity<ProjectResponse>> getProjectById(@PathVariable Long id) {
        log.info("Fetching project with ID: {}", id);
        return projectService.getProjectById(id)
                .map(ResponseEntity::ok);
    }

    @PostMapping("/{projectId}/members")
    public Mono<ResponseEntity<ProjectResponse>> addProjectMembers(
            @PathVariable Long projectId,
            @Valid @RequestBody AddProjectMemberRequest request) {
        log.info("Adding members to project ID: {}", projectId);
        return projectService.addProjectMembers(projectId, request)
                .map(ResponseEntity::ok);
    }

    @DeleteMapping("/{projectId}/members")
    public Mono<ResponseEntity<ProjectResponse>> removeProjectMembers(
            @PathVariable Long projectId,
            @RequestBody List<Long> memberIds) {
        log.info("Removing members from project ID: {}", projectId);
        return projectService.removeProjectMembers(projectId, memberIds)
                .map(ResponseEntity::ok);
    }

    @GetMapping("/member/{memberId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public Mono<ResponseEntity<List<ProjectResponse>>> getProjectsByMemberId(@PathVariable Long memberId) {
        log.info("Fetching projects for member ID: {}", memberId);
        return projectService.getProjectsByMemberId(memberId)
                .map(ResponseEntity::ok);
    }
} 