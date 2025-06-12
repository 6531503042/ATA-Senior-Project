package dev.bengi.userservice.controller;

import dev.bengi.userservice.domain.model.Department;
import dev.bengi.userservice.domain.model.User;
import dev.bengi.userservice.domain.payload.response.UserResponse;
import dev.bengi.userservice.repository.DepartmentRepository;
import dev.bengi.userservice.service.DepartmentService;
import dev.bengi.userservice.http.HeaderGenerator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/departments")
@RequiredArgsConstructor
@Slf4j
public class DepartmentController {

    private final DepartmentService departmentService;
    private final DepartmentRepository departmentRepository;
    private final HeaderGenerator headerGenerator;

    @PostMapping
    public Mono<ResponseEntity<Department>> createDepartment(@Valid @RequestBody Department department) {
        return departmentService.createDepartment(department)
                .map(savedDepartment -> ResponseEntity.ok()
                        .headers(headerGenerator.getHeadersForSuccessPostMethod(savedDepartment.getId()))
                        .body(savedDepartment));
    }

    @PutMapping("/{id}")
    public Mono<ResponseEntity<Department>> updateDepartment(
            @PathVariable Long id,
            @Valid @RequestBody Department department) {
        return departmentService.updateDepartment(id, department)
                .map(updatedDepartment -> ResponseEntity.ok()
                        .headers(headerGenerator.getHeadersForSuccessGetMethod())
                        .body(updatedDepartment));
    }

    @GetMapping("/{id}")
    public Mono<ResponseEntity<Department>> getDepartment(@PathVariable Long id) {
        return departmentService.getDepartment(id)
                .map(department -> ResponseEntity.ok()
                        .headers(headerGenerator.getHeadersForSuccessGetMethod())
                        .body(department));
    }

    @GetMapping
    public Mono<ResponseEntity<Flux<Department>>> getAllDepartments() {
        return Mono.just(ResponseEntity.ok()
                .headers(headerGenerator.getHeadersForSuccessGetMethod())
                .body(departmentService.getAllDepartments()));
    }

    @DeleteMapping("/{id}")
    public Mono<ResponseEntity<Void>> deleteDepartment(@PathVariable Long id) {
        return departmentService.deleteDepartment(id)
                .then(Mono.just(ResponseEntity.noContent()
                        .headers(headerGenerator.getHeadersForSuccessGetMethod())
                        .build()));
    }

    @PostMapping("/{departmentId}/users/{userId}")
    public Mono<ResponseEntity<Department>> addUserToDepartment(
            @PathVariable Long departmentId,
            @PathVariable Long userId) {
        return departmentService.addUserToDepartment(departmentId, userId)
                .map(department -> ResponseEntity.ok()
                        .headers(headerGenerator.getHeadersForSuccessGetMethod())
                        .body(department));
    }

    @DeleteMapping("/{departmentId}/users/{userId}")
    public Mono<ResponseEntity<Department>> removeUserFromDepartment(
            @PathVariable Long departmentId,
            @PathVariable Long userId) {
        return departmentService.removeUserFromDepartment(departmentId, userId)
                .map(department -> ResponseEntity.ok()
                        .headers(headerGenerator.getHeadersForSuccessGetMethod())
                        .body(department));
    }

    @GetMapping("/{departmentId}/users")
    public Mono<ResponseEntity<Flux<UserResponse>>> getUsersByDepartmentId(@PathVariable Long departmentId) {
        return Mono.just(ResponseEntity.ok()
                .headers(headerGenerator.getHeadersForSuccessGetMethod())
                .body(departmentRepository.findUsersByDepartmentId(departmentId)
                        .map(user -> UserResponse.builder()
                                .id(user.getId())
                                .email(user.getEmail())
                                .fullname(user.getFullname())
                                .department(UserResponse.DepartmentInfo.builder()
                                        .departmentId(departmentId)
                                        .departmentName(user.getDepartment() != null ? user.getDepartment().getName() : null)
                                        .build())
                                .build())));
    }

    @GetMapping("/{departmentId}/users/count")
    public Mono<ResponseEntity<Long>> countUsersByDepartmentId(@PathVariable Long departmentId) {
        return departmentRepository.countUsersByDepartmentId(departmentId)
                .map(count -> ResponseEntity.ok()
                        .headers(headerGenerator.getHeadersForSuccessGetMethod())
                        .body(count));
    }
} 