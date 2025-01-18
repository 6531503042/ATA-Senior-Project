package dev.bengi.feedbackservice.controller.admin;

import dev.bengi.feedbackservice.domain.model.Question;
import dev.bengi.feedbackservice.domain.model.QuestionSet;
import dev.bengi.feedbackservice.domain.payload.request.CreateQuestionRequest;
import dev.bengi.feedbackservice.domain.payload.request.CreateQuestionSetRequest;
import dev.bengi.feedbackservice.domain.payload.response.QuestionResponse;
import dev.bengi.feedbackservice.domain.payload.response.QuestionSetResponse;
import dev.bengi.feedbackservice.service.QuestionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("api/v1/admin/question")
public class QuestionController {
    private final QuestionService questionService;

    @PostMapping("/create")
    public ResponseEntity<Question> createQuestion(
            @Valid @RequestBody CreateQuestionRequest request) {
                try {
                    var questionResponse = questionService.createQuestion(request);
                    return ResponseEntity.ok(questionResponse);
                } catch (Exception e) {
                    log.error("Failed to create question", e);
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
                }
            }


    @PostMapping("/create-set")
    public ResponseEntity<QuestionSet> createQuestionSet(
            @Valid @RequestBody CreateQuestionSetRequest request
    )        {
        try {
            var questionSetResponse = questionService.createQuestionSet(request);
            return ResponseEntity.ok((QuestionSet) questionSetResponse);
        } catch (Exception e) {
            log.error("Failed to create question set", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    @GetMapping("/questions")
    public ResponseEntity<List<Question>> getAllQuestion() {
        try {
            var questions = questionService.getAllQuestions(0, 10);
            return ResponseEntity.ok(questions.getContent());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    @GetMapping("/question-sets")
    public ResponseEntity<List<QuestionSetResponse>> getAllQuestionSet() {
        try {
            var questionSets = questionService.getAllQuestionSet(0, 10);
            return ResponseEntity.ok(questionSets.getContent());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    @GetMapping("/question-set/{id}")
    public ResponseEntity<QuestionSetResponse> getQuestionSet(@PathVariable("id") Long id) {
        try {
            var questionSet = questionService.getQuestionSetId(id);
            return ResponseEntity.ok(questionSet);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/question/{id}")
    public ResponseEntity<Question> getQuestion(@PathVariable("id") Long id) {
        try {
            var question = questionService.getQuestionById(id);
            return ResponseEntity.ok(question);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    @PutMapping("/question/{id}")
    public ResponseEntity<QuestionResponse> updateQuestion(@Valid @RequestBody CreateQuestionRequest question, @PathVariable("id") Long id) {
        try {
            var questionResponse = questionService.updateQuestion(id, question);
            return ResponseEntity.ok(questionResponse);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    @PutMapping("/question-set/{id}")
    public ResponseEntity<QuestionSetResponse> updateQuestionSet(@Valid @RequestBody CreateQuestionSetRequest questionSet, @PathVariable("id") Long id) {
        try {
            var questionSetResponse = questionService.updatedQuestionSet(id, questionSet);
            return ResponseEntity.ok(questionSetResponse);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    @DeleteMapping("/question/{id}")
    public ResponseEntity<Void> deleteQuestion(@PathVariable("id") Long id) {
        try {
            questionService.deleteQuestion(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    @DeleteMapping("/question-set/{id}")
    public ResponseEntity<Void> deleteQuestionSet(@PathVariable("id") Long id) {
        try {
            questionService.deleteQuestionSet(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
