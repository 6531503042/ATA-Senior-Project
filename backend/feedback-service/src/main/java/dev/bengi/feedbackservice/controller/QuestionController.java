package dev.bengi.feedbackservice.controller;

import dev.bengi.feedbackservice.domain.model.Question;
import dev.bengi.feedbackservice.domain.enums.QuestionType;
import dev.bengi.feedbackservice.domain.payload.request.CreateQuestionRequest;
import dev.bengi.feedbackservice.domain.payload.request.UpdateQuestionRequest;
import dev.bengi.feedbackservice.domain.payload.response.QuestionResponse;
import dev.bengi.feedbackservice.service.QuestionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/questions")
@RequiredArgsConstructor
@Slf4j
public class QuestionController {
    private final QuestionService questionService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Mono<ResponseEntity<QuestionResponse>> createQuestion(
            @RequestBody CreateQuestionRequest request) {
        log.info("Creating new question with text: {}", request.getTitle());
        
        // Convert request to Question
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
                .map(this::mapToQuestionResponse)
                .map(response -> ResponseEntity.status(HttpStatus.CREATED).body(response))
                .onErrorResume(e -> {
                    log.error("Error creating question: {}", e.getMessage());
                    return Mono.just(ResponseEntity.status(HttpStatus.BAD_REQUEST).build());
                });
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Mono<ResponseEntity<QuestionResponse>> updateQuestion(
            @PathVariable Long id,
            @RequestBody CreateQuestionRequest request) {
        log.info("Updating question with ID: {}", id);
        
        // Convert request to Question
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
                .map(this::mapToQuestionResponse)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build())
                .onErrorResume(e -> {
                    log.error("Error updating question: {}", e.getMessage());
                    return Mono.just(ResponseEntity.status(HttpStatus.BAD_REQUEST).build());
                });
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Mono<ResponseEntity<Void>> deleteQuestion(@PathVariable Long id) {
        log.info("Deleting question with ID: {}", id);
        
        return questionService.deleteQuestion(id)
                .then(Mono.just(ResponseEntity.noContent().<Void>build()))
                .onErrorResume(e -> {
                    log.error("Error deleting question: {}", e.getMessage());
                    return Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).<Void>build());
                });
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public Mono<ResponseEntity<QuestionResponse>> getQuestionById(@PathVariable Long id) {
        log.info("Fetching question with ID: {}", id);
        
        return questionService.getQuestion(id)
                .map(this::mapToQuestionResponse)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public Mono<ResponseEntity<List<QuestionResponse>>> getAllQuestions() {
        log.info("Fetching all questions");
        
        return questionService.getAllQuestions()
                .map(this::mapToQuestionResponse)
                .collectList()
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.noContent().build());
    }

    @GetMapping("/types")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public Mono<ResponseEntity<List<QuestionType>>> getQuestionTypes() {
        log.info("Fetching all question types");
        
        return Mono.just(ResponseEntity.ok(List.of(QuestionType.values())));
    }

    @GetMapping("/type/{type}")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public Mono<ResponseEntity<List<QuestionResponse>>> getQuestionsByType(
            @PathVariable QuestionType type) {
        log.info("Fetching questions of type: {}", type);
        
        return questionService.getAllQuestions()
                .filter(q -> q.getQuestionType() == type)
                .map(this::mapToQuestionResponse)
                .collectList()
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.noContent().build());
    }
    
    private QuestionResponse mapToQuestionResponse(Question question) {
        return QuestionResponse.builder()
                .id(question.getId())
                .text(question.getText())
                .content(question.getDescription())
                .description(question.getDescription())
                .type(question.getQuestionType())
                .category(question.getCategory())
                .required(question.isRequired())
                .createdAt(question.getCreatedAt() != null ? 
                        ZonedDateTime.from(question.getCreatedAt()) : null)
                .updatedAt(question.getUpdatedAt() != null ? 
                        ZonedDateTime.from(question.getUpdatedAt()) : null)
                .validationRules(question.getValidationRules())
                .build();
    }
} 