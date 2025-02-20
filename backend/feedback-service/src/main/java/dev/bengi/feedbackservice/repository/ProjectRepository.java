package dev.bengi.feedbackservice.repository;

import dev.bengi.feedbackservice.domain.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

    @Query("SELECT CASE WHEN COUNT(p) > 0 THEN true ELSE false END FROM Project p WHERE p.name = :name")
    boolean existsByNameIgnoreCase(String name);

    @Query("SELECT COUNT(p) FROM Project p WHERE p.projectEndDate > CURRENT_TIMESTAMP")
    Long countActiveProjects();
    
    @Query("SELECT COUNT(p) FROM Project p WHERE p.projectEndDate <= CURRENT_TIMESTAMP")
    Long countCompletedProjects();

    long countByProjectEndDateAfter(LocalDateTime date);
    long countByProjectEndDateBefore(LocalDateTime date);
    
    @Query("SELECT COUNT(DISTINCT m) FROM Project p JOIN p.memberIds m")
    long countTotalUniqueMembers();
}
