package dev.bengi.feedbackservice.repository;

import dev.bengi.feedbackservice.domain.model.FeedbackSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

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
} 