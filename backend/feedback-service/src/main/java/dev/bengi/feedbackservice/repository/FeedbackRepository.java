package dev.bengi.feedbackservice.repository;

import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;

import dev.bengi.feedbackservice.domain.model.Feedback;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Repository
public interface FeedbackRepository extends R2dbcRepository<Feedback, Long> {
    
    @Query("SELECT * FROM feedbacks WHERE project_id = :projectId")
    Flux<Feedback> findByProjectId(Long projectId);
    
    @Query("SELECT f.* FROM feedbacks f " +
           "JOIN projects p ON f.project_id = p.id " +
           "JOIN project_members pm ON p.id = pm.project_id " +
           "WHERE pm.user_id = :userId")
    Flux<Feedback> findByProjectMemberId(Long userId);
    
    @Query("SELECT COUNT(*) FROM feedbacks WHERE active = true")
    Mono<Long> countActiveFeedbacks();
    
    @Query("SELECT * FROM feedbacks WHERE end_date > NOW() ORDER BY created_at DESC")
    Flux<Feedback> findRecentFeedbacks();
    
    @Query("SELECT AVG(EXTRACT(EPOCH FROM (s.submitted_at - f.created_at))) " +
           "FROM feedbacks f " +
           "JOIN feedback_submissions s ON f.id = s.feedback_id")
    Mono<Double> getAverageResponseTime();

    @Query("SELECT * FROM feedbacks WHERE department_id = :departmentId AND active = :active")
    Flux<Feedback> findByDepartmentIdAndActive(String departmentId, boolean active);
    
    @Query("SELECT * FROM feedbacks WHERE department_id = :departmentId AND is_department_wide = :isDepartmentWide AND active = :active")
    Flux<Feedback> findByDepartmentIdAndIsDepartmentWideAndActive(String departmentId, boolean isDepartmentWide, boolean active);
    
    @Query("SELECT f.* FROM feedbacks f " +
           "JOIN feedback_target_users tu ON f.id = tu.feedback_id " +
           "WHERE tu.user_id = :userId AND f.active = :active")
    Flux<Feedback> findByTargetUserIdsContainingAndActive(String userId, boolean active);
    
    @Query("SELECT f.* FROM feedbacks f " +
           "JOIN feedback_target_departments td ON f.id = td.feedback_id " +
           "WHERE td.department_id = :departmentId AND f.active = :active")
    Flux<Feedback> findByTargetDepartmentIdsContainingAndActive(String departmentId, boolean active);
    
    @Query("SELECT * FROM feedbacks WHERE status = :status AND active = :active")
    Flux<Feedback> findByStatusAndActive(String status, boolean active);
    
    @Query("SELECT * FROM feedbacks WHERE department_id = :departmentId AND status = :status AND active = :active")
    Flux<Feedback> findByDepartmentIdAndStatusAndActive(String departmentId, String status, boolean active);
    
    @Query("SELECT COUNT(*) FROM feedbacks WHERE active = true")
    Mono<Long> countByActiveTrue();
    
    @Query("SELECT * FROM feedbacks WHERE active = :active")
    Flux<Feedback> findByActive(boolean active);
}
