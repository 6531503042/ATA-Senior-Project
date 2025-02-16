package dev.bengi.feedbackservice.repository;

import dev.bengi.feedbackservice.domain.model.FeedbackScore;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedbackScoreRepository extends JpaRepository<FeedbackScore, Long> {
    List<FeedbackScore> findBySubmissionId(Long submissionId);
    
    @Query("SELECT AVG(fs.satisfactionScore) FROM FeedbackScore fs")
    Double getAverageSatisfactionScore();
    
    @Query("SELECT fs FROM FeedbackScore fs ORDER BY fs.scoredAt DESC LIMIT 10")
    List<FeedbackScore> findRecentScores();
    
    @Query("SELECT q.category, AVG(fs.satisfactionScore) " +
           "FROM FeedbackScore fs " +
           "JOIN fs.submission s " +
           "JOIN s.feedback f " +
           "JOIN Question q ON KEY(fs.questionScores) = q.id " +
           "GROUP BY q.category")
    List<Object[]> getCategoryAverageScores();
} 