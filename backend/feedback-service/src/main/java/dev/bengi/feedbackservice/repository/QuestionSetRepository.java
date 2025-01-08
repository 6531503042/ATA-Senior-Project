package dev.bengi.feedbackservice.repository;

import dev.bengi.feedbackservice.domain.model.QuestionSet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface QuestionSetRepository extends JpaRepository<QuestionSet, Long> {
}
