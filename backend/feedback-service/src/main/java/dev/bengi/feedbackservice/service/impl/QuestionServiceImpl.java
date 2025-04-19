package dev.bengi.feedbackservice.service.impl;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;

import dev.bengi.feedbackservice.domain.enums.QuestionCategory;
import dev.bengi.feedbackservice.domain.model.Question;
import dev.bengi.feedbackservice.repository.QuestionRepository;
import dev.bengi.feedbackservice.service.QuestionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Slf4j
@Service
@RequiredArgsConstructor
public class QuestionServiceImpl implements QuestionService {
    private final QuestionRepository questionRepository;

    @Override
    public Mono<Question> createQuestion(Question question) {
        question.setCreatedAt(LocalDateTime.now());
        question.setUpdatedAt(LocalDateTime.now());
        return questionRepository.save(question);
    }

    @Override
    public Mono<Question> updateQuestion(Long id, Question updatedQuestion) {
        return getQuestion(id)
            .flatMap(existingQuestion -> {
                // Update fields while preserving creation date and ID
                existingQuestion.setText(updatedQuestion.getText());
                existingQuestion.setDescription(updatedQuestion.getDescription());
                existingQuestion.setQuestionType(updatedQuestion.getQuestionType());
                existingQuestion.setCategory(updatedQuestion.getCategory());
                existingQuestion.setChoices(updatedQuestion.getChoices());
                existingQuestion.setRequired(updatedQuestion.isRequired());
                existingQuestion.setValidationRules(updatedQuestion.getValidationRules());
                existingQuestion.setUpdatedAt(LocalDateTime.now());
                
                return questionRepository.save(existingQuestion);
            });
    }

    @Override
    public Mono<Void> deleteQuestion(Long id) {
        return questionRepository.deleteById(id);
    }

    @Override
    public Mono<Question> getQuestion(Long id) {
        return questionRepository.findById(id)
                .switchIfEmpty(Mono.error(new RuntimeException("Question not found")));
    }

    @Override
    public Flux<Question> getAllQuestions() {
        return questionRepository.findAll();
    }

    @Override
    public Flux<Question> getQuestionsByCategory(QuestionCategory category) {
        return questionRepository.findByCategory(category);
    }

    @Override
    public Mono<Map<QuestionCategory, Long>> getQuestionCountByCategory() {
        return questionRepository.countByCategory()
            .collectMap(
                result -> (QuestionCategory) result[0],
                result -> ((Number) result[1]).longValue()
            );
    }

    @Override
    public Flux<Question> getRecentQuestions() {
        return questionRepository.findAll()
            .sort((q1, q2) -> q2.getCreatedAt().compareTo(q1.getCreatedAt()))
            .take(10);
    }
}