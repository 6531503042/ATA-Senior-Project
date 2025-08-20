package dev.bengi.main.modules.feedback.repository;

import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import reactor.core.publisher.Flux;

public interface FeedbackTargetRepository extends R2dbcRepository<FeedbackTargetRepository.Row, Long> {

    @Query("INSERT INTO feedback_target_users(feedback_id, user_id) VALUES (:feedbackId, :userId) ON CONFLICT DO NOTHING")
    Flux<Void> addTargetUser(Long feedbackId, Long userId);

    @Query("DELETE FROM feedback_target_users WHERE feedback_id = :feedbackId AND user_id = :userId")
    Flux<Void> removeTargetUser(Long feedbackId, Long userId);

    @Query("INSERT INTO feedback_target_departments(feedback_id, department_id) VALUES (:feedbackId, :departmentId) ON CONFLICT DO NOTHING")
    Flux<Void> addTargetDepartment(Long feedbackId, Long departmentId);

    @Query("DELETE FROM feedback_target_departments WHERE feedback_id = :feedbackId AND department_id = :departmentId")
    Flux<Void> removeTargetDepartment(Long feedbackId, Long departmentId);

    class Row { public Long id; }
}


