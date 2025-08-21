package dev.bengi.main.modules.role.repository;

import dev.bengi.main.modules.role.model.Role;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.r2dbc.repository.Query;
import reactor.core.publisher.Mono;

@Repository
public interface RoleRepository extends R2dbcRepository<Role, Long> {
    @Query("SELECT * FROM roles WHERE name = :name")
    Mono<Role> findByName(String name);

    @Query("SELECT EXISTS(SELECT 1 FROM roles WHERE name = :name)")
    Mono<Boolean> existsByName(String name);
}
