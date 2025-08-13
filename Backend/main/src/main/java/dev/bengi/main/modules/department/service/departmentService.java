package dev.bengi.main.modules.department.service;

import dev.bengi.main.modules.department.dto.DepartmentMapper;
import dev.bengi.main.modules.department.dto.DepartmentRequestDto;
import dev.bengi.main.modules.department.dto.DepartmentResponseDto;
import dev.bengi.main.modules.department.dto.DepartmentUpdateRequestDto;
import dev.bengi.main.modules.department.model.Department;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import dev.bengi.main.modules.department.repository.DepartmentRepository;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Mono;

@Service
@Slf4j
@RequiredArgsConstructor
public class DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final DepartmentMapper mapper;

    @Transactional
    public Mono<DepartmentResponseDto> create(DepartmentRequestDto req) {
        Department entity = mapper.toEntity(req);
        return departmentRepository.save(entity)
                .map(mapper::toResponse)
                .doOnSuccess(d -> log.info("Department created: {}", d));
    }

    public Mono<DepartmentResponseDto> update(Long id,DepartmentUpdateRequestDto req) {
        return departmentRepository.findById(id)
                switc
    }
}
