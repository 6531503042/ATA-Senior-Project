package dev.bengi.feedbackservice.service;

import dev.bengi.feedbackservice.domain.model.Question;
import dev.bengi.feedbackservice.domain.enums.QuestionCategory;
import java.util.List;
import java.util.Map;

public interface QuestionService {
    Question createQuestion(Question question);
    Question updateQuestion(Long id, Question question);
    void deleteQuestion(Long id);
    Question getQuestion(Long id);
    List<Question> getAllQuestions();
    List<Question> getQuestionsByCategory(QuestionCategory category);
    
    // Dashboard methods
    Map<QuestionCategory, Long> getQuestionCountByCategory();
    List<Question> getRecentQuestions();
}
