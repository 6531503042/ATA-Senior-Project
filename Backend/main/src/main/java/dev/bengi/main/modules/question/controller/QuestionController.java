package dev.bengi.main.modules.question.controller;

import dev.bengi.main.modules.question.dto.*;
import dev.bengi.main.modules.question.service.QuestionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import dev.bengi.main.modules.question.enums.QuestionType;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/questions")
@RequiredArgsConstructor
public class QuestionController {
    private final QuestionService questionService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Mono<ResponseEntity<QuestionResponseDto>> create(@RequestBody @Valid QuestionRequestDto req) {
        return questionService.create(req).map(d -> ResponseEntity.status(HttpStatus.CREATED).body(d));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Mono<ResponseEntity<QuestionResponseDto>> update(@PathVariable Long id, @RequestBody @Valid QuestionUpdateRequestDto req) {
        return questionService.update(id, req).map(ResponseEntity::ok);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public Mono<ResponseEntity<QuestionResponseDto>> get(@PathVariable Long id) {
        return questionService.getById(id).map(ResponseEntity::ok);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public Flux<QuestionResponseDto> list() {
        return questionService.getAll();
    }

    @GetMapping("/types")
    public Mono<ResponseEntity<java.util.List<QuestionType>>> types() {
        return Mono.just(ResponseEntity.ok(java.util.Arrays.asList(QuestionType.values())));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Mono<ResponseEntity<Void>> delete(@PathVariable Long id) {
        return questionService.delete(id).thenReturn(ResponseEntity.noContent().build());
    }
}


