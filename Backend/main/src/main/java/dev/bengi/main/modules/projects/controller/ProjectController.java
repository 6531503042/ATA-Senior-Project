package dev.bengi.main.modules.projects.controller;

import dev.bengi.main.common.pagination.PageResponse;
import dev.bengi.main.common.pagination.PaginationService;
import dev.bengi.main.modules.projects.dto.ProjectRequestDto;
import dev.bengi.main.modules.projects.dto.ProjectResponseDto;
import dev.bengi.main.modules.projects.dto.ProjectUpdateRequestDto;
import dev.bengi.main.modules.projects.dto.ProjectCreateForm;
import dev.bengi.main.modules.projects.dto.ProjectUpdateForm;
import dev.bengi.main.modules.projects.service.ProjectService;
import dev.bengi.main.modules.projects.dto.ProjectMembersRequestDto;
import lombok.extern.slf4j.Slf4j;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
@Slf4j
public class ProjectController {

    private final ProjectService projectService;
    private final PaginationService paginationService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Mono<ResponseEntity<ProjectResponseDto>> create(@ModelAttribute ProjectCreateForm form) {
        
        log.info("=== PROJECT CREATE REQUEST ===");
        log.info("Name: {}", form.getName());
        log.info("Description: {}", form.getDescription());
        log.info("Start Date: {}", form.getStartDate());
        log.info("End Date: {}", form.getEndDate());
        log.info("Active: {}", form.isActive());
        log.info("Members: {}", form.getMembers());
        
        ProjectRequestDto req = new ProjectRequestDto(
            form.getName(),
            form.getDescription(),
            form.getStartDate() != null && !form.getStartDate().isEmpty() ? 
                java.time.LocalDateTime.parse(form.getStartDate() + "T00:00:00") : null,
            form.getEndDate() != null && !form.getEndDate().isEmpty() ? 
                java.time.LocalDateTime.parse(form.getEndDate() + "T00:00:00") : null,
            form.isActive(),
            form.getMembers() != null ? form.getMembers().stream().map(Long::parseLong).toList() : java.util.List.of()
        );
        
        log.info("Created ProjectRequestDto: {}", req);
        
        return projectService.create(req)
                .map(d -> {
                    log.info("Project created successfully: {}", d);
                    return ResponseEntity.status(HttpStatus.CREATED).body(d);
                });
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Mono<ResponseEntity<ProjectResponseDto>> update(@PathVariable Long id,
                                                           @ModelAttribute ProjectUpdateForm form) {
        
        ProjectUpdateRequestDto req = new ProjectUpdateRequestDto(
            form.getName(),
            form.getDescription(),
            form.getStartDate() != null && !form.getStartDate().isEmpty() ? 
                java.time.LocalDateTime.parse(form.getStartDate() + "T00:00:00") : null,
            form.getEndDate() != null && !form.getEndDate().isEmpty() ? 
                java.time.LocalDateTime.parse(form.getEndDate() + "T00:00:00") : null,
            form.isActive(),
            form.getMembers() != null ? form.getMembers().stream().map(Long::parseLong).toList() : java.util.List.of(),
            form.getExistingMembers() != null ? form.getExistingMembers().stream().map(Long::parseLong).toList() : java.util.List.of()
        );
        
        return projectService.update(id, req)
                .map(ResponseEntity::ok);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public Mono<ResponseEntity<ProjectResponseDto>> get(@PathVariable Long id) {
        return projectService.getById(id).map(ResponseEntity::ok);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public Mono<ResponseEntity<PageResponse<ProjectResponseDto>>> list(ServerWebExchange exchange) {
        var pageRequest = paginationService.parsePageRequest(exchange);
        return projectService.getAll(pageRequest)
                .map(ResponseEntity::ok);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Mono<ResponseEntity<Void>> delete(@PathVariable Long id) {
        return projectService.delete(id).thenReturn(ResponseEntity.noContent().build());
    }

    @PostMapping("/{id}/members")
    @PreAuthorize("hasRole('ADMIN')")
    public Mono<ResponseEntity<Void>> addMembers(@PathVariable Long id, @RequestBody @Valid ProjectMembersRequestDto req) {
        return projectService.addMembers(id, req.memberIds()).thenReturn(ResponseEntity.noContent().build());
    }

    @DeleteMapping("/{id}/members")
    @PreAuthorize("hasRole('ADMIN')")
    public Mono<ResponseEntity<Void>> removeMembers(@PathVariable Long id, @RequestBody @Valid ProjectMembersRequestDto req) {
        return projectService.removeMembers(id, req.memberIds()).thenReturn(ResponseEntity.noContent().build());
    }
}


