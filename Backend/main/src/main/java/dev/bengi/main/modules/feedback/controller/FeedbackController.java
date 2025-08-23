package dev.bengi.main.modules.feedback.controller;

import dev.bengi.main.common.pagination.PageResponse;
import dev.bengi.main.common.pagination.PaginationService;
import dev.bengi.main.modules.feedback.repository.FeedbackRepository;
import dev.bengi.main.modules.feedback.dto.FeedbackCreateRequestDto;
import dev.bengi.main.modules.feedback.dto.FeedbackUpdateRequestDto;
import dev.bengi.main.modules.feedback.dto.FeedbackResponseDto;
import lombok.RequiredArgsConstructor;
import dev.bengi.main.modules.feedback.service.FeedbackService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/feedbacks")
@RequiredArgsConstructor
public class FeedbackController {

    private final FeedbackRepository feedbackRepository;
    private final FeedbackService feedbackService;
    private final PaginationService paginationService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Mono<ResponseEntity<FeedbackResponseDto>> create(@Valid @RequestBody FeedbackCreateRequestDto request) {
        return feedbackService.createFeedback(request)
                .map(saved -> ResponseEntity.status(HttpStatus.CREATED).body(saved));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public Mono<ResponseEntity<PageResponse<FeedbackResponseDto>>> list(ServerWebExchange exchange, Authentication auth) {
        var pageRequest = paginationService.parsePageRequest(exchange);
        String username = auth != null ? auth.getName() : null;
        return feedbackService.findAllFeedbacks(pageRequest, username)
                .map(ResponseEntity::ok);
    }

    @GetMapping("/available")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public Mono<ResponseEntity<PageResponse<FeedbackResponseDto>>> listAvailable(ServerWebExchange exchange, Authentication auth) {
        var pageRequest = paginationService.parsePageRequest(exchange);
        String username = auth != null ? auth.getName() : null;
        return feedbackService.findAvailableFeedbacks(pageRequest, username)
                .map(ResponseEntity::ok);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public Mono<ResponseEntity<FeedbackResponseDto>> get(@PathVariable Long id, Authentication auth) {
        String username = auth != null ? auth.getName() : null;
        return feedbackService.getFeedbackById(id, username)
                .map(ResponseEntity::ok);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Mono<ResponseEntity<FeedbackResponseDto>> update(@PathVariable Long id, @Valid @RequestBody FeedbackUpdateRequestDto request) {
        return feedbackService.updateFeedback(id, request)
                .map(ResponseEntity::ok);
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

    // Get project members for feedback creation
    @GetMapping("/projects/{projectId}/members")
    @PreAuthorize("hasRole('ADMIN')")
    public Flux<dev.bengi.main.modules.user.dto.UserResponseDto> getProjectMembers(@PathVariable Long projectId) {
        return feedbackService.getProjectMembers(projectId);
    }

    // Check if feedback is available for submission
    @GetMapping("/{id}/can-submit")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public Mono<ResponseEntity<Boolean>> canSubmit(@PathVariable Long id, Authentication auth) {
        String username = auth != null ? auth.getName() : null;
        return feedbackService.canUserSubmitFeedback(id, username)
                .map(ResponseEntity::ok);
    }

    // Advanced Feedback Endpoints (from old-backend)
    
    @GetMapping("/statistics")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public Mono<ResponseEntity<java.util.Map<String, Long>>> getFeedbackStatistics() {
        return feedbackService.getFeedbackStatistics()
                .map(ResponseEntity::ok);
    }

    @GetMapping("/metrics")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public Mono<ResponseEntity<java.util.Map<String, Double>>> getFeedbackMetrics() {
        return feedbackService.getFeedbackMetrics()
                .map(ResponseEntity::ok);
    }

    @GetMapping("/recent")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public Mono<ResponseEntity<java.util.List<FeedbackResponseDto>>> getRecentFeedbacks() {
        return feedbackService.getRecentFeedbacks()
                .collectList()
                .map(ResponseEntity::ok);
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public Mono<ResponseEntity<java.util.List<FeedbackResponseDto>>> getFeedbacksByUser(@PathVariable String userId) {
        return feedbackService.getFeedbacksByUser(userId)
                .collectList()
                .map(ResponseEntity::ok);
    }

    @GetMapping("/department/{departmentId}")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public Mono<ResponseEntity<java.util.List<FeedbackResponseDto>>> getFeedbacksByDepartment(@PathVariable Long departmentId) {
        return feedbackService.getFeedbacksByDepartment(departmentId)
                .collectList()
                .map(ResponseEntity::ok);
    }

    @GetMapping("/department/{departmentId}/wide")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public Mono<ResponseEntity<java.util.List<FeedbackResponseDto>>> getDepartmentWideFeedbacks(@PathVariable Long departmentId) {
        return feedbackService.getDepartmentWideFeedbacks(departmentId)
                .collectList()
                .map(ResponseEntity::ok);
    }

    @PostMapping("/{id}/activate")
    @PreAuthorize("hasRole('ADMIN')")
    public Mono<ResponseEntity<FeedbackResponseDto>> activateFeedback(@PathVariable Long id) {
        return feedbackService.activateFeedback(id)
                .map(ResponseEntity::ok);
    }

    @PostMapping("/{id}/close")
    @PreAuthorize("hasRole('ADMIN')")
    public Mono<ResponseEntity<FeedbackResponseDto>> closeFeedback(@PathVariable Long id) {
        return feedbackService.closeFeedback(id)
                .map(ResponseEntity::ok);
    }
}


