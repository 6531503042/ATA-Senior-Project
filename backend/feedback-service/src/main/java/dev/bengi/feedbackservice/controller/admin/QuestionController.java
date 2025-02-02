package dev.bengi.feedbackservice.controller.admin;

import dev.bengi.feedbackservice.domain.payload.request.CreateQuestionRequest;
import dev.bengi.feedbackservice.domain.payload.request.CreateQuestionSetRequest;
import dev.bengi.feedbackservice.domain.payload.response.QuestionResponse;
import dev.bengi.feedbackservice.domain.payload.response.QuestionSetResponse;
import dev.bengi.feedbackservice.service.QuestionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("api/v1/admin")
public class QuestionController {
    private final QuestionService questionService;

    // Question endpoints
    @PostMapping("/questions")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<QuestionResponse> createQuestion(@Valid @RequestBody CreateQuestionRequest request) {
        log.info("Received CreateQuestionRequest: {}", request);
        try {
            return ResponseEntity.ok(questionService.createQuestion(request));
        } catch (Exception e) {
            log.error("Failed to create question", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/questions/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<QuestionResponse> updateQuestion(
            @PathVariable Long id,
            @Valid @RequestBody CreateQuestionRequest request) {
        try {
            return ResponseEntity.ok(questionService.updateQuestion(id, request));
        } catch (Exception e) {
            log.error("Failed to update question", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/questions/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteQuestion(@PathVariable Long id) {
        try {
            questionService.deleteQuestion(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Failed to delete question", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/questions/{id}")
    public ResponseEntity<QuestionResponse> getQuestion(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(questionService.getQuestionById(id));
        } catch (Exception e) {
            log.error("Failed to get question", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/questions")
    public ResponseEntity<Page<QuestionResponse>> getAllQuestions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            return ResponseEntity.ok(questionService.getAllQuestions(page, size));
        } catch (Exception e) {
            log.error("Failed to get questions", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // QuestionSet endpoints
    @PostMapping("/question-sets")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<QuestionSetResponse>> createQuestionSet(
            @Valid @RequestBody CreateQuestionSetRequest request) {
        try {
            return ResponseEntity.ok(questionService.createQuestionSet(request));
        } catch (Exception e) {
            log.error("Failed to create question set", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/question-sets/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<QuestionSetResponse> updateQuestionSet(
            @PathVariable Long id,
            @Valid @RequestBody CreateQuestionSetRequest request) {
        try {
            return ResponseEntity.ok(questionService.updateQuestionSet(id, request));
        } catch (Exception e) {
            log.error("Failed to update question set", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/question-sets/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteQuestionSet(@PathVariable Long id) {
        try {
            questionService.deleteQuestionSet(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Failed to delete question set", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/question-sets/{id}")
    public ResponseEntity<QuestionSetResponse> getQuestionSet(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(questionService.getQuestionSetById(id));
        } catch (Exception e) {
            log.error("Failed to get question set", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/question-sets")
    public ResponseEntity<Page<QuestionSetResponse>> getAllQuestionSets(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            return ResponseEntity.ok(questionService.getAllQuestionSets(page, size));
        } catch (Exception e) {
            log.error("Failed to get question sets", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
