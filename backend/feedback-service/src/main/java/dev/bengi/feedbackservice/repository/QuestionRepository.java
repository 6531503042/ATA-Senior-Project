package dev.bengi.feedbackservice.repository;

import dev.bengi.feedbackservice.domain.model.Question;
import dev.bengi.feedbackservice.domain.enums.QuestionCategory;
import dev.bengi.feedbackservice.domain.enums.QuestionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

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
}
