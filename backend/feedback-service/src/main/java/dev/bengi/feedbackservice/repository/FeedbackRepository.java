package dev.bengi.feedbackservice.repository;

import dev.bengi.feedbackservice.domain.model.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    List<Feedback> findByProjectId(Long projectId);
    
    @Query("SELECT f FROM Feedback f JOIN f.project p WHERE :userId MEMBER OF p.memberIds")
    List<Feedback> findByProjectMemberId(@Param("userId") Long userId);
    
    @Query("SELECT COUNT(f) FROM Feedback f WHERE f.active = true")
    Long countActiveFeedbacks();
    
    @Query("SELECT f FROM Feedback f WHERE f.endDate > CURRENT_TIMESTAMP ORDER BY f.createdAt DESC")
    List<Feedback> findRecentFeedbacks();
    
    @Query("SELECT AVG(DATEDIFF(second, f.createdAt, s.submittedAt)) " +
           "FROM Feedback f JOIN FeedbackSubmission s ON f.id = s.feedback.id")
    Double getAverageResponseTime();

    long countByActiveTrue();
}
