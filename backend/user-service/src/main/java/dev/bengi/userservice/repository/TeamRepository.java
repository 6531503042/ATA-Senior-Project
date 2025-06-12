package dev.bengi.userservice.repository;

import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;

import dev.bengi.userservice.domain.model.Team;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Repository
public interface TeamRepository extends R2dbcRepository<Team, Long> {
    
    @Query("SELECT * FROM teams WHERE department_id = :departmentId")
    Flux<Team> findByDepartmentId(Long departmentId);
    
    @Query("SELECT * FROM teams WHERE name = :name")
    Mono<Team> findByName(String name);
} 