package dev.bengi.feedbackservice.service;

import dev.bengi.feedbackservice.domain.model.Question;
import dev.bengi.feedbackservice.domain.payload.request.CreateQuestionRequest;
import dev.bengi.feedbackservice.domain.payload.request.CreateQuestionSetRequest;
import dev.bengi.feedbackservice.domain.payload.response.QuestionResponse;
import dev.bengi.feedbackservice.domain.payload.response.QuestionSetResponse;
import org.springframework.data.domain.Page;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface QuestionService {
    Question createQuestion(CreateQuestionRequest request);

    List<QuestionSetResponse> createQuestionSet(CreateQuestionSetRequest request);

    @Transactional
    QuestionResponse updateQuestion(Long id, CreateQuestionRequest request);

    QuestionSetResponse updatedQuestionSet(Long id, CreateQuestionSetRequest request);

    void deleteQuestion(Long id);

    void deleteQuestionSet(Long id);

    Page<Question> getAllQuestions(int page, int size);

    Page<QuestionSetResponse> getAllQuestionSet(int page, int size);

    QuestionSetResponse getQuestionSetId(Long id);

    Question getQuestionById(Long id);
}
