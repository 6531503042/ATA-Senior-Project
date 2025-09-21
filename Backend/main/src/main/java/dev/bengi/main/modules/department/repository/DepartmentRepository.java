package dev.bengi.main.modules.department.repository;

import dev.bengi.main.modules.department.model.Department;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import java.time.LocalDateTime;

@Repository
public interface DepartmentRepository extends R2dbcRepository<Department, Long> {

    Flux<Department> findByActive(boolean active);

    @Query("SELECT * FROM departments WHERE name = :name")
    Mono<Department> findByName(String name);

    // Dashboard stats methods
    @Query("SELECT COUNT(*) FROM departments WHERE active = true")
    Mono<Long> countActiveDepartments();

    @Query("SELECT COUNT(*) FROM departments WHERE created_at >= :from AND created_at < :to")
    Mono<Long> countNewDepartmentsBetween(LocalDateTime from, LocalDateTime to);
}
