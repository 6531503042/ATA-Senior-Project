package dev.bengi.main.modules.projects.controller;

import dev.bengi.main.modules.projects.dto.ProjectRequestDto;
import dev.bengi.main.modules.projects.dto.ProjectResponseDto;
import dev.bengi.main.modules.projects.dto.ProjectUpdateRequestDto;
import dev.bengi.main.modules.projects.service.ProjectService;
import dev.bengi.main.modules.projects.dto.ProjectMembersRequestDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Mono<ResponseEntity<ProjectResponseDto>> create(@RequestBody @Valid ProjectRequestDto req) {
        return projectService.create(req)
                .map(d -> ResponseEntity.status(HttpStatus.CREATED).body(d));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Mono<ResponseEntity<ProjectResponseDto>> update(@PathVariable Long id,
                                                           @RequestBody @Valid ProjectUpdateRequestDto req) {
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
    public Flux<ProjectResponseDto> list() {
        return projectService.getAll();
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


