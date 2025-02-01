package dev.bengi.feedbackservice.service.impl;

import dev.bengi.feedbackservice.domain.model.Answer;
import dev.bengi.feedbackservice.domain.model.AnswerOption;
import dev.bengi.feedbackservice.domain.model.Question;
import dev.bengi.feedbackservice.domain.model.QuestionSet;
import dev.bengi.feedbackservice.domain.payload.request.CreateQuestionRequest;
import dev.bengi.feedbackservice.domain.payload.request.CreateQuestionSetRequest;
import dev.bengi.feedbackservice.domain.payload.response.QuestionResponse;
import dev.bengi.feedbackservice.domain.payload.response.QuestionSetResponse;
import dev.bengi.feedbackservice.repository.QuestionRepository;
import dev.bengi.feedbackservice.repository.QuestionSetRepository;
import dev.bengi.feedbackservice.service.QuestionService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation of the QuestionService interface.
 */
@Service
@RequiredArgsConstructor
public class QuestionServiceImpl implements QuestionService {

    private final QuestionRepository questionRepository;
    private final QuestionSetRepository questionSetRepository;
    private static final Logger log = LoggerFactory.getLogger(QuestionServiceImpl.class);

    @Override
    @Transactional
    public Question createQuestion(CreateQuestionRequest request) {
        // Validate input
        if (request == null) {
            throw new IllegalArgumentException("Question request cannot be null");
        }

        log.info("Creating question with request: {}", request);

        // Build the Question entity
        Question question = Question.builder()
                .text(request.getText())
                .content(request.getContent())
                .type(request.getType())
                .category(request.getCategory())
                .answerType(request.getAnswerType())
                .required(false) // Set a default value if not specified
                .build();

        log.info("Built Question entity: {}", question);

        // If there are answers, create Answer entities from AnswerOptions
        if (request.getAnswerOptions() != null && !request.getAnswerOptions().isEmpty()) {
            List<Answer> answers = request.getAnswerOptions().stream()
                    .map(option -> {
                        // Ensure option is of the correct type
                        return Answer.builder()
                                .text(option.getText())
                                .value(String.valueOf(option.getValue())) // Convert to String if necessary
                                .question(question)
                                .build();
                    })
                    .collect(Collectors.toList());

            question.setAnswers(answers);
        }

        // Save the question entity with answers
        try {
            return questionRepository.save(question);
        } catch (DataIntegrityViolationException e) {
            log.error("Data integrity violation while creating question: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to create question due to data integrity issues", e);
        } catch (Exception e) {
            log.error("Error creating question: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to create question", e);
        }
    }

    @Override
    @Transactional
    public List<QuestionSetResponse> createQuestionSet(CreateQuestionSetRequest request) {
        QuestionSet set = QuestionSet.builder()
                .name(request.getName())
                .description(request.getDescription())
                .build();

        List<Question> questions = questionRepository.findAllById(request.getQuestionIds());
        questions.forEach(set::addQuestion);

        QuestionSet savedSet = questionSetRepository.save(set);
        return Collections.singletonList(mapToResponse(savedSet));
    }

    @Override
    @Transactional
    public QuestionResponse updateQuestion(Long id, CreateQuestionRequest request) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found"));
        question.setText(request.getText());
        question.setContent(request.getContent());
        question.setType(request.getType());
        question.setCategory(request.getCategory());

        return QuestionResponse.builder()
                .id(question.getId())
                .text(question.getText())
                .content(question.getContent())
                .type(question.getType())
                .category(question.getCategory())
                .build();
    }

    @Override
    @Transactional
    public QuestionSetResponse updatedQuestionSet(Long id, CreateQuestionSetRequest request) {
        QuestionSet set = questionSetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("QuestionSet not found"));

        set.setName(request.getName());
        set.setDescription(request.getDescription());
        set.getQuestions().clear();

        List<Question> questions = questionRepository.findAllById(request.getQuestionIds());
        questions.forEach(set::addQuestion);

        QuestionSet savedSet = questionSetRepository.save(set);
        return mapToResponse(savedSet);
    }

    @Override
    public void deleteQuestion(Long id) {
        questionRepository.deleteById(id);
    }

    @Override
    public void deleteQuestionSet(Long id) {
        questionSetRepository.deleteById(id);
    }

    @Override
    public Page<Question> getAllQuestions(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return questionRepository.findAll(pageable);
    }

    @Override
    public Page<QuestionSetResponse> getAllQuestionSet(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return questionSetRepository.findAll(pageable).map(this::mapToResponse);
    }

    @Override
    public QuestionSetResponse getQuestionSetId(Long id) {
        QuestionSet set = questionSetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("QuestionSet not found"));
        return mapToResponse(set);
    }

    @Override
    public Question getQuestionById(Long id) {
        return questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found"));
    }

    private QuestionSetResponse mapToResponse(QuestionSet set) {
        return QuestionSetResponse.builder()
                .id(set.getId())
                .name(set.getName())
                .description(set.getDescription())
                .question(set.getQuestions().stream()
                        .map(Question::getId)
                        .toList())
                .build();
    }
}