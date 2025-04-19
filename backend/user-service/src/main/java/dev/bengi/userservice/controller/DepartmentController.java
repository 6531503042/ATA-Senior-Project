package dev.bengi.userservice.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import dev.bengi.userservice.domain.model.Department;
import dev.bengi.userservice.domain.payload.response.UserResponse;
import dev.bengi.userservice.repository.DepartmentRepository;
import dev.bengi.userservice.service.DepartmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/departments")
@RequiredArgsConstructor
@Slf4j
public class DepartmentController {

    private final DepartmentService departmentService;
    private final DepartmentRepository departmentRepository;

    @PostMapping
    public Mono<ResponseEntity<Department>> createDepartment(@Valid @RequestBody Department department) {
        return departmentService.createDepartment(department)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.status(HttpStatus.BAD_REQUEST).build());
    }

    @PutMapping("/{id}")
    public Mono<ResponseEntity<Department>> updateDepartment(
            @PathVariable Long id,
            @Valid @RequestBody Department department) {
        return departmentService.updateDepartment(id, department)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}")
    public Mono<ResponseEntity<Department>> getDepartment(@PathVariable Long id) {
        return departmentService.getDepartment(id)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @GetMapping
    public Mono<ResponseEntity<Flux<Department>>> getAllDepartments() {
        Flux<Department> departments = departmentService.getAllDepartments();
        return Mono.just(ResponseEntity.ok(departments));
    }

    @DeleteMapping("/{id}")
    public Mono<ResponseEntity<Void>> deleteDepartment(@PathVariable Long id) {
        return departmentService.deleteDepartment(id)
                .then(Mono.just(ResponseEntity.ok().<Void>build()));
    }
    
    @PostMapping("/{departmentId}/users/{userId}")
    public Mono<ResponseEntity<Department>> addUserToDepartment(
            @PathVariable Long departmentId,
            @PathVariable Long userId) {
        return departmentService.addUserToDepartment(departmentId, userId)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{departmentId}/users/{userId}")
    public Mono<ResponseEntity<Department>> removeUserFromDepartment(
            @PathVariable Long departmentId,
            @PathVariable Long userId) {
        return departmentService.removeUserFromDepartment(departmentId, userId)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/{departmentId}/users")
    public Mono<ResponseEntity<Flux<UserResponse>>> getUsersByDepartmentId(@PathVariable Long departmentId) {
        Flux<UserResponse> userResponses = departmentRepository.findUsersByDepartmentId(departmentId)
                .map(user -> UserResponse.builder()
                        .id(user.getId())
                        .username(user.getUsername())
                        .fullname(user.getFullname())
                        .email(user.getEmail())
                        .avatar(user.getAvatar())
                        .gender(user.getGender() != null ? user.getGender().name() : null)
                        .departmentId(departmentId)
                        .departmentName(user.getDepartment() != null ? user.getDepartment().getName() : null)
                        .build());
        
        return Mono.just(ResponseEntity.ok(userResponses));
    }
    
    @GetMapping("/{departmentId}/users/count")
    public Mono<ResponseEntity<Long>> countUsersByDepartmentId(@PathVariable Long departmentId) {
        return departmentRepository.countUsersByDepartmentId(departmentId)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.ok(0L));
    }
} 