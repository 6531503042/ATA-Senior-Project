package dev.bengi.feedbackservice.controller.admin;

import dev.bengi.feedbackservice.domain.model.Project;
import dev.bengi.feedbackservice.domain.payload.request.CreateProjectRequest;
import dev.bengi.feedbackservice.domain.payload.response.ProjectResponse;
import dev.bengi.feedbackservice.exception.ProjectAlreadyExistsException;
import dev.bengi.feedbackservice.service.ProjectService;
import jakarta.validation.Valid;
import jakarta.validation.ValidationException;
import jakarta.ws.rs.NotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("api/v1/admin/project")
public class ProjectController {
    private final ProjectService projectService;

    @PostMapping("/create")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Project> createProject(
            @RequestBody @Valid CreateProjectRequest request) {
        try {
            var projectResponse = projectService.createProject(request);
            return ResponseEntity.ok(projectResponse);
        } catch (ValidationException e) {
            return ResponseEntity.badRequest().build();
        } catch (ProjectAlreadyExistsException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        } catch (Exception e) {
            log.error("Failed to create project", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

//    @GetMapping("/all")
//    @PreAuthorize("hasRole('ADMIN')")
//    @Transactional(readOnly = true)
//    public ResponseEntity<List<ProjectResponse>> getAllProject() {
//        try {
//            var projects = projectService.getProjects(0, 10);
//            List<ProjectResponse> projectResponses = projects.getContent().stream()
//                    .map(ProjectResponse::new)
//                    .toList();
//            return ResponseEntity.ok(projectResponses);
//        } catch (NotFoundException e) {
//            return ResponseEntity.notFound().build();
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
//        }
//    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Project>> getAllProject() {
        try {
            var projects = projectService.getProjects();
            return ResponseEntity.ok(projects);
        } catch (NotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    @GetMapping("/get/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Project> getProject(@PathVariable("id") Long id) {
        try {
            var project = projectService.getProjectById(id);
            return ResponseEntity.ok(project);
        } catch (NotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteProject(@PathVariable("id") Long id) {
        try {
            projectService.deleteProject(id);
            return ResponseEntity.ok().build();
        } catch (NotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    @PutMapping("/update/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Project> updateProject(@Valid @RequestBody Project pro, @PathVariable("id") Long id) {
        try {
            var projectResponse = projectService.updatedProject(id, pro);
            return ResponseEntity.ok(projectResponse);
        } catch (ValidationException e) {
            return ResponseEntity.badRequest().build();
        } catch (NotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Failed to update project", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }





}
