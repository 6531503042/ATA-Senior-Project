package dev.bengi.main.modules.submit.controller;

import dev.bengi.main.common.pagination.PageResponse;
import dev.bengi.main.common.pagination.PaginationService;
import dev.bengi.main.modules.submit.dto.SubmitRequestDto;
import dev.bengi.main.modules.submit.dto.SubmitResponseDto;
import dev.bengi.main.modules.submit.service.SubmitService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/submits")
@RequiredArgsConstructor
public class SubmitController {
    private final SubmitService submitService;
    private final PaginationService paginationService;

    @PostMapping
    public Mono<ResponseEntity<SubmitResponseDto>> create(Authentication auth, @RequestBody @Valid SubmitRequestDto req) {
        String userId = auth != null ? auth.getName() : null;
        return submitService.submit(userId, req)
                .map(d -> ResponseEntity.status(HttpStatus.CREATED).body(d));
    }

    @GetMapping("/{id}")
    public Mono<ResponseEntity<SubmitResponseDto>> get(@PathVariable Long id) {
        return submitService.getById(id).map(ResponseEntity::ok);
    }

    @GetMapping("/feedback/{feedbackId}")
    public Mono<ResponseEntity<PageResponse<SubmitResponseDto>>> getByFeedback(
            @PathVariable Long feedbackId, 
            ServerWebExchange exchange) {
        var pageRequest = paginationService.parsePageRequest(exchange);
        return submitService.getByFeedback(feedbackId, pageRequest)
                .map(ResponseEntity::ok);
    }

    @GetMapping("/me")
    public Mono<ResponseEntity<PageResponse<SubmitResponseDto>>> mySubmissions(
            Authentication auth, 
            ServerWebExchange exchange) {
        String userId = auth != null ? auth.getName() : null;
        var pageRequest = paginationService.parsePageRequest(exchange);
        return submitService.getByUser(userId, pageRequest)
                .map(ResponseEntity::ok);
    }
}


