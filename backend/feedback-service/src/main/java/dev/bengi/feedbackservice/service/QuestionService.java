package dev.bengi.feedbackservice.service;

import dev.bengi.feedbackservice.domain.model.Question;
import dev.bengi.feedbackservice.domain.payload.request.CreateQuestionRequest;
import dev.bengi.feedbackservice.domain.payload.response.QuestionResponse;
import org.springframework.data.domain.Page;
import org.springframework.transaction.annotation.Transactional;

public interface QuestionService {
    Question createQuestion(CreateQuestionRequest request);

    @Transactional
    QuestionResponse updateQuestion(Long id, CreateQuestionRequest request);

    void deleteQuestion(Long id);

    Page<Question> getAllQuestions(int page, int size);

    Question getQuestionById(Long id);
}
