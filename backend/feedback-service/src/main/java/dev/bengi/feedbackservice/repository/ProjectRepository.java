package dev.bengi.feedbackservice.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import dev.bengi.feedbackservice.domain.model.Project;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

    @Query("SELECT CASE WHEN COUNT(p) > 0 THEN true ELSE false END FROM Project p WHERE p.name = :name")
    boolean existsByNameIgnoreCase(@Param("name") String name);

    @Query("SELECT COUNT(p) FROM Project p WHERE p.projectEndDate > CURRENT_TIMESTAMP")
    Long countActiveProjects();
    
    @Query("SELECT COUNT(p) FROM Project p WHERE p.projectEndDate <= CURRENT_TIMESTAMP")
    Long countCompletedProjects();

    long countByProjectEndDateAfter(LocalDateTime date);
    long countByProjectEndDateBefore(LocalDateTime date);
    
    @Query("SELECT COUNT(DISTINCT m) FROM Project p JOIN p.memberIds m")
    long countTotalUniqueMembers();
    
    // New methods for dashboard
    @Query("SELECT p FROM Project p WHERE p.projectEndDate > CURRENT_TIMESTAMP ORDER BY p.createdAt DESC")
    List<Project> findActiveProjectsOrderByCreatedAt();
    
    @Query("SELECT p FROM Project p WHERE p.projectEndDate <= CURRENT_TIMESTAMP ORDER BY p.projectEndDate DESC")
    List<Project> findCompletedProjectsOrderByEndDate();
    
    @Query("SELECT COUNT(p) FROM Project p WHERE p.createdAt >= :startDate")
    long countProjectsCreatedAfterDate(@Param("startDate") LocalDateTime startDate);
    
    @Query("SELECT COUNT(p) FROM Project p WHERE p.projectEndDate BETWEEN :startDate AND :endDate")
    long countProjectsCompletedBetweenDates(
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );
    
    @Query("SELECT AVG(SIZE(p.memberIds)) FROM Project p WHERE p.projectEndDate > CURRENT_TIMESTAMP")
    Double getAverageTeamSizeForActiveProjects();
    
    @Query("SELECT p FROM Project p WHERE SIZE(p.memberIds) > 0 AND p.projectEndDate > CURRENT_TIMESTAMP")
    List<Project> findActiveProjectsWithMembers();
}
