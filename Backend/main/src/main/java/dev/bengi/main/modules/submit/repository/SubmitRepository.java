package dev.bengi.main.modules.submit.repository;

import dev.bengi.main.modules.submit.model.Submit;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;

@Repository
public interface SubmitRepository extends R2dbcRepository<Submit, Long> {
    Flux<Submit> findByFeedbackId(Long feedbackId);
    Flux<Submit> findByUserId(String userId);
}


