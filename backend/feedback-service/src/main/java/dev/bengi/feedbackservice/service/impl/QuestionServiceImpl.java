package dev.bengi.feedbackservice.service.impl;

import dev.bengi.feedbackservice.domain.model.Question;
import dev.bengi.feedbackservice.domain.payload.request.CreateQuestionRequest;
import dev.bengi.feedbackservice.domain.payload.response.QuestionResponse;
import dev.bengi.feedbackservice.repository.QuestionRepository;
import dev.bengi.feedbackservice.service.QuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@RequiredArgsConstructor
public class QuestionServiceImpl implements QuestionService {

    private final QuestionRepository questionRepository;

    @Override
    public Question createQuestion(Question question, CreateQuestionRequest request) {
        Question.builder()
                .text(request.getText())
                .type(request.getType())
                .category(request.getCategory())
                .sentimentType(request.getSentimentType())
                .build();
        return questionRepository.save(question);
    }

    @Override
    @Transactional
    public QuestionResponse updateQuestion(Long id, CreateQuestionRequest request) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found"));
        question.setText(request.getText());
        question.setType(request.getType());
        question.setCategory(request.getCategory());
        question.setSentimentType(request.getSentimentType());
        return QuestionResponse.builder()
                .id(question.getId())
                .text(question.getText())
                .type(question.getType())
                .category(question.getCategory())
                .sentimentType(question.getSentimentType())
                .build();
    }

    public void deleteQuestion(Long id) {
        questionRepository.deleteById(id);
    }


    @Override
    public Page<Question> getAllQuestions(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return questionRepository.findAll(pageable);
    }

    @Override
    public  Question getQuestionById(Long id) {
        return questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found"));
    }
}
