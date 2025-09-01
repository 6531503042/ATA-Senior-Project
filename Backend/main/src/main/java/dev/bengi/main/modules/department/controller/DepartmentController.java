package dev.bengi.main.modules.department.controller;

import dev.bengi.main.common.pagination.PageResponse;
import dev.bengi.main.common.pagination.PaginationService;
import dev.bengi.main.modules.department.dto.DepartmentRequestDto;
import dev.bengi.main.modules.department.dto.DepartmentResponseDto;
import dev.bengi.main.modules.department.dto.DepartmentUpdateRequestDto;
import dev.bengi.main.modules.department.service.DepartmentService;
import dev.bengi.main.modules.user.dto.UserResponseDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/departments")
public class DepartmentController {

    private final DepartmentService departmentService;
    private final PaginationService paginationService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public Mono<DepartmentResponseDto> create(@RequestBody @Valid DepartmentRequestDto req) {
        return departmentService.create(req);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public Mono<DepartmentResponseDto> update(@PathVariable Long id, @RequestBody @Valid DepartmentUpdateRequestDto req) {
        return departmentService.update(id, req);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public Mono<DepartmentResponseDto> get(@PathVariable Long id) {
        return departmentService.getById(id);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public Mono<ResponseEntity<PageResponse<DepartmentResponseDto>>> getAll(ServerWebExchange exchange) {
        var pageRequest = paginationService.parsePageRequest(exchange);
        return departmentService.listActive(pageRequest)
                .map(ResponseEntity::ok);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public Mono<Void> delete(@PathVariable Long id) {
        return departmentService.delete(id);
    }

    @GetMapping("/{id}/members")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public Mono<ResponseEntity<PageResponse<UserResponseDto>>> getDepartmentMembers(
            @PathVariable Long id, 
            ServerWebExchange exchange) {
        var pageRequest = paginationService.parsePageRequest(exchange);
        return departmentService.getDepartmentMembers(id, pageRequest)
                .map(ResponseEntity::ok);
    }

}
