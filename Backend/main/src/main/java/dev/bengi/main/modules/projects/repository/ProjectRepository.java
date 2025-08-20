package dev.bengi.main.modules.projects.repository;

import dev.bengi.main.modules.projects.model.Project;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.r2dbc.repository.Query;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import java.time.LocalDateTime;

@Repository
public interface ProjectRepository extends R2dbcRepository<Project, Long> {
    @Query("SELECT * FROM projects ORDER BY created_at DESC LIMIT :limit")
    Flux<Project> findRecent(int limit);

    @Query("SELECT COUNT(*) FROM projects WHERE created_at >= :from AND created_at < :to")
    Mono<Long> countCreatedBetween(LocalDateTime from, LocalDateTime to);
}


