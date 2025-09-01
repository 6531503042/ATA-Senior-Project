package dev.bengi.main.modules.department.service;

import dev.bengi.main.common.pagination.PageRequest;
import dev.bengi.main.common.pagination.PageResponse;
import dev.bengi.main.common.pagination.PaginationService;
import dev.bengi.main.exception.ErrorCode;
import dev.bengi.main.exception.GlobalServiceException;
import dev.bengi.main.modules.department.dto.DepartmentMapper;
import dev.bengi.main.modules.department.dto.DepartmentRequestDto;
import dev.bengi.main.modules.department.dto.DepartmentResponseDto;
import dev.bengi.main.modules.department.dto.DepartmentUpdateRequestDto;
import dev.bengi.main.modules.department.model.Department;
import dev.bengi.main.modules.user.dto.UserResponseDto;
import dev.bengi.main.modules.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import dev.bengi.main.modules.department.repository.DepartmentRepository;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
@Slf4j
@RequiredArgsConstructor
public class DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final DepartmentMapper mapper;
    private final PaginationService paginationService;
    private final UserService userService;

    @Transactional
    public Mono<DepartmentResponseDto> create(DepartmentRequestDto req) {
        Department entity = mapper.toEntity(req);
        return departmentRepository.save(entity)
                .map(mapper::toResponse)
                .doOnSuccess(d -> log.info("Department created: {}", d));
    }

    @Transactional
    public Mono<DepartmentResponseDto> update(Long id,DepartmentUpdateRequestDto req) {
        return departmentRepository.findById(id)
                .switchIfEmpty(Mono.error(new GlobalServiceException(ErrorCode.NOT_FOUND)))
                .flatMap(e -> {
                    mapper.updateEntity(e, req);
                    return departmentRepository.save(e);
                })
                .map(mapper::toResponse)
                .doOnSuccess(d -> log.info("Department updated: {}", d));
    }

    public Mono<Void> delete(Long id) {
        return departmentRepository.existsById(id)
                .flatMap(exists -> exists ? departmentRepository.deleteById(id)
                        : Mono.error(new GlobalServiceException(ErrorCode.NOT_FOUND)))
                .doOnSuccess(v -> log.info("Department deleted: {}", id));
    }

    public Mono<DepartmentResponseDto> getById(Long id) {
        return departmentRepository.findById(id)
                .switchIfEmpty(Mono.error(new GlobalServiceException(ErrorCode.NOT_FOUND)))
                .map(mapper::toResponse)
                .doOnSuccess(d -> log.info("Department found: {}", d));
    }

    public Flux<DepartmentResponseDto> getAll() {
        return departmentRepository.findAll()
                .map(mapper::toResponse)
                .doOnNext(d -> log.info("Department found: {}", d));
    }

    public Flux<DepartmentResponseDto> listActive() {
        return departmentRepository.findByActive(true).map(mapper::toResponse);
    }

    public Mono<PageResponse<DepartmentResponseDto>> listActive(PageRequest pageRequest) {
        return paginationService.paginateInMemory(
            departmentRepository.findByActive(true).map(mapper::toResponse),
            pageRequest
        );
    }

    public Mono<PageResponse<UserResponseDto>> getDepartmentMembers(Long departmentId, PageRequest pageRequest) {
        return userService.getUsersByDepartmentId(departmentId, pageRequest)
                .doOnSuccess(d -> log.info("Found {} members for department {}", 
                    d.getContent().size(), departmentId));
    }
}
