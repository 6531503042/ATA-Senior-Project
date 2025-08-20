package dev.bengi.main.modules.feedback.repository;

import dev.bengi.main.modules.feedback.model.Feedback;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FeedbackRepository extends R2dbcRepository<Feedback, Long> {
}


