package dev.bengi.main.modules.department.controller;

import dev.bengi.main.modules.department.dto.DepartmentRequestDto;
import dev.bengi.main.modules.department.dto.DepartmentResponseDto;
import dev.bengi.main.modules.department.dto.DepartmentUpdateRequestDto;
import dev.bengi.main.modules.department.service.DepartmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/departments")
public class DepartmentController {

    private final DepartmentService departmentService;

    @PostMapping
    public Mono<DepartmentResponseDto> create(@RequestBody @Valid DepartmentRequestDto req) {
        return departmentService.create(req);
    }

    @PutMapping("/{id}")
    public Mono<DepartmentResponseDto> update(@PathVariable Long id, @RequestBody @Valid DepartmentUpdateRequestDto req) {
        return departmentService.update(id, req);
    }

    @GetMapping("/{id}")
    public Mono<DepartmentResponseDto> get(@PathVariable Long id) {
        return departmentService.getById(id);
    }

    @GetMapping
    public Flux<DepartmentResponseDto> getAll() {
        return departmentService.listActive();
    }

    @DeleteMapping("/{id}")
    public Mono<Void> delete(@PathVariable Long id) {
        return departmentService.delete(id);
    }

}
