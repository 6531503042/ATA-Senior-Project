package dev.bengi.main.modules.projects.service;

import dev.bengi.main.common.pagination.PageRequest;
import dev.bengi.main.common.pagination.PageResponse;
import dev.bengi.main.common.pagination.PaginationService;
import dev.bengi.main.exception.ErrorCode;
import dev.bengi.main.exception.GlobalServiceException;
import dev.bengi.main.modules.projects.dto.ProjectMapper;
import dev.bengi.main.modules.projects.dto.ProjectRequestDto;
import dev.bengi.main.modules.projects.dto.ProjectResponseDto;
import dev.bengi.main.modules.projects.dto.ProjectUpdateRequestDto;
import dev.bengi.main.modules.projects.model.Project;
import dev.bengi.main.modules.projects.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
@Slf4j
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final ProjectMapper mapper;
    private final dev.bengi.main.modules.projects.repository.ProjectMemberRepository projectMemberRepository;
    private final PaginationService paginationService;

    @Transactional
    public Mono<ProjectResponseDto> create(ProjectRequestDto req) {
        Project entity = mapper.toEntity(req);
        return projectRepository.save(entity)
                .map(mapper::toResponse)
                .doOnSuccess(d -> log.info("Project created: {}", d));
    }

    @Transactional
    public Mono<ProjectResponseDto> update(Long id, ProjectUpdateRequestDto req) {
        return projectRepository.findById(id)
                .switchIfEmpty(Mono.error(new GlobalServiceException(ErrorCode.NOT_FOUND)))
                .flatMap(e -> {
                    mapper.updateEntity(e, req);
                    return projectRepository.save(e);
                })
                .map(mapper::toResponse)
                .doOnSuccess(d -> log.info("Project updated: {}", d));
    }

    public Mono<Void> delete(Long id) {
        return projectRepository.existsById(id)
                .flatMap(exists -> exists ? projectRepository.deleteById(id)
                        : Mono.error(new GlobalServiceException(ErrorCode.NOT_FOUND)))
                .doOnSuccess(v -> log.info("Project deleted: {}", id));
    }

    public Mono<ProjectResponseDto> getById(Long id) {
        return projectRepository.findById(id)
                .switchIfEmpty(Mono.error(new GlobalServiceException(ErrorCode.NOT_FOUND)))
                .map(mapper::toResponse)
                .doOnSuccess(d -> log.info("Project found: {}", d));
    }

    public Flux<ProjectResponseDto> getAll() {
        return projectRepository.findAll()
                .map(mapper::toResponse)
                .doOnNext(d -> log.info("Project found: {}", d));
    }

    public Mono<PageResponse<ProjectResponseDto>> getAll(PageRequest pageRequest) {
        return paginationService.paginateInMemory(
            projectRepository.findAll().map(mapper::toResponse),
            pageRequest
        );
    }

    // Members management
    public Mono<Void> addMembers(Long projectId, java.util.List<Long> memberIds) {
        return reactor.core.publisher.Flux.fromIterable(memberIds)
                .flatMap(userId -> projectMemberRepository.addMember(projectId, userId))
                .then();
    }

    public Mono<Void> removeMembers(Long projectId, java.util.List<Long> memberIds) {
        return reactor.core.publisher.Flux.fromIterable(memberIds)
                .flatMap(userId -> projectMemberRepository.removeMember(projectId, userId))
                .then();
    }

    // Additional methods for employee endpoints
    
    public Mono<PageResponse<ProjectResponseDto>> getProjectsByMember(Long userId, PageRequest pageRequest) {
        String baseQuery = """
            SELECT p.* FROM projects p
            JOIN project_members pm ON p.id = pm.project_id
            WHERE pm.user_id = :userId
            """;
        
        String countQuery = """
            SELECT COUNT(*) FROM projects p
            JOIN project_members pm ON p.id = pm.project_id
            WHERE pm.user_id = :userId
            """;
        
        return paginationService.executePaginatedQuery(
            baseQuery,
            countQuery,
            pageRequest,
            java.util.Set.of("id", "name", "created_at", "updated_at"),
            java.util.Set.of("name", "description"),
            this::executeProjectQuery,
            this::executeCountQuery
        );
    }
    
    public Mono<Long> countProjectsByMember(Long userId) {
        return projectMemberRepository.findUserIdsByProjectId(userId).count();
    }
    
    public Mono<Long> countProjectsJoinedSince(Long userId, java.time.LocalDateTime since) {
        return Mono.just(0L); // Placeholder implementation
    }
    
    public Mono<Double> getProjectContributionScore(Long userId, java.time.LocalDateTime since) {
        return Mono.just(75.0); // Placeholder implementation
    }
    
    private Flux<ProjectResponseDto> executeProjectQuery(String query) {
        return Flux.empty(); // This should be implemented with actual database client
    }
    
    private Mono<Long> executeCountQuery(String query) {
        return Mono.just(0L); // This should be implemented with actual database client
    }
}


