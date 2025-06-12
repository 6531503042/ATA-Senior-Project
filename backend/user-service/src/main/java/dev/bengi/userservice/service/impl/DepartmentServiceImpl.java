package dev.bengi.userservice.service.impl;

import dev.bengi.userservice.domain.model.Department;
import dev.bengi.userservice.domain.payload.response.DepartmentWithUsersDTO;
import dev.bengi.userservice.domain.payload.response.UserResponse;
import dev.bengi.userservice.exception.ErrorCode;
import dev.bengi.userservice.exception.GlobalServiceException;
import dev.bengi.userservice.repository.DepartmentRepository;
import dev.bengi.userservice.repository.UserRepository;
import dev.bengi.userservice.service.DepartmentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
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
                .doOnSuccess(savedDepartment -> log.info("Department created: {}", savedDepartment))
                .doOnError(e -> log.error("Error creating Department: {}", e.getMessage()))
                .switchIfEmpty(Mono.error(new GlobalServiceException(ErrorCode.DEPARTMENT_NOT_FOUND)));
    }

    @Override
    public Mono<Department> updateDepartment(Long id, Department department) {
        log.info("Updating department with id: {}", id);
        return departmentRepository.findById(id)
                .switchIfEmpty(Mono.error(new GlobalServiceException(ErrorCode.DEPARTMENT_NOT_FOUND)))
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
                .switchIfEmpty(Mono.error(new GlobalServiceException(ErrorCode.DEPARTMENT_NOT_FOUND)));
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
                .switchIfEmpty(Mono.error(new GlobalServiceException(ErrorCode.DEPARTMENT_NOT_FOUND)))
                .flatMap(department -> {
                    // we need to update users first then delete the department
                    return departmentRepository.findUsersByDepartmentId(id)
                            .flatMap(user -> {
                                user.setDepartmentId(null);
                                return userRepository.save(user);
                            })
                            .then(departmentRepository.delete(department));
                });
    }

    @Override
    public Mono<Department> addUserToDepartment(Long departmentId, Long userId) {
        log.info("Adding user {} to department {}", userId, departmentId);
        return departmentRepository.findById(departmentId)
                .switchIfEmpty(Mono.error(new GlobalServiceException(ErrorCode.DEPARTMENT_NOT_FOUND)))
                .flatMap(department -> userRepository.findById(userId)
                        .switchIfEmpty(Mono.error(new GlobalServiceException(ErrorCode.USER_NOT_FOUND)))
                        .flatMap(user -> {
                            user.setDepartmentId(department.getId());
                            return userRepository.save(user)
                                    .thenReturn(department);
                        }));
    }

    @Override
    public Mono<Department> removeUserFromDepartment(Long departmentId, Long userId) {
        log.info("Removing user {} from department {}", userId, departmentId);
        return departmentRepository.findById(departmentId)
                .switchIfEmpty(Mono.error(new GlobalServiceException(ErrorCode.DEPARTMENT_NOT_FOUND)))
                .flatMap(department -> userRepository.findById(userId)
                        .switchIfEmpty(Mono.error(new GlobalServiceException(ErrorCode.USER_NOT_FOUND)))
                        .flatMap(user -> {
                            if (user.getDepartmentId() != null && user.getDepartmentId().equals(departmentId)) {
                                user.setDepartmentId(null);
                                return userRepository.save(user)
                                        .thenReturn(department);
                            }
                            return Mono.just(department);
                        }));
    }

    @Override
    public Mono<DepartmentWithUsersDTO> getDepartmentWithUsers(Long departmentId) {
        return departmentRepository.findById(departmentId)
                .switchIfEmpty(Mono.error(new GlobalServiceException(ErrorCode.DEPARTMENT_NOT_FOUND)))
                .flatMap(department ->
                        userRepository.findAllByDepartmentId(department.getId())
                                .map(UserResponse::fromUser)
                                .collectList()
                                .map(users -> DepartmentWithUsersDTO.builder()
                                        .id(department.getId())
                                        .name(department.getName())
                                        .description(department.getDescription())
                                        .active(department.isActive())
                                        .createdAt(department.getCreatedAt())
                                        .updatedAt(department.getUpdatedAt())
                                        .users(users)
                                        .build())
                );
    }
} 