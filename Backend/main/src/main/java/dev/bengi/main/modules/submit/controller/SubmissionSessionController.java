package dev.bengi.main.modules.submit.controller;

import dev.bengi.main.modules.submit.service.SubmissionSessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.Map;

@RestController
@RequestMapping("/api/sessions")
@RequiredArgsConstructor
public class SubmissionSessionController {

    private final SubmissionSessionService service;

    @PostMapping("/start")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public Mono<ResponseEntity<Map<String, Object>>> start(Authentication auth, @RequestParam Long feedbackId) {
        String userId = auth.getName();
        return service.start(userId, feedbackId)
                .map(s -> ResponseEntity.ok(Map.of(
                        "id", s.getId(),
                        "startedAt", s.getStartedAt()
                )));
    }

    @PostMapping("/stop")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public Mono<ResponseEntity<Map<String, Object>>> stop(Authentication auth) {
        String userId = auth.getName();
        return service.stop(userId)
                .map(s -> ResponseEntity.ok(Map.of(
                        "id", s.getId(),
                        "durationSeconds", s.getDurationSeconds()
                )));
    }
}


