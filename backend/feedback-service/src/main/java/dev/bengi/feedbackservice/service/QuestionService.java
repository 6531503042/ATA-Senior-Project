package dev.bengi.feedbackservice.service;

import dev.bengi.feedbackservice.domain.payload.request.CreateQuestionRequest;
import dev.bengi.feedbackservice.domain.payload.request.CreateQuestionSetRequest;
import dev.bengi.feedbackservice.domain.payload.response.QuestionResponse;
import dev.bengi.feedbackservice.domain.payload.response.QuestionSetResponse;
import org.springframework.data.domain.Page;

import java.util.List;

public interface QuestionService {
    QuestionResponse createQuestion(CreateQuestionRequest request);
    QuestionResponse updateQuestion(Long id, CreateQuestionRequest request);
    void deleteQuestion(Long id);
    QuestionResponse getQuestionById(Long id);
    Page<QuestionResponse> getAllQuestions(int page, int size);

    List<QuestionSetResponse> createQuestionSet(CreateQuestionSetRequest request);
    QuestionSetResponse updateQuestionSet(Long id, CreateQuestionSetRequest request);
    void deleteQuestionSet(Long id);
    QuestionSetResponse getQuestionSetById(Long id);
    Page<QuestionSetResponse> getAllQuestionSets(int page, int size);
}
