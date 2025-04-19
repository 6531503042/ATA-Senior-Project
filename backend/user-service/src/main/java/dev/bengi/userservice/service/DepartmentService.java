package dev.bengi.userservice.service;

import java.util.List;

import dev.bengi.userservice.domain.model.Department;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface DepartmentService {
    @Transactional
    Mono<Department> createDepartment(Department department);

    Mono<Department> updateDepartment(Long id, Department department);

    Mono<Department> getDepartment(Long id);

    Flux<Department> getAllDepartments();

    Mono<Void> deleteDepartment(Long id);

    Mono<Department> addUserToDepartment(Long departmentId, Long userId);

    Mono<Department> removeUserFromDepartment(Long departmentId, Long userId);

//    Flux<Department> getActiveDepartments();
}