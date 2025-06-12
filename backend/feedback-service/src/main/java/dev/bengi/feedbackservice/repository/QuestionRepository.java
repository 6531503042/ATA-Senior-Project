package dev.bengi.feedbackservice.repository;

import java.time.LocalDateTime;

import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import dev.bengi.feedbackservice.domain.enums.QuestionCategory;
import dev.bengi.feedbackservice.domain.enums.QuestionType;
import dev.bengi.feedbackservice.domain.model.Question;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Repository
public interface QuestionRepository extends R2dbcRepository<Question, Long> {
    Flux<Question> findByCategory(QuestionCategory category);
    Flux<Question> findByRequired(boolean required);
    
    @Query("SELECT category, COUNT(*) as count FROM questions GROUP BY category")
    Flux<Object[]> countByCategory();
    
    Mono<Long> countByQuestionType(QuestionType type);
    Mono<Long> countByCategory(QuestionCategory category);
    
    @Query("SELECT COUNT(*) FROM questions WHERE category = :category AND required = true")
    Mono<Long> countActiveQuestionsByCategory(@Param("category") QuestionCategory category);
    
    @Query("SELECT COUNT(*) FROM questions WHERE question_type = :type AND required = true")
    Mono<Long> countActiveQuestionsByType(@Param("type") QuestionType type);
    
    // New methods for dashboard
    @Query("SELECT * FROM questions WHERE created_at >= :startDate ORDER BY created_at DESC")
    Flux<Question> findRecentQuestions(@Param("startDate") LocalDateTime startDate);
    
    @Query("SELECT question_type, COUNT(*) FROM questions GROUP BY question_type")
    Flux<Object[]> getQuestionTypeDistribution();
    
    @Query("SELECT COUNT(*) FROM questions WHERE required = true")
    Mono<Long> countRequiredQuestions();
    
    // This query needs to be rewritten for R2DBC
    @Query("SELECT AVG(response_count) FROM (SELECT COUNT(*) as response_count FROM feedback_submissions fs " +
           "JOIN feedbacks f ON fs.feedback_id = f.id " +
           "JOIN question_feedbacks qf ON f.id = qf.feedback_id " +
           "WHERE qf.question_id = :questionId GROUP BY fs.id) as counts")
    Mono<Double> getAverageResponseRateForQuestion(@Param("questionId") Long questionId);
    
    @Query("SELECT * FROM questions WHERE EXISTS (SELECT 1 FROM question_choices WHERE question_id = questions.id)")
    Flux<Question> findQuestionsWithChoices();
    
    @Query("SELECT * FROM questions WHERE validation_rules IS NOT NULL AND validation_rules <> ''")
    Flux<Question> findQuestionsWithValidationRules();
    
    // Add reactive methods needed by the service
    Mono<Boolean> existsById(Long id);
}
