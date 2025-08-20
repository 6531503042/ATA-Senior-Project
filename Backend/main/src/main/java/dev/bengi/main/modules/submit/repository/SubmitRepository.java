package dev.bengi.main.modules.submit.repository;

import dev.bengi.main.modules.submit.model.Submit;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import org.springframework.data.r2dbc.repository.Query;
import reactor.core.publisher.Mono;
import java.time.LocalDateTime;

@Repository
public interface SubmitRepository extends R2dbcRepository<Submit, Long> {
    Flux<Submit> findByFeedbackId(Long feedbackId);
    Flux<Submit> findByUserId(String userId);

    @Query("SELECT COUNT(*) FROM submissions WHERE submitted_at >= :from AND submitted_at < :to")
    Mono<Long> countSubmittedBetween(LocalDateTime from, LocalDateTime to);

    @Query("SELECT * FROM submissions ORDER BY submitted_at DESC LIMIT :limit")
    Flux<Submit> findRecent(int limit);
}


