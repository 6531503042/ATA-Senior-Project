package dev.bengi.userservice.repository;

import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;

import dev.bengi.userservice.domain.model.Department;
import dev.bengi.userservice.domain.model.User;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Repository
public interface DepartmentRepository extends R2dbcRepository<Department, Long> {

    Flux<Department> findByActive(boolean active);
    
    @Query("SELECT id, name, description, active, created_at, updated_at FROM departments WHERE name = :name")
    Mono<Department> findByName(String name);
    
    @Query("SELECT * FROM users WHERE department_id = :departmentId")
    Flux<User> findUsersByDepartmentId(Long departmentId);
    
    @Query("SELECT COUNT(*) FROM users WHERE department_id = :departmentId")
    Mono<Long> countUsersByDepartmentId(Long departmentId);
} 