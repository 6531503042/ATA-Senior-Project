package dev.bengi.main.modules.submit.service;

import dev.bengi.main.modules.submit.model.SubmissionSession;
import dev.bengi.main.modules.submit.repository.SubmissionSessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class SubmissionSessionService {

    private final SubmissionSessionRepository repository;

    public Mono<SubmissionSession> start(String userId, Long feedbackId) {
        return repository.findActiveSession(userId)
                .flatMap(active -> {
                    if (active.getEndedAt() == null) {
                        active.setEndedAt(LocalDateTime.now());
                        long seconds = Duration.between(active.getStartedAt(), active.getEndedAt()).getSeconds();
                        active.setDurationSeconds(Math.max(seconds, 0));
                        active.setUpdatedAt(LocalDateTime.now());
                        return repository.save(active);
                    }
                    return Mono.just(active);
                })
                .onErrorResume(e -> Mono.empty())
                .then(Mono.defer(() -> {
                    SubmissionSession session = new SubmissionSession();
                    session.setUserId(userId);
                    session.setFeedbackId(feedbackId);
                    session.setStartedAt(LocalDateTime.now());
                    session.setCreatedAt(LocalDateTime.now());
                    session.setUpdatedAt(LocalDateTime.now());
                    return repository.save(session);
                }));
    }

    public Mono<SubmissionSession> stop(String userId) {
        return repository.findActiveSession(userId)
                .flatMap(active -> {
                    active.setEndedAt(LocalDateTime.now());
                    long seconds = Duration.between(active.getStartedAt(), active.getEndedAt()).getSeconds();
                    active.setDurationSeconds(Math.max(seconds, 0));
                    active.setUpdatedAt(LocalDateTime.now());
                    return repository.save(active);
                });
    }

    public Mono<Long> totalSecondsForUserThisMonth(String userId) {
        LocalDateTime from = LocalDateTime.now().withDayOfMonth(1).toLocalDate().atStartOfDay();
        LocalDateTime to = from.plusMonths(1);
        return repository.sumDurationForUserBetween(userId, from, to).defaultIfEmpty(0L);
    }

    public Mono<Long> totalSecondsThisMonth() {
        LocalDateTime from = LocalDateTime.now().withDayOfMonth(1).toLocalDate().atStartOfDay();
        LocalDateTime to = from.plusMonths(1);
        return repository.sumDurationBetween(from, to).defaultIfEmpty(0L);
    }
}


