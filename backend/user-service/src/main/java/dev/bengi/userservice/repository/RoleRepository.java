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

    // Updated query with simple parameter binding
    @Query("SELECT * FROM roles WHERE name = :name")
    Mono<Role> findByName(String name);
    
    // Using method name derivation instead of custom query
    Mono<Role> findByNameEquals(String name);
    
    // Utility method for finding by RoleName enum
    default Mono<Role> findByRoleName(RoleName roleName) {
        return findByName(roleName.name());
    }
    
    // Get all roles
    @Query("SELECT * FROM roles")
    Flux<Role> findAllRoles();
}
