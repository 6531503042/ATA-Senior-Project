package dev.bengi.feedbackservice.service.impl;

import dev.bengi.feedbackservice.domain.model.Answer;
import dev.bengi.feedbackservice.domain.model.Question;
import dev.bengi.feedbackservice.domain.model.QuestionSet;
import dev.bengi.feedbackservice.domain.payload.request.CreateQuestionRequest;
import dev.bengi.feedbackservice.domain.payload.request.CreateQuestionSetRequest;
import dev.bengi.feedbackservice.domain.payload.response.AnswerOptionResponse;
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
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.ZonedDateTime;
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
    public QuestionResponse createQuestion(CreateQuestionRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Question request cannot be null");
        }

        log.info("Creating question with request: {}", request);

        Question question = Question.builder()
                .text(request.getText())
                .content(request.getContent())
                .type(request.getType())
                .category(request.getCategory())
                .answerType(request.getAnswerType())
                .createdAt(ZonedDateTime.now())
                .updatedAt(ZonedDateTime.now())
                .build();

        if (request.getAnswerOptions() != null && !request.getAnswerOptions().isEmpty()) {
            List<Answer> answers = request.getAnswerOptions().stream()
                    .map(option -> Answer.builder()
                            .text(option.getText())
                            .value(String.valueOf(option.getValue()))
                            .question(question)
                            .build())
                    .collect(Collectors.toList());

            question.setAnswers(answers);
        }

        try {
            return mapToQuestionResponse(questionRepository.save(question));
        } catch (Exception e) {
            log.error("Error creating question: {}", e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to create question");
        }
    }

    @Override
    @Transactional
    public QuestionResponse updateQuestion(Long id, CreateQuestionRequest request) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Question not found"));

        question.setText(request.getText());
        question.setContent(request.getContent());
        question.setType(request.getType());
        question.setCategory(request.getCategory());
        question.setAnswerType(request.getAnswerType());
        question.setUpdatedAt(ZonedDateTime.now());

        // Clear existing answers and add new ones
        question.getAnswers().clear();
        if (request.getAnswerOptions() != null && !request.getAnswerOptions().isEmpty()) {
            List<Answer> answers = request.getAnswerOptions().stream()
                    .map(option -> Answer.builder()
                            .text(option.getText())
                            .value(String.valueOf(option.getValue()))
                            .question(question)
                            .build())
                    .collect(Collectors.toList());
            question.setAnswers(answers);
        }

        return mapToQuestionResponse(questionRepository.save(question));
    }

    @Override
    @Transactional
    public void deleteQuestion(Long id) {
        if (!questionRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Question not found");
        }
        questionRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public QuestionResponse getQuestionById(Long id) {
        return questionRepository.findById(id)
                .map(this::mapToQuestionResponse)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Question not found"));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<QuestionResponse> getAllQuestions(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return questionRepository.findAll(pageable).map(this::mapToQuestionResponse);
    }

    @Override
    @Transactional
    public List<QuestionSetResponse> createQuestionSet(CreateQuestionSetRequest request) {
        QuestionSet set = QuestionSet.builder()
                .name(request.getName())
                .description(request.getDescription())
                .createdAt(ZonedDateTime.now())
                .updatedAt(ZonedDateTime.now())
                .build();

        List<Question> questions = questionRepository.findAllById(request.getQuestionIds());
        questions.forEach(set::addQuestion);

        QuestionSet savedSet = questionSetRepository.save(set);
        return Collections.singletonList(mapToQuestionSetResponse(savedSet));
    }

    @Override
    @Transactional
    public QuestionSetResponse updateQuestionSet(Long id, CreateQuestionSetRequest request) {
        QuestionSet set = questionSetRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Question set not found"));

        set.setName(request.getName());
        set.setDescription(request.getDescription());
        set.setUpdatedAt(ZonedDateTime.now());

        // Update questions
        set.getQuestions().clear();
        List<Question> questions = questionRepository.findAllById(request.getQuestionIds());
        questions.forEach(set::addQuestion);

        return mapToQuestionSetResponse(questionSetRepository.save(set));
    }

    @Override
    @Transactional
    public void deleteQuestionSet(Long id) {
        if (!questionSetRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Question set not found");
        }
        questionSetRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public QuestionSetResponse getQuestionSetById(Long id) {
        return questionSetRepository.findById(id)
                .map(this::mapToQuestionSetResponse)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Question set not found"));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<QuestionSetResponse> getAllQuestionSets(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return questionSetRepository.findAll(pageable).map(this::mapToQuestionSetResponse);
    }

    private QuestionResponse mapToQuestionResponse(Question question) {
        return QuestionResponse.builder()
                .id(question.getId())
                .text(question.getText())
                .content(question.getContent())
                .required(question.isRequired())
                .type(question.getType())
                .category(question.getCategory())
                .answerType(question.getAnswerType())
                .answers(question.getAnswers().stream()
                        .map(answer -> AnswerOptionResponse.builder()
                                .text(answer.getText())
                                .value(answer.getValue())
                                .build())
                        .collect(Collectors.toList()))
                .build();
    }

    private QuestionSetResponse mapToQuestionSetResponse(QuestionSet set) {
        return QuestionSetResponse.builder()
                .id(set.getId())
                .name(set.getName())
                .description(set.getDescription())
                .questionIds(set.getQuestions().stream()
                        .map(Question::getId)
                        .collect(Collectors.toList()))
                .createdAt(set.getCreatedAt())
                .updatedAt(set.getUpdatedAt())
                .build();
    }
}