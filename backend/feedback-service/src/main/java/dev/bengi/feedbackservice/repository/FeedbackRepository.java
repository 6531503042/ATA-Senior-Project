package dev.bengi.feedbackservice.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import dev.bengi.feedbackservice.domain.model.Feedback;

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

    List<Feedback> findByDepartmentIdAndActive(String departmentId, boolean active);
    List<Feedback> findByDepartmentIdAndIsDepartmentWideAndActive(String departmentId, boolean isDepartmentWide, boolean active);
    List<Feedback> findByTargetUserIdsContainingAndActive(String userId, boolean active);
    List<Feedback> findByTargetDepartmentIdsContainingAndActive(String departmentId, boolean active);
    List<Feedback> findByStatusAndActive(String status, boolean active);
    List<Feedback> findByDepartmentIdAndStatusAndActive(String departmentId, String status, boolean active);
    
    long countByActiveTrue();
    
    List<Feedback> findByActive(boolean active);
}
