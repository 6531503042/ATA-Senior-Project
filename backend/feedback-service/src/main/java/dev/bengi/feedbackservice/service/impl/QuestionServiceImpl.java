package dev.bengi.feedbackservice.service.impl;

import dev.bengi.feedbackservice.domain.model.Answer;
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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;


@Service
@RequiredArgsConstructor
public class QuestionServiceImpl implements QuestionService {

    private final QuestionRepository questionRepository;
    private final QuestionSetRepository questionSetRepository;

    @Override
    public Question createQuestion(CreateQuestionRequest request) {
        Question question = Question.builder()
                .text(request.getText())
                .content(request.getContent())
                .type(request.getType())
                .category(request.getCategory())
                .answerType(request.getAnswerType())
                .build();

        //Answer exists
        if (request.getAnswers() != null) {
            request.getAnswers().forEach(answerText -> {
                Answer answer = Answer.builder()
                        .text(answerText)
                        .build();
                question.addAnswer(answer);
            });
        }
        return questionRepository.save(question);
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

        //Answer exists
        if (request.getAnswers() != null) {
            request.getAnswers().forEach(answerText -> {
                Answer answer = Answer.builder()
                        .text(answerText)
                        .build();
                question.addAnswer(answer);
            });
        }

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
    public  Question getQuestionById(Long id) {
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
