package dev.bengi.feedbackservice.repository;

import dev.bengi.feedbackservice.domain.model.Submit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SubmitRepository extends JpaRepository<Submit, Long> {
    
}
