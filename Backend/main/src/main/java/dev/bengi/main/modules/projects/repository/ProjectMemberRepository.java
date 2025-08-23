package dev.bengi.main.modules.projects.repository;

import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface ProjectMemberRepository extends R2dbcRepository<dev.bengi.main.modules.projects.repository.ProjectMemberRepository.ProjectMemberRow, Long> {

    @Query("SELECT user_id FROM project_members WHERE project_id = :projectId")
    Flux<Long> findUserIdsByProjectId(Long projectId);

    @Query("INSERT INTO project_members(project_id, user_id) VALUES (:projectId, :userId) ON CONFLICT DO NOTHING")
    Flux<Void> addMember(Long projectId, Long userId);

    @Query("DELETE FROM project_members WHERE project_id = :projectId AND user_id = :userId")
    Flux<Void> removeMember(Long projectId, Long userId);

    @Query("SELECT COUNT(*) FROM project_members WHERE project_id = :projectId")
    Mono<Long> countMembersForProject(Long projectId);

    // Advanced dashboard metrics queries
    @Query("SELECT COUNT(DISTINCT user_id) FROM project_members")
    Mono<Long> countDistinctMembers();

    @Query("SELECT COUNT(DISTINCT user_id) FROM project_members pm JOIN projects p ON pm.project_id = p.id WHERE p.created_at >= :from AND p.created_at < :to")
    Mono<Long> countNewMembersBetween(java.time.LocalDateTime from, java.time.LocalDateTime to);

    // Dummy row type for R2dbcRepository requirement; we use custom queries above
    class ProjectMemberRow {
        public Long id; // not used
    }
}


