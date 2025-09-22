package dev.bengi.main.modules.projects.repository;

import dev.bengi.main.modules.projects.model.Project;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.r2dbc.repository.Query;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import java.time.LocalDateTime;

@Repository
public interface ProjectRepository extends R2dbcRepository<Project, Long> {
    @Query("SELECT * FROM projects ORDER BY created_at DESC LIMIT :limit")
    Flux<Project> findRecent(int limit);

    @Query("SELECT COUNT(*) FROM projects WHERE created_at >= :from AND created_at < :to")
    Mono<Long> countCreatedBetween(LocalDateTime from, LocalDateTime to);

    // Dashboard stats methods
    @Query("SELECT COUNT(*) FROM projects WHERE active = true")
    Mono<Long> countActiveProjects();

    // Employee: projects by member
    @Query("SELECT p.* FROM projects p JOIN project_members pm ON pm.project_id = p.id WHERE pm.user_id = :userId ORDER BY p.created_at DESC")
    Flux<Project> findByMemberUserId(Long userId);

    @Query("SELECT COUNT(DISTINCT p.id) FROM project_members pm JOIN projects p ON pm.project_id = p.id WHERE pm.user_id = :userId")
    Mono<Long> countProjectsByMember(Long userId);
}


