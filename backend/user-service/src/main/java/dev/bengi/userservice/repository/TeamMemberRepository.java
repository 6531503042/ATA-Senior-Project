package dev.bengi.userservice.repository;

import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;

import dev.bengi.userservice.domain.model.TeamMember;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Repository
public interface TeamMemberRepository extends R2dbcRepository<TeamMember, Long> {
    
    @Query("SELECT * FROM team_members WHERE user_id = :userId")
    Flux<TeamMember> findByUserId(Long userId);
    
    @Query("SELECT * FROM team_members WHERE team_id = :teamId")
    Flux<TeamMember> findByTeamId(Long teamId);
    
    @Query("SELECT * FROM team_members WHERE user_id = :userId AND team_id = :teamId")
    Mono<TeamMember> findByUserIdAndTeamId(Long userId, Long teamId);
    
    @Query("SELECT * FROM team_members WHERE team_id = :teamId AND is_manager = true")
    Flux<TeamMember> findManagersByTeamId(Long teamId);
} 