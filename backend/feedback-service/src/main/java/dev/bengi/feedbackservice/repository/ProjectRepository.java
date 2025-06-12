package dev.bengi.feedbackservice.repository;

import java.time.LocalDateTime;

import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import dev.bengi.feedbackservice.domain.model.Project;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Repository
public interface ProjectRepository extends R2dbcRepository<Project, Long> {

    @Query("SELECT EXISTS(SELECT 1 FROM projects WHERE name = :name)")
    Mono<Boolean> existsByName(String name);

    @Query("SELECT p.* FROM projects p JOIN project_members pm ON p.id = pm.project_id WHERE pm.user_id = :userId")
    Flux<Project> findByMemberId(Long userId);

    // Query to load project with member IDs
    @Query("SELECT p.*, pm.user_id AS member_id FROM projects p " +
           "LEFT JOIN project_members pm ON p.id = pm.project_id " +
           "WHERE p.id = :projectId")
    Flux<Project> findByIdWithMembers(Long projectId);

    @Query("SELECT COUNT(*) FROM projects WHERE project_end_date > CURRENT_TIMESTAMP")
    Mono<Long> countActiveProjects();
    
    @Query("SELECT COUNT(*) FROM projects WHERE project_end_date <= CURRENT_TIMESTAMP")
    Mono<Long> countCompletedProjects();

    Mono<Long> countByProjectEndDateAfter(LocalDateTime date);
    Mono<Long> countByProjectEndDateBefore(LocalDateTime date);
    
    @Query("SELECT COUNT(DISTINCT member_id) FROM project_members")
    Mono<Long> countTotalUniqueMembers();
    
    // New methods for dashboard
    @Query("SELECT * FROM projects WHERE project_end_date > CURRENT_TIMESTAMP ORDER BY created_at DESC")
    Flux<Project> findActiveProjectsOrderByCreatedAt();
    
    @Query("SELECT * FROM projects WHERE project_end_date <= CURRENT_TIMESTAMP ORDER BY project_end_date DESC")
    Flux<Project> findCompletedProjectsOrderByEndDate();
    
    @Query("SELECT COUNT(*) FROM projects WHERE created_at >= :startDate")
    Mono<Long> countProjectsCreatedAfterDate(@Param("startDate") LocalDateTime startDate);
    
    @Query("SELECT COUNT(*) FROM projects WHERE project_end_date BETWEEN :startDate AND :endDate")
    Mono<Long> countProjectsCompletedBetweenDates(
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );
    
    @Query("SELECT AVG(member_count) FROM (SELECT COUNT(member_id) as member_count FROM project_members GROUP BY project_id) as counts")
    Mono<Double> getAverageTeamSizeForActiveProjects();
    
    @Query("SELECT p.* FROM projects p JOIN (SELECT project_id, COUNT(member_id) as member_count FROM project_members GROUP BY project_id) as pm ON p.id = pm.project_id WHERE member_count > 0 AND p.project_end_date > CURRENT_TIMESTAMP")
    Flux<Project> findActiveProjectsWithMembers();
}
