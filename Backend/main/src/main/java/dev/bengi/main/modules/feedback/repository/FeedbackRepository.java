package dev.bengi.main.modules.feedback.repository;

import dev.bengi.main.modules.feedback.model.Feedback;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.r2dbc.repository.Query;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import java.time.LocalDateTime;

@Repository
public interface FeedbackRepository extends R2dbcRepository<Feedback, Long> {
    @Query("SELECT COUNT(*) FROM feedbacks WHERE created_at >= :from AND created_at < :to")
    Mono<Long> countCreatedBetween(LocalDateTime from, LocalDateTime to);

    @Query("SELECT * FROM feedbacks ORDER BY created_at DESC LIMIT :limit")
    Flux<Feedback> findRecent(int limit);
}


