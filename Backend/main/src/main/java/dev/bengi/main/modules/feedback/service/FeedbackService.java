package dev.bengi.main.modules.feedback.service;

import dev.bengi.main.exception.ErrorCode;
import dev.bengi.main.exception.GlobalServiceException;
import dev.bengi.main.modules.feedback.model.Feedback;
import dev.bengi.main.modules.feedback.repository.FeedbackRepository;
import dev.bengi.main.modules.feedback.repository.FeedbackQuestionRepository;
import dev.bengi.main.modules.feedback.repository.FeedbackTargetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public class FeedbackService {
    private final FeedbackRepository feedbackRepository;
    private final FeedbackQuestionRepository feedbackQuestionRepository;
    private final FeedbackTargetRepository feedbackTargetRepository;

    public Mono<Feedback> get(Long id) {
        return feedbackRepository.findById(id)
                .switchIfEmpty(Mono.error(new GlobalServiceException(ErrorCode.NOT_FOUND)));
    }

    @Transactional
    public Mono<Void> addQuestions(Long feedbackId, java.util.List<Long> questionIds) {
        return Flux.fromIterable(questionIds)
                .flatMap(qid -> feedbackQuestionRepository.addQuestion(feedbackId, qid))
                .then();
    }

    @Transactional
    public Mono<Void> removeQuestions(Long feedbackId, java.util.List<Long> questionIds) {
        return Flux.fromIterable(questionIds)
                .flatMap(qid -> feedbackQuestionRepository.removeQuestion(feedbackId, qid))
                .then();
    }

    @Transactional
    public Mono<Void> addTargetUsers(Long feedbackId, java.util.List<Long> userIds) {
        return Flux.fromIterable(userIds)
                .flatMap(uid -> feedbackTargetRepository.addTargetUser(feedbackId, uid))
                .then();
    }

    @Transactional
    public Mono<Void> removeTargetUsers(Long feedbackId, java.util.List<Long> userIds) {
        return Flux.fromIterable(userIds)
                .flatMap(uid -> feedbackTargetRepository.removeTargetUser(feedbackId, uid))
                .then();
    }

    @Transactional
    public Mono<Void> addTargetDepartments(Long feedbackId, java.util.List<Long> departmentIds) {
        return Flux.fromIterable(departmentIds)
                .flatMap(did -> feedbackTargetRepository.addTargetDepartment(feedbackId, did))
                .then();
    }

    @Transactional
    public Mono<Void> removeTargetDepartments(Long feedbackId, java.util.List<Long> departmentIds) {
        return Flux.fromIterable(departmentIds)
                .flatMap(did -> feedbackTargetRepository.removeTargetDepartment(feedbackId, did))
                .then();
    }
}


