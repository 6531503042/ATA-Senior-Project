package dev.bengi.feedbackservice.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import dev.bengi.feedbackservice.domain.model.FeedbackSubmission;

@Repository
public interface FeedbackSubmissionRepository extends JpaRepository<FeedbackSubmission, Long> {
    List<FeedbackSubmission> findBySubmittedBy(String userId);
    List<FeedbackSubmission> findByFeedbackId(Long feedbackId);
    List<FeedbackSubmission> findByReviewedFalse();
    boolean existsByFeedbackIdAndSubmittedBy(Long feedbackId, String submittedBy);
    long countByReviewedFalse();
    long countByFeedback_Active(boolean active);
    @Query("SELECT AVG(SIZE(fs.responses)) FROM FeedbackSubmission fs")
    Double getAverageResponsesPerFeedback();

    @Query("SELECT COUNT(fs) FROM FeedbackSubmission fs WHERE KEY(fs.responses) = :questionId")
    long countResponsesForQuestion(@Param("questionId") Long questionId);
    
    @Query("SELECT AVG(CASE WHEN fs.privacyLevel = 'ANONYMOUS' THEN 1 ELSE 0 END) FROM FeedbackSubmission fs")
    Double getAnonymousSubmissionRate();
    
    @Query("SELECT COUNT(fs) FROM FeedbackSubmission fs WHERE fs.submittedAt >= :startDate")
    long countSubmissionsAfterDate(@Param("startDate") LocalDateTime startDate);
    
    @Query("SELECT COUNT(fs) FROM FeedbackSubmission fs WHERE fs.feedback.id = :feedbackId")
    long countByFeedbackId(@Param("feedbackId") Long feedbackId);

    @Query("SELECT AVG(CAST(fs.responses[:questionId] AS double)) FROM FeedbackSubmission fs WHERE KEY(fs.responses) = :questionId")
    Double getAverageScoreForQuestion(@Param("questionId") Long questionId);
    
    // New methods for dashboard
    @Query("SELECT fs FROM FeedbackSubmission fs WHERE fs.submittedAt BETWEEN :startDate AND :endDate")
    List<FeedbackSubmission> findSubmissionsBetweenDates(
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );
    
    @Query("SELECT COUNT(DISTINCT fs.submittedBy) FROM FeedbackSubmission fs WHERE fs.submittedAt >= :startDate")
    long countUniqueSubmittersAfterDate(@Param("startDate") LocalDateTime startDate);
    
    @Query("SELECT AVG(CAST(r AS double)) FROM FeedbackSubmission fs JOIN fs.responses r WHERE fs.submittedAt >= :startDate")
    Double getAverageScoreAfterDate(@Param("startDate") LocalDateTime startDate);
    
    @Query("SELECT COUNT(fs) FROM FeedbackSubmission fs WHERE fs.submittedAt >= :startDate AND SIZE(fs.responses) >= :minResponses")
    long countCompletedSubmissionsAfterDate(
        @Param("startDate") LocalDateTime startDate,
        @Param("minResponses") int minResponses
    );
} 