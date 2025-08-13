package dev.bengi.main.modules.department.repository;

import dev.bengi.main.modules.department.model.Department;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DepartmentRepository extends R2dbcRepository<Department, Long> {
}
