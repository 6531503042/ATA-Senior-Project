package dev.bengi.userservice.service.impl;

import java.util.Set;

import dev.bengi.userservice.exception.DepartmentNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import dev.bengi.userservice.domain.model.Department;
import dev.bengi.userservice.domain.model.User;
import dev.bengi.userservice.repository.DepartmentRepository;
import dev.bengi.userservice.repository.UserRepository;
import dev.bengi.userservice.service.DepartmentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Slf4j
@Service
@RequiredArgsConstructor
public class DepartmentServiceImpl implements DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public Mono<Department> createDepartment(Department department) {
        return departmentRepository.save(department)
                .switchIfEmpty(Mono.error(new DepartmentNotFoundException("Failed to create department")))
                .doOnSuccess(savedDepartment -> log.info("Department created : {}", savedDepartment))
                .doOnError(e -> log.error("Error creating Department : {}", e.getMessage()));
    }

    @Override
    public Mono<Department> updateDepartment(Long id, Department department) {
        log.info("Updating department with id: {}", id);
        return departmentRepository.findById(id)
                .switchIfEmpty(Mono.error(new DepartmentNotFoundException("Department not found with id: " + id)))
                .flatMap(existingDepartment -> {
                    existingDepartment.setName(department.getName());
                    existingDepartment.setDescription(department.getDescription());
                    existingDepartment.setActive(department.isActive());
                    return departmentRepository.save(existingDepartment);
                });
    }

    @Override
    public Mono<Department> getDepartment(Long id) {
        log.info("Fetching department with id: {}", id);
        return departmentRepository.findById(id)
                .switchIfEmpty(Mono.error(new DepartmentNotFoundException("Department not found with id: " + id)));
    }

    @Override
    public Flux<Department> getAllDepartments() {
        log.info("Fetching all departments");
        return departmentRepository.findAll();
    }

    @Override
    public Mono<Void> deleteDepartment(Long id) {
        log.info("Deleting department with id: {}", id);
        return departmentRepository.findById(id)
                .switchIfEmpty(Mono.error(new DepartmentNotFoundException("Department not found with id: " + id)))
                .flatMap(department -> {
                    // In reactive programming, we need to update users first then delete the department
                    return departmentRepository.findUsersByDepartmentId(id)
                            .flatMap(user -> {
                                user.setDepartment(null);
                                return userRepository.save(user);
                            })
                            .then(departmentRepository.delete(department));
                });
    }

    @Override
    public Mono<Department> addUserToDepartment(Long departmentId, Long userId) {
        log.info("Adding user {} to department {}", userId, departmentId);
        return departmentRepository.findById(departmentId)
                .switchIfEmpty(Mono.error(new DepartmentNotFoundException("Department not found with id: " + departmentId)))
                .flatMap(department -> userRepository.findById(userId)
                        .switchIfEmpty(Mono.error(new RuntimeException("User not found with id: " + userId)))
                        .flatMap(user -> {
                            user.setDepartment(department);
                            return userRepository.save(user)
                                    .thenReturn(department);
                        }));
    }

    @Override
    public Mono<Department> removeUserFromDepartment(Long departmentId, Long userId) {
        log.info("Removing user {} from department {}", userId, departmentId);
        return departmentRepository.findById(departmentId)
                .switchIfEmpty(Mono.error(new DepartmentNotFoundException("Department not found with id: " + departmentId)))
                .flatMap(department -> userRepository.findById(userId)
                        .switchIfEmpty(Mono.error(new RuntimeException("User not found with id: " + userId)))
                        .flatMap(user -> {
                            if (user.getDepartment() != null && user.getDepartment().getId().equals(departmentId)) {
                                user.setDepartment(null);
                                return userRepository.save(user)
                                        .thenReturn(department);
                            }
                            return Mono.just(department);
                        }));
    }

//    @Override
//    public Flux<Department> getActiveDepartments() {
//        log.info("Fetching all active departments");
//        return departmentRepository.findByActive(true)
//                .doOnNext(department -> {
//                    // Initialize the users collection for each department
//                    department.getUsers().size();
//                });
//    }
} 