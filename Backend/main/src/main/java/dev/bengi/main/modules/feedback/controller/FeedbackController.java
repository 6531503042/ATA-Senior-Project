package dev.bengi.main.modules.feedback.controller;

import dev.bengi.main.modules.feedback.model.Feedback;
import dev.bengi.main.modules.feedback.repository.FeedbackRepository;
import lombok.RequiredArgsConstructor;
import dev.bengi.main.modules.feedback.service.FeedbackService;
import jakarta.validation.constraints.NotEmpty;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/feedbacks")
@RequiredArgsConstructor
public class FeedbackController {

    private final FeedbackRepository feedbackRepository;
    private final FeedbackService feedbackService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Mono<ResponseEntity<Feedback>> create(@RequestBody Feedback payload) {
        return feedbackRepository.save(payload)
                .map(saved -> ResponseEntity.status(HttpStatus.CREATED).body(saved));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public Flux<Feedback> list() {
        return feedbackRepository.findAll();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public Mono<ResponseEntity<Feedback>> get(@PathVariable Long id) {
        return feedbackRepository.findById(id)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Mono<ResponseEntity<Feedback>> update(@PathVariable Long id, @RequestBody Feedback incoming) {
        return feedbackRepository.findById(id)
                .flatMap(existing -> {
                    existing.setTitle(incoming.getTitle());
                    existing.setDescription(incoming.getDescription());
                    existing.setProjectId(incoming.getProjectId());
                    existing.setStartDate(incoming.getStartDate());
                    existing.setEndDate(incoming.getEndDate());
                    existing.setActive(incoming.isActive());
                    return feedbackRepository.save(existing);
                })
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Mono<ResponseEntity<Void>> delete(@PathVariable Long id) {
        return feedbackRepository.existsById(id)
                .flatMap(exists -> exists ? feedbackRepository.deleteById(id).then(Mono.just(ResponseEntity.noContent().<Void>build()))
                        : Mono.just(ResponseEntity.notFound().build()));
    }

    // Relations
    @PostMapping("/{id}/questions")
    @PreAuthorize("hasRole('ADMIN')")
    public Mono<ResponseEntity<Void>> addQuestions(@PathVariable Long id, @RequestBody @NotEmpty java.util.List<Long> questionIds) {
        return feedbackService.addQuestions(id, questionIds).thenReturn(ResponseEntity.noContent().build());
    }

    @DeleteMapping("/{id}/questions")
    @PreAuthorize("hasRole('ADMIN')")
    public Mono<ResponseEntity<Void>> removeQuestions(@PathVariable Long id, @RequestBody @NotEmpty java.util.List<Long> questionIds) {
        return feedbackService.removeQuestions(id, questionIds).thenReturn(ResponseEntity.noContent().build());
    }

    @PostMapping("/{id}/target-users")
    @PreAuthorize("hasRole('ADMIN')")
    public Mono<ResponseEntity<Void>> addTargetUsers(@PathVariable Long id, @RequestBody @NotEmpty java.util.List<Long> userIds) {
        return feedbackService.addTargetUsers(id, userIds).thenReturn(ResponseEntity.noContent().build());
    }

    @DeleteMapping("/{id}/target-users")
    @PreAuthorize("hasRole('ADMIN')")
    public Mono<ResponseEntity<Void>> removeTargetUsers(@PathVariable Long id, @RequestBody @NotEmpty java.util.List<Long> userIds) {
        return feedbackService.removeTargetUsers(id, userIds).thenReturn(ResponseEntity.noContent().build());
    }

    @PostMapping("/{id}/target-departments")
    @PreAuthorize("hasRole('ADMIN')")
    public Mono<ResponseEntity<Void>> addTargetDepartments(@PathVariable Long id, @RequestBody @NotEmpty java.util.List<Long> departmentIds) {
        return feedbackService.addTargetDepartments(id, departmentIds).thenReturn(ResponseEntity.noContent().build());
    }

    @DeleteMapping("/{id}/target-departments")
    @PreAuthorize("hasRole('ADMIN')")
    public Mono<ResponseEntity<Void>> removeTargetDepartments(@PathVariable Long id, @RequestBody @NotEmpty java.util.List<Long> departmentIds) {
        return feedbackService.removeTargetDepartments(id, departmentIds).thenReturn(ResponseEntity.noContent().build());
    }
}


