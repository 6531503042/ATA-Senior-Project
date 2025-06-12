package dev.bengi.feedbackservice.service;

import dev.bengi.feedbackservice.domain.model.Question;
import dev.bengi.feedbackservice.domain.enums.QuestionCategory;
import java.util.Map;
import reactor.core.publisher.Mono;
import reactor.core.publisher.Flux;

public interface QuestionService {
    Mono<Question> createQuestion(Question question);
    Mono<Question> updateQuestion(Long id, Question question);
    Mono<Void> deleteQuestion(Long id);
    Mono<Question> getQuestion(Long id);
    Flux<Question> getAllQuestions();
    Flux<Question> getQuestionsByCategory(QuestionCategory category);
    
    // Dashboard methods
    Mono<Map<QuestionCategory, Long>> getQuestionCountByCategory();
    Flux<Question> getRecentQuestions();
}
