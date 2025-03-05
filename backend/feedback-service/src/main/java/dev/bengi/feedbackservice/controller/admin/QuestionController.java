package dev.bengi.feedbackservice.controller.admin;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import dev.bengi.feedbackservice.domain.enums.QuestionCategory;
import dev.bengi.feedbackservice.domain.model.Question;
import dev.bengi.feedbackservice.domain.payload.request.CreateQuestionRequest;
import dev.bengi.feedbackservice.service.QuestionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/v1/admin/questions")
@RequiredArgsConstructor
public class QuestionController {
    private final QuestionService questionService;

    @PostMapping("/create")
    public ResponseEntity<Question> createQuestion(@Valid @RequestBody CreateQuestionRequest request) {
        log.debug("Creating new question with title: {}", request.getTitle());
        Question question = Question.builder()
                .text(request.getTitle())
                .description(request.getDescription())
                .questionType(request.getQuestionType())
                .category(request.getCategory())
                .choices(request.getChoices())
                .required(request.isRequired())
                .validationRules(request.getValidationRules())
                .build();
        return ResponseEntity.ok(questionService.createQuestion(question));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Question> updateQuestion(@PathVariable Long id, @Valid @RequestBody CreateQuestionRequest request) {
        log.debug("Updating question with ID: {}", id);
        Question question = Question.builder()
                .text(request.getTitle())
                .description(request.getDescription())
                .questionType(request.getQuestionType())
                .category(request.getCategory())
                .choices(request.getChoices())
                .required(request.isRequired())
                .validationRules(request.getValidationRules())
                .build();
        return ResponseEntity.ok(questionService.updateQuestion(id, question));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteQuestion(@PathVariable Long id) {
        log.debug("Deleting question with ID: {}", id);
        questionService.deleteQuestion(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<Question> getQuestion(@PathVariable Long id) {
        log.debug("Fetching question with ID: {}", id);
        return ResponseEntity.ok(questionService.getQuestion(id));
    }

    @GetMapping("/get-all")
    public ResponseEntity<List<Question>> getAllQuestions() {
        log.debug("Fetching all questions");
        return ResponseEntity.ok(questionService.getAllQuestions());
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<Question>> getQuestionsByCategory(@PathVariable QuestionCategory category) {
        log.debug("Fetching questions for category: {}", category);
        return ResponseEntity.ok(questionService.getQuestionsByCategory(category));
    }

    // Dashboard endpoints
    @GetMapping("/category-count")
    public ResponseEntity<Map<QuestionCategory, Long>> getQuestionCountByCategory() {
        log.debug("Fetching question count by category");
        return ResponseEntity.ok(questionService.getQuestionCountByCategory());
    }

    @GetMapping("/recent")
    public ResponseEntity<List<Question>> getRecentQuestions() {
        log.debug("Fetching recent questions");
        return ResponseEntity.ok(questionService.getRecentQuestions());
    }
}
