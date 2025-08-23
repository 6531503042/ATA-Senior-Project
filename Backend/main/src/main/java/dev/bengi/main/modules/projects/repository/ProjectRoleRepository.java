package dev.bengi.main.modules.projects.repository;

import dev.bengi.main.modules.projects.model.ProjectRole;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Repository
public interface ProjectRoleRepository extends R2dbcRepository<ProjectRole, Long> {
    
    @Query("SELECT * FROM project_roles WHERE name = :name")
    Mono<ProjectRole> findByName(String name);
    
    @Query("SELECT EXISTS(SELECT 1 FROM project_roles WHERE name = :name)")
    Mono<Boolean> existsByName(String name);
    
    @Query("SELECT * FROM project_roles ORDER BY is_default DESC, name")
    Flux<ProjectRole> findAllOrderByDefault();
    
    @Query("SELECT * FROM project_roles WHERE is_default = true LIMIT 1")
    Mono<ProjectRole> findDefaultRole();
}
