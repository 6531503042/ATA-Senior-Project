package dev.bengi.main.modules.question.service;

import dev.bengi.main.exception.ErrorCode;
import dev.bengi.main.exception.GlobalServiceException;
import dev.bengi.main.modules.question.dto.*;
import dev.bengi.main.modules.question.model.Question;
import dev.bengi.main.modules.question.repository.QuestionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
@Slf4j
@RequiredArgsConstructor
public class QuestionService {
    private final QuestionRepository questionRepository;
    private final QuestionMapper mapper;

    @Transactional
    public Mono<QuestionResponseDto> create(QuestionRequestDto req) {
        Question entity = mapper.toEntity(req);
        return questionRepository.save(entity).map(mapper::toResponse);
    }

    @Transactional
    public Mono<QuestionResponseDto> update(Long id, QuestionUpdateRequestDto req) {
        return questionRepository.findById(id)
                .switchIfEmpty(Mono.error(new GlobalServiceException(ErrorCode.NOT_FOUND)))
                .flatMap(e -> {
                    mapper.updateEntity(e, req);
                    return questionRepository.save(e);
                })
                .map(mapper::toResponse);
    }

    public Mono<Void> delete(Long id) {
        return questionRepository.existsById(id)
                .flatMap(exists -> exists ? questionRepository.deleteById(id)
                        : Mono.error(new GlobalServiceException(ErrorCode.NOT_FOUND)));
    }

    public Mono<QuestionResponseDto> getById(Long id) {
        return questionRepository.findById(id)
                .switchIfEmpty(Mono.error(new GlobalServiceException(ErrorCode.NOT_FOUND)))
                .map(mapper::toResponse);
    }

    public Flux<QuestionResponseDto> getAll() {
        return questionRepository.findAll().map(mapper::toResponse);
    }
}


