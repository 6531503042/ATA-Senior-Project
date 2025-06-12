package dev.bengi.userservice.service.impl;

import dev.bengi.userservice.domain.model.Team;
import dev.bengi.userservice.domain.model.TeamMember;
import dev.bengi.userservice.domain.model.User;
import dev.bengi.userservice.exception.ErrorCode;
import dev.bengi.userservice.exception.GlobalServiceException;
import dev.bengi.userservice.repository.TeamMemberRepository;
import dev.bengi.userservice.repository.TeamRepository;
import dev.bengi.userservice.repository.UserRepository;
import dev.bengi.userservice.service.TeamService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class TeamServiceImpl implements TeamService {

    private final TeamRepository teamRepository;
    private final TeamMemberRepository teamMemberRepository;
    private final UserRepository userRepository;

    @Override
    public Mono<Team> createTeam(Team team) {
        team.setCreatedAt(LocalDateTime.now());
        team.setUpdatedAt(LocalDateTime.now());
        return teamRepository.save(team)
                .doOnSuccess(t -> log.info("Created team: {}", t.getName()))
                .doOnError(e -> log.error("Error creating team: {}", e.getMessage()));
    }

    @Override
    public Mono<Team> updateTeam(Long id, Team team) {
        return teamRepository.findById(id)
                .switchIfEmpty(Mono.error(new GlobalServiceException(ErrorCode.INTERNAL_ERROR)))
                .flatMap(existingTeam -> {
                    existingTeam.setName(team.getName());
                    existingTeam.setDescription(team.getDescription());
                    existingTeam.setDepartmentId(team.getDepartmentId());
                    existingTeam.setUpdatedAt(LocalDateTime.now());
                    return teamRepository.save(existingTeam);
                })
                .doOnSuccess(t -> log.info("Updated team: {}", t.getName()))
                .doOnError(e -> log.error("Error updating team: {}", e.getMessage()));
    }

    @Override
    public Mono<Team> getTeamById(Long id) {
        return teamRepository.findById(id)
                .switchIfEmpty(Mono.error(new GlobalServiceException(ErrorCode.INTERNAL_ERROR)));
    }

    @Override
    public Flux<Team> getAllTeams() {
        return teamRepository.findAll();
    }

    @Override
    public Flux<Team> getTeamsByDepartmentId(Long departmentId) {
        return teamRepository.findByDepartmentId(departmentId);
    }

    @Override
    public Mono<Void> deleteTeam(Long id) {
        return teamRepository.findById(id)
                .switchIfEmpty(Mono.error(new GlobalServiceException(ErrorCode.INTERNAL_ERROR)))
                .flatMap(team -> teamMemberRepository.findByTeamId(team.getId())
                        .flatMap(teamMemberRepository::delete)
                        .then(teamRepository.delete(team)));
    }

    @Override
    public Mono<TeamMember> addMemberToTeam(Long teamId, Long userId, String role, boolean isManager) {
        return Mono.zip(
                teamRepository.findById(teamId)
                        .switchIfEmpty(Mono.error(new GlobalServiceException(ErrorCode.INTERNAL_ERROR))),
                userRepository.findById(userId)
                        .switchIfEmpty(Mono.error(new GlobalServiceException(ErrorCode.USER_NOT_FOUND)))
        ).flatMap(tuple -> {
            TeamMember teamMember = TeamMember.builder()
                    .teamId(teamId)
                    .userId(userId)
                    .role(role)
                    .isManager(isManager)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();
            return teamMemberRepository.save(teamMember);
        });
    }

    @Override
    public Mono<TeamMember> updateTeamMember(Long teamId, Long userId, String role, boolean isManager) {
        return teamMemberRepository.findByUserIdAndTeamId(userId, teamId)
                .switchIfEmpty(Mono.error(new GlobalServiceException(ErrorCode.INTERNAL_ERROR)))
                .flatMap(teamMember -> {
                    teamMember.setRole(role);
                    teamMember.setManager(isManager);
                    teamMember.setUpdatedAt(LocalDateTime.now());
                    return teamMemberRepository.save(teamMember);
                });
    }

    @Override
    public Mono<Void> removeTeamMember(Long teamId, Long userId) {
        return teamMemberRepository.findByUserIdAndTeamId(userId, teamId)
                .switchIfEmpty(Mono.error(new GlobalServiceException(ErrorCode.INTERNAL_ERROR)))
                .flatMap(teamMemberRepository::delete);
    }

    @Override
    public Flux<User> getTeamMembers(Long teamId) {
        return teamMemberRepository.findByTeamId(teamId)
                .flatMap(member -> userRepository.findById(member.getUserId()));
    }

    @Override
    public Flux<User> getTeamManagers(Long teamId) {
        return teamMemberRepository.findManagersByTeamId(teamId)
                .flatMap(member -> userRepository.findById(member.getUserId()));
    }

    @Override
    public Flux<Team> getUserTeams(Long userId) {
        return teamMemberRepository.findByUserId(userId)
                .flatMap(member -> teamRepository.findById(member.getTeamId()));
    }
} 