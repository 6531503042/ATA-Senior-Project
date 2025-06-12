package dev.bengi.userservice.controller;

import dev.bengi.userservice.domain.model.Team;
import dev.bengi.userservice.domain.model.TeamMember;
import dev.bengi.userservice.domain.model.User;
import dev.bengi.userservice.domain.payload.request.TeamMemberRequest;
import dev.bengi.userservice.domain.payload.request.TeamRequest;
import dev.bengi.userservice.service.TeamService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/teams")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Team Management", description = "APIs for managing teams")
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class TeamController {

    private final TeamService teamService;

    @PostMapping
    @Operation(summary = "Create a new team")
    public Mono<ResponseEntity<Team>> createTeam(@Valid @RequestBody TeamRequest request) {
        Team team = Team.builder()
                .name(request.getName())
                .description(request.getDescription())
                .departmentId(request.getDepartmentId())
                .build();
        return teamService.createTeam(team)
                .map(created -> ResponseEntity.status(HttpStatus.CREATED).body(created));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing team")
    public Mono<ResponseEntity<Team>> updateTeam(
            @PathVariable Long id,
            @Valid @RequestBody TeamRequest request) {
        Team team = Team.builder()
                .name(request.getName())
                .description(request.getDescription())
                .departmentId(request.getDepartmentId())
                .build();
        return teamService.updateTeam(id, team)
                .map(ResponseEntity::ok);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @Operation(summary = "Get team by ID")
    public Mono<ResponseEntity<Team>> getTeam(@PathVariable Long id) {
        return teamService.getTeamById(id)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_USER')")
    @Operation(summary = "Get all teams")
    public Flux<Team> getAllTeams() {
        return teamService.getAllTeams();
    }

    @GetMapping("/department/{departmentId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @Operation(summary = "Get teams by department ID")
    public Flux<Team> getTeamsByDepartment(@PathVariable Long departmentId) {
        return teamService.getTeamsByDepartmentId(departmentId);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a team")
    public Mono<ResponseEntity<Void>> deleteTeam(@PathVariable Long id) {
        return teamService.deleteTeam(id)
                .then(Mono.just(ResponseEntity.noContent().<Void>build()));
    }

    @PostMapping("/{teamId}/members")
    @Operation(summary = "Add a member to a team")
    public Mono<ResponseEntity<TeamMember>> addTeamMember(
            @PathVariable Long teamId,
            @Valid @RequestBody TeamMemberRequest request) {
        return teamService.addMemberToTeam(teamId, request.getUserId(), request.getRole(), request.isManager())
                .map(member -> ResponseEntity.status(HttpStatus.CREATED).body(member));
    }

    @PutMapping("/{teamId}/members/{userId}")
    @Operation(summary = "Update a team member")
    public Mono<ResponseEntity<TeamMember>> updateTeamMember(
            @PathVariable Long teamId,
            @PathVariable Long userId,
            @Valid @RequestBody TeamMemberRequest request) {
        return teamService.updateTeamMember(teamId, userId, request.getRole(), request.isManager())
                .map(ResponseEntity::ok);
    }

    @DeleteMapping("/{teamId}/members/{userId}")
    @Operation(summary = "Remove a member from a team")
    public Mono<ResponseEntity<Void>> removeTeamMember(
            @PathVariable Long teamId,
            @PathVariable Long userId) {
        return teamService.removeTeamMember(teamId, userId)
                .then(Mono.just(ResponseEntity.noContent().<Void>build()));
    }

    @GetMapping("/{teamId}/members")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @Operation(summary = "Get all members of a team")
    public Flux<User> getTeamMembers(@PathVariable Long teamId) {
        return teamService.getTeamMembers(teamId);
    }

    @GetMapping("/{teamId}/managers")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @Operation(summary = "Get all managers of a team")
    public Flux<User> getTeamManagers(@PathVariable Long teamId) {
        return teamService.getTeamManagers(teamId);
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @Operation(summary = "Get all teams for a user")
    public Flux<Team> getUserTeams(@PathVariable Long userId) {
        return teamService.getUserTeams(userId);
    }
} 