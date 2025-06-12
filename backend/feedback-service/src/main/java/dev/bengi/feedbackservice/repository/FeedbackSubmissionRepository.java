package dev.bengi.feedbackservice.repository;

import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;

import dev.bengi.feedbackservice.domain.model.FeedbackSubmission;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Repository
public interface FeedbackSubmissionRepository extends R2dbcRepository<FeedbackSubmission, Long> {
    
    @Query("SELECT COUNT(*) FROM feedback_submissions")
    Mono<Long> countAll();
    
    @Query("SELECT EXISTS(SELECT 1 FROM feedback_submissions WHERE feedback_id = :feedbackId AND user_id = :userId)")
    Mono<Boolean> existsByFeedbackIdAndUserId(Long feedbackId, String userId);
    
    @Query("SELECT * FROM feedback_submissions WHERE feedback_id = :feedbackId")
    Flux<FeedbackSubmission> findByFeedbackId(Long feedbackId);
    
    @Query("SELECT * FROM feedback_submissions WHERE user_id = :userId")
    Flux<FeedbackSubmission> findByUserId(String userId);
    
    @Query("SELECT COUNT(*) FROM feedback_submissions WHERE feedback_id = :feedbackId")
    Mono<Long> countByFeedbackId(Long feedbackId);
    
    @Query("SELECT COUNT(*) FROM feedback_submissions WHERE submitted_at >= :startDate")
    Mono<Long> countSubmissionsAfterDate(java.time.LocalDateTime startDate);
    
    @Query("SELECT COUNT(*) FROM feedback_submissions WHERE feedback_id IN " +
           "(SELECT id FROM feedbacks WHERE status = :status)")
    Mono<Long> countSubmissionsByFeedbackStatus(String status);
    
    @Query("SELECT COUNT(*) FROM feedback_submissions WHERE is_anonymous = true")
    Mono<Long> countAnonymousSubmissions();
    
    @Query("SELECT AVG(response_count) FROM " +
           "(SELECT feedback_id, COUNT(*) as response_count FROM feedback_submissions " +
           "GROUP BY feedback_id HAVING COUNT(*) >= :minResponses)")
    Mono<Double> getAverageResponsesPerFeedback(int minResponses);
    
    @Query("SELECT COUNT(*) FROM feedback_submissions fs " +
           "JOIN json_table_responses ON fs.id = json_table_responses.submission_id " +
           "WHERE json_table_responses.question_id = :questionId")
    Mono<Long> countResponsesForQuestion(Long questionId);
    
    @Query("SELECT AVG(CAST(json_table_responses.response_value AS DECIMAL)) FROM feedback_submissions fs " +
           "JOIN json_table_responses ON fs.id = json_table_responses.submission_id " +
           "WHERE json_table_responses.question_id = :questionId " +
           "AND json_table_responses.response_value REGEXP '^[0-9]+(\\.[0-9]+)?$'")
    Mono<Double> getAverageScoreForQuestion(Long questionId);
} 