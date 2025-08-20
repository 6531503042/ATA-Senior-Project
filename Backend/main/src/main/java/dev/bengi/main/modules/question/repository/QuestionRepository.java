package dev.bengi.main.modules.question.repository;

import dev.bengi.main.modules.question.model.Question;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface QuestionRepository extends R2dbcRepository<Question, Long> {
}


