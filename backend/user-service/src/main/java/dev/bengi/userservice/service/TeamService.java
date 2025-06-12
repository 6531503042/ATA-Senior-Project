package dev.bengi.userservice.service;

import dev.bengi.userservice.domain.model.Team;
import dev.bengi.userservice.domain.model.TeamMember;
import dev.bengi.userservice.domain.model.User;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface TeamService {
    Mono<Team> createTeam(Team team);
    
    Mono<Team> updateTeam(Long id, Team team);
    
    Mono<Team> getTeamById(Long id);
    
    Flux<Team> getAllTeams();
    
    Flux<Team> getTeamsByDepartmentId(Long departmentId);
    
    Mono<Void> deleteTeam(Long id);
    
    Mono<TeamMember> addMemberToTeam(Long teamId, Long userId, String role, boolean isManager);
    
    Mono<TeamMember> updateTeamMember(Long teamId, Long userId, String role, boolean isManager);
    
    Mono<Void> removeTeamMember(Long teamId, Long userId);
    
    Flux<User> getTeamMembers(Long teamId);
    
    Flux<User> getTeamManagers(Long teamId);
    
    Flux<Team> getUserTeams(Long userId);
} 