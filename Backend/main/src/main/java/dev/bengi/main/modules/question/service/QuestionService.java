package dev.bengi.main.modules.question.service;

import dev.bengi.main.common.pagination.PageRequest;
import dev.bengi.main.common.pagination.PageResponse;
import dev.bengi.main.common.pagination.PaginationService;
import dev.bengi.main.exception.ErrorCode;
import dev.bengi.main.exception.GlobalServiceException;
import dev.bengi.main.modules.question.dto.*;
import dev.bengi.main.modules.question.model.Question;
import dev.bengi.main.modules.question.repository.QuestionRepository;
import dev.bengi.main.modules.question.repository.QuestionChoiceRepository;
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
    private final QuestionChoiceRepository questionChoiceRepository;
    private final QuestionMapper mapper;
    private final PaginationService paginationService;

    @Transactional
    public Mono<QuestionResponseDto> create(QuestionRequestDto req) {
        Question entity = mapper.toEntity(req);
        if (req.category() != null) {
            entity.setCategoryString(req.category());
        }
        validateOptionsForType(req.questionType(), req.options());
        return questionRepository.save(entity)
                .flatMap(saved -> upsertChoices(saved.getId(), req.options())
                        .then(loadChoices(saved.getId())
                                .collectList()
                                .map(choices -> new QuestionResponseDto(
                                        saved.getId(),
                                        saved.getText(),
                                        saved.getDescription(),
                                        saved.getQuestionType(),
                                        saved.getCategoryString(),
                                        saved.isRequired(),
                                        saved.getValidationRules(),
                                        choices,
                                        saved.getCreatedAt(),
                                        saved.getUpdatedAt()
                                ))));
    }

    @Transactional
    public Mono<QuestionResponseDto> update(Long id, QuestionUpdateRequestDto req) {
        return questionRepository.findById(id)
                .switchIfEmpty(Mono.error(new GlobalServiceException(ErrorCode.NOT_FOUND)))
                .flatMap(e -> {
                    mapper.updateEntity(e, req);
                    if (req.category() != null) {
                        e.setCategoryString(req.category());
                    }
                    if (req.questionType() != null || req.options() != null) {
                        validateOptionsForType(req.questionType() != null ? req.questionType() : e.getQuestionType(), req.options());
                    }
                    return questionRepository.save(e);
                })
                .flatMap(saved -> upsertChoices(saved.getId(), req.options())
                        .then(loadChoices(saved.getId())
                                .collectList()
                                .map(choices -> new QuestionResponseDto(
                                        saved.getId(),
                                        saved.getText(),
                                        saved.getDescription(),
                                        saved.getQuestionType(),
                                        saved.getCategoryString(),
                                        saved.isRequired(),
                                        saved.getValidationRules(),
                                        choices,
                                        saved.getCreatedAt(),
                                        saved.getUpdatedAt()
                                ))));
    }

    public Mono<Void> delete(Long id) {
        return questionRepository.existsById(id)
                .flatMap(exists -> exists ? questionRepository.deleteById(id)
                        : Mono.error(new GlobalServiceException(ErrorCode.NOT_FOUND)));
    }

    public Mono<QuestionResponseDto> getById(Long id) {
        return questionRepository.findById(id)
                .switchIfEmpty(Mono.error(new GlobalServiceException(ErrorCode.NOT_FOUND)))
                .flatMap(q -> loadChoices(q.getId()).collectList().map(choices -> new QuestionResponseDto(
                        q.getId(), q.getText(), q.getDescription(), q.getQuestionType(), q.getCategoryString(), q.isRequired(), q.getValidationRules(), choices, q.getCreatedAt(), q.getUpdatedAt())));
    }

    public Flux<QuestionResponseDto> getAll() {
        return questionRepository.findAll()
                .flatMap(q -> loadChoices(q.getId()).collectList().map(choices -> new QuestionResponseDto(
                        q.getId(), q.getText(), q.getDescription(), q.getQuestionType(), q.getCategoryString(), q.isRequired(), q.getValidationRules(), choices, q.getCreatedAt(), q.getUpdatedAt())));
    }

    public Mono<PageResponse<QuestionResponseDto>> getAll(PageRequest pageRequest) {
        return paginationService.paginateInMemory(
            questionRepository.findAll()
                .flatMap(q -> loadChoices(q.getId()).collectList().map(choices -> new QuestionResponseDto(
                        q.getId(), q.getText(), q.getDescription(), q.getQuestionType(), q.getCategoryString(), q.isRequired(), q.getValidationRules(), choices, q.getCreatedAt(), q.getUpdatedAt()))),
            pageRequest
        );
    }

    private Mono<Void> upsertChoices(Long questionId, java.util.List<dev.bengi.main.modules.question.dto.QuestionOptionDto> options) {
        if (options == null) {
            // If null, leave existing
            return Mono.empty();
        }
        // Replace strategy: delete all, insert provided in order
        return questionChoiceRepository.deleteByQuestionId(questionId)
                .thenMany(reactor.core.publisher.Flux.fromIterable(options))
                .concatMap(opt -> questionChoiceRepository.insertChoice(questionId, opt.text()))
                .then();
    }

    private reactor.core.publisher.Flux<String> loadChoices(Long questionId) {
        return questionChoiceRepository.findChoicesByQuestionId(questionId)
                .onErrorResume(e -> reactor.core.publisher.Flux.empty());
    }

    private void validateOptionsForType(dev.bengi.main.modules.question.enums.QuestionType type,
                                        java.util.List<dev.bengi.main.modules.question.dto.QuestionOptionDto> options) {
        if (type == null) return;
        switch (type) {
            case MULTIPLE_CHOICE -> {
                if (options == null || options.isEmpty()) {
                    throw new GlobalServiceException(ErrorCode.VALIDATION_ERROR, "Options are required for MULTIPLE_CHOICE");
                }
            }
            case BOOLEAN -> {
                if (options == null || options.size() < 2) {
                    throw new GlobalServiceException(ErrorCode.VALIDATION_ERROR, "Two options are required for BOOLEAN");
                }
            }
            default -> {}
        }
    }
}


