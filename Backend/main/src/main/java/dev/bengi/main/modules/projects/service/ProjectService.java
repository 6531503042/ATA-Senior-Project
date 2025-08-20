package dev.bengi.main.modules.projects.service;

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
}


