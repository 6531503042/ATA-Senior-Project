package dev.bengi.userservice.repository;

import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;

import dev.bengi.userservice.domain.model.User;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Repository
public interface UserRepository extends R2dbcRepository<User, Long> {
    
    @Query("SELECT * FROM users WHERE email = :email")
    Mono<User> findByEmail(String email);

    @Query("SELECT EXISTS(SELECT 1 FROM users WHERE email = :email)")
    Mono<Boolean> existsByEmail(String email);
    
    // For fetching users with all collections/relations
    @Query("""
        SELECT u.*, 
               r.id as role_id, 
               r.name as role_name, 
               r.permissions as role_permissions,
               d.id as department_id,
               d.name as department_name
        FROM users u
        LEFT JOIN roles r ON u.role_id = r.id
        LEFT JOIN departments d ON u.department_id = d.id
    """)
    Flux<User> findAllWithCollections();
    
    @Query("SELECT * FROM users WHERE department_id = :departmentId")
    Flux<User> findAllByDepartmentId(Long departmentId);

    /**
     * Find user by email with roles.
     * This query attempts to eagerly fetch the roles for proper authentication.
     */
    @Query("""
        SELECT u.*, 
               r.id as role_id, 
               r.name as role_name, 
               r.permissions as role_permissions
        FROM users u
        LEFT JOIN roles r ON u.role_id = r.id
        WHERE u.email = :email
    """)
    Mono<User> findByEmailWithRoles(String email);
}
