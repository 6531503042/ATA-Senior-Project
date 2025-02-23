package dev.bengi.feedbackservice.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import dev.bengi.feedbackservice.domain.enums.QuestionCategory;
import dev.bengi.feedbackservice.domain.enums.QuestionType;
import dev.bengi.feedbackservice.domain.model.Question;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByCategory(QuestionCategory category);
    List<Question> findByRequired(boolean required);
    
    @Query("SELECT q.category, COUNT(q) FROM Question q GROUP BY q.category")
    List<Object[]> countByCategory();
    
    long countByQuestionType(QuestionType type);
    long countByCategory(QuestionCategory category);
    
    @Query("SELECT COUNT(q) FROM Question q WHERE q.category = :category AND q.required = true")
    long countActiveQuestionsByCategory(@Param("category") QuestionCategory category);
    
    @Query("SELECT COUNT(q) FROM Question q WHERE q.questionType = :type AND q.required = true")
    long countActiveQuestionsByType(@Param("type") QuestionType type);
    
    // New methods for dashboard
    @Query("SELECT q FROM Question q WHERE q.createdAt >= :startDate ORDER BY q.createdAt DESC")
    List<Question> findRecentQuestions(@Param("startDate") LocalDateTime startDate);
    
    @Query("SELECT q.questionType, COUNT(q) FROM Question q GROUP BY q.questionType")
    List<Object[]> getQuestionTypeDistribution();
    
    @Query("SELECT COUNT(q) FROM Question q WHERE q.required = true")
    long countRequiredQuestions();
    
    @Query("SELECT AVG(SIZE(fs.responses)) FROM FeedbackSubmission fs JOIN fs.feedback f JOIN f.questionIds qid WHERE qid = :questionId")
    Double getAverageResponseRateForQuestion(@Param("questionId") Long questionId);
    
    @Query("SELECT q FROM Question q WHERE SIZE(q.choices) > 0")
    List<Question> findQuestionsWithChoices();
    
    @Query("SELECT q FROM Question q WHERE q.validationRules IS NOT NULL AND q.validationRules <> ''")
    List<Question> findQuestionsWithValidationRules();
}
