package dev.bengi.main.modules.feedback.repository;

import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import reactor.core.publisher.Flux;

public interface FeedbackQuestionRepository extends R2dbcRepository<FeedbackQuestionRepository.FeedbackQuestionRow, Long> {

    @Query("INSERT INTO feedback_questions(feedback_id, question_id) VALUES (:feedbackId, :questionId) ON CONFLICT DO NOTHING")
    Flux<Void> addQuestion(Long feedbackId, Long questionId);

    @Query("DELETE FROM feedback_questions WHERE feedback_id = :feedbackId AND question_id = :questionId")
    Flux<Void> removeQuestion(Long feedbackId, Long questionId);

    @Query("SELECT question_id FROM feedback_questions WHERE feedback_id = :feedbackId")
    Flux<Long> findQuestionIdsByFeedbackId(Long feedbackId);

    class FeedbackQuestionRow { public Long id; }
}


