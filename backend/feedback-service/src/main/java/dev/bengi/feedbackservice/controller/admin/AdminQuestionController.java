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
import reactor.core.publisher.Mono;

@Slf4j
@RestController
@RequestMapping("/api/v1/admin/questions")
@RequiredArgsConstructor
public class AdminQuestionController {
    private final QuestionService questionService;

    @PostMapping("/create")
    public Mono<ResponseEntity<Question>> createQuestion(@Valid @RequestBody CreateQuestionRequest request) {
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
        return questionService.createQuestion(question)
                .map(ResponseEntity::ok);
    }

    @PutMapping("/update/{id}")
    public Mono<ResponseEntity<Question>> updateQuestion(@PathVariable Long id, @Valid @RequestBody CreateQuestionRequest request) {
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
        return questionService.updateQuestion(id, question)
                .map(ResponseEntity::ok);
    }

    @DeleteMapping("/delete/{id}")
    public Mono<ResponseEntity<Void>> deleteQuestion(@PathVariable Long id) {
        log.debug("Deleting question with ID: {}", id);
        return questionService.deleteQuestion(id)
                .then(Mono.just(ResponseEntity.ok().<Void>build()));
    }

    @GetMapping("/get/{id}")
    public Mono<ResponseEntity<Question>> getQuestion(@PathVariable Long id) {
        log.debug("Fetching question with ID: {}", id);
        return questionService.getQuestion(id)
                .map(ResponseEntity::ok);
    }

    @GetMapping("/get-all")
    public Mono<ResponseEntity<List<Question>>> getAllQuestions() {
        log.debug("Fetching all questions");
        return questionService.getAllQuestions()
                .collectList()
                .map(ResponseEntity::ok);
    }

    @GetMapping("/category/{category}")
    public Mono<ResponseEntity<List<Question>>> getQuestionsByCategory(@PathVariable QuestionCategory category) {
        log.debug("Fetching questions for category: {}", category);
        return questionService.getQuestionsByCategory(category)
                .collectList()
                .map(ResponseEntity::ok);
    }

    // Dashboard endpoints
    @GetMapping("/category-count")
    public Mono<ResponseEntity<Map<QuestionCategory, Long>>> getQuestionCountByCategory() {
        log.debug("Fetching question count by category");
        return questionService.getQuestionCountByCategory()
                .map(ResponseEntity::ok);
    }

    @GetMapping("/recent")
    public Mono<ResponseEntity<List<Question>>> getRecentQuestions() {
        log.debug("Fetching recent questions");
        return questionService.getRecentQuestions()
                .collectList()
                .map(ResponseEntity::ok);
    }
}
