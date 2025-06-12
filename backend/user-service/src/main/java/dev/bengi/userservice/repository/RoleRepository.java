package dev.bengi.userservice.repository;

import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;

import dev.bengi.userservice.domain.enums.RoleName;
import dev.bengi.userservice.domain.model.Role;
import reactor.core.publisher.Mono;
import reactor.core.publisher.Flux;

@Repository
public interface RoleRepository extends R2dbcRepository<Role, Long> {

    // Updated query to include permissions
    @Query("SELECT id, name, description, permissions, created_at, updated_at FROM roles WHERE name = :name")
    Mono<Role> findByName(String name);
    
    // Using method name derivation instead of custom query
    Mono<Role> findByNameEquals(String name);
    
    // Utility method for finding by RoleName enum
    default Mono<Role> findByRoleName(RoleName roleName) {
        return findByName(roleName.name());
    }
    
    // Get all roles with permissions
    @Query("SELECT id, name, description, permissions, created_at, updated_at FROM roles ORDER BY id")
    Flux<Role> findAllRoles();
}
