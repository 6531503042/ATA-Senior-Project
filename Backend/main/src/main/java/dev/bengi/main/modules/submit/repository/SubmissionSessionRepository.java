package dev.bengi.main.modules.submit.repository;

import dev.bengi.main.modules.submit.model.SubmissionSession;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;

@Repository
public interface SubmissionSessionRepository extends R2dbcRepository<SubmissionSession, Long> {
    @Query("SELECT * FROM submission_sessions WHERE user_id = :userId AND ended_at IS NULL ORDER BY started_at DESC LIMIT 1")
    Mono<SubmissionSession> findActiveSession(String userId);

    @Query("SELECT COALESCE(SUM(duration_seconds),0) FROM submission_sessions WHERE user_id = :userId AND started_at >= :from AND started_at < :to")
    Mono<Long> sumDurationForUserBetween(String userId, LocalDateTime from, LocalDateTime to);

    @Query("SELECT COALESCE(SUM(duration_seconds),0) FROM submission_sessions WHERE started_at >= :from AND started_at < :to")
    Mono<Long> sumDurationBetween(LocalDateTime from, LocalDateTime to);

    Flux<SubmissionSession> findByUserId(String userId);
}


