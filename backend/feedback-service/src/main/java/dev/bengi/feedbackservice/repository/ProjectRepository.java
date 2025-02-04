package dev.bengi.feedbackservice.repository;

import dev.bengi.feedbackservice.domain.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

    @Query("SELECT CASE WHEN COUNT(p) > 0 THEN true ELSE false END FROM Project p WHERE p.name = :name")
    boolean existsByNameIgnoreCase(String name);

    @Query("SELECT p FROM Project p WHERE p.id = :id")
    Project findAll(Long id);

    @Query("SELECT p FROM Project p JOIN p.memberIds m WHERE m = :memberId")
    List<Project> findByMemberIdsContaining(@Param("memberId") Long memberId);
}
