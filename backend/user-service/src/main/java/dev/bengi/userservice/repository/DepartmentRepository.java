package dev.bengi.userservice.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import dev.bengi.userservice.domain.model.Department;
import dev.bengi.userservice.domain.model.User;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, Long> {
    Optional<Department> findByName(String name);
    
    @Query("SELECT d FROM Department d WHERE d.id = :departmentId")
    List<Department> findByDepartmentId(@Param("departmentId") Long departmentId);
    
    List<Department> findByActive(boolean active);

    boolean existsByName(String name);
    
    @Query("SELECT u FROM User u WHERE u.department.id = :departmentId")
    List<User> findUsersByDepartmentId(@Param("departmentId") Long departmentId);
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.department.id = :departmentId")
    Long countUsersByDepartmentId(@Param("departmentId") Long departmentId);
} 