package dev.bengi.feedbackservice.service.impl;

import dev.bengi.feedbackservice.domain.model.Question;
import dev.bengi.feedbackservice.domain.enums.QuestionCategory;
import dev.bengi.feedbackservice.repository.QuestionRepository;
import dev.bengi.feedbackservice.service.QuestionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class QuestionServiceImpl implements QuestionService {
    private final QuestionRepository questionRepository;

    @Override
    public Question createQuestion(Question question) {
        question.setCreatedAt(LocalDateTime.now());
        question.setUpdatedAt(LocalDateTime.now());
        return questionRepository.save(question);
    }

    @Override
    public Question updateQuestion(Long id, Question question) {
        Question existingQuestion = getQuestion(id);
        question.setId(id);
        question.setUpdatedAt(LocalDateTime.now());
        return questionRepository.save(question);
    }

    @Override
    public void deleteQuestion(Long id) {
        questionRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Question getQuestion(Long id) {
        return questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found"));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Question> getAllQuestions() {
        return questionRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Question> getQuestionsByCategory(QuestionCategory category) {
        return questionRepository.findByCategory(category);
    }

    @Override
    @Transactional(readOnly = true)
    public Map<QuestionCategory, Long> getQuestionCountByCategory() {
        Map<QuestionCategory, Long> countMap = new HashMap<>();
        List<Object[]> results = questionRepository.countByCategory();
        for (Object[] result : results) {
            QuestionCategory category = (QuestionCategory) result[0];
            Long count = ((Number) result[1]).longValue();
            countMap.put(category, count);
        }
        return countMap;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Question> getRecentQuestions() {
        return questionRepository.findAll().stream()
                .sorted((q1, q2) -> q2.getCreatedAt().compareTo(q1.getCreatedAt()))
                .limit(10)
                .collect(Collectors.toList());
    }
}