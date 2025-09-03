package dev.bengi.main.modules.question.repository;

import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Repository
public interface QuestionChoiceRepository extends R2dbcRepository<QuestionChoiceRepository.Row, Long> {

    @Query("SELECT choice FROM question_choices WHERE question_id = :questionId ORDER BY id ASC")
    Flux<String> findChoicesByQuestionId(Long questionId);

    @Query("DELETE FROM question_choices WHERE question_id = :questionId")
    Mono<Void> deleteByQuestionId(Long questionId);

    @Query("INSERT INTO question_choices(question_id, choice) VALUES (:questionId, :choice)")
    Mono<Void> insertChoice(Long questionId, String choice);

    class Row { public Long id; }
}


