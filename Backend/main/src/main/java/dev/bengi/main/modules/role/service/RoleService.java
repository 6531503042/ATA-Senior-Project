package dev.bengi.main.modules.role.service;

import dev.bengi.main.modules.role.dto.RoleMapper;
import dev.bengi.main.modules.role.dto.RoleRequestCreate;
import dev.bengi.main.modules.role.dto.RoleRequestUpdate;
import dev.bengi.main.modules.role.dto.RoleResponse;
import dev.bengi.main.modules.role.model.Role;
import dev.bengi.main.modules.role.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import dev.bengi.main.exception.ErrorCode;
import dev.bengi.main.exception.GlobalServiceException;

@Service
@Slf4j
@RequiredArgsConstructor
public class RoleService {

    private final RoleRepository roleRepository;
    private final RoleMapper mapper;

    @Transactional
    public Mono<RoleResponse> create(RoleRequestCreate req) {
        return roleRepository.existsByName(req.name().asString())
                .flatMap(exists -> exists
                        ? Mono.error(new dev.bengi.main.exception.GlobalServiceException(dev.bengi.main.exception.ErrorCode.CONFLICT, "Role already exists"))
                        : Mono.defer(() -> {
                            Role entity = mapper.toEntity(req);
                            return roleRepository.save(entity)
                                    .map(mapper::toResponse)
                                    .doOnSuccess(d -> log.info("Role created: {}", d));
                        }));
    }

    @Transactional
    public Mono<RoleResponse> update(Long id, RoleRequestUpdate req) {
        return roleRepository.findById(id)
                .switchIfEmpty(Mono.error(new GlobalServiceException(ErrorCode.NOT_FOUND)))
                .flatMap(e -> {
                    mapper.updateEntity(e, req);
                    return roleRepository.save(e);
                })
                .map(mapper::toResponse)
                .doOnSuccess(d -> log.info("Role updated: {}", d));
    }

    public Mono<Void> delete(Long id) {
        return roleRepository.existsById(id)
                .flatMap(exists -> exists ? roleRepository.deleteById(id)
                        : Mono.error(new GlobalServiceException(ErrorCode.NOT_FOUND)))
                .doOnSuccess(v -> log.info("Role deleted: {}", id));
    }

    public Mono<RoleResponse> getById(Long id) {
        return roleRepository.findById(id)
                .switchIfEmpty(Mono.error(new GlobalServiceException(ErrorCode.NOT_FOUND)))
                .map(mapper::toResponse);
    }

    public Flux<RoleResponse> getAll() {
        return roleRepository.findAll().map(mapper::toResponse);
    }
}
