package dev.bengi.feedbackservice.service.impl;

import dev.bengi.feedbackservice.domain.enums.QuestionCategory;
import dev.bengi.feedbackservice.domain.model.Answer;
import dev.bengi.feedbackservice.domain.model.Feedback;
import dev.bengi.feedbackservice.domain.model.Question;
import dev.bengi.feedbackservice.domain.model.QuestionSet;
import dev.bengi.feedbackservice.domain.payload.request.SubmitFeedbackRequest;
import dev.bengi.feedbackservice.domain.payload.response.FeedbackResponse;
import dev.bengi.feedbackservice.repository.FeedbackRepository;
import dev.bengi.feedbackservice.repository.QuestionSetRepository;
import dev.bengi.feedbackservice.service.FeedbackService;
import lombok.RequiredArgsConstructor;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RequiredArgsConstructor
public class FeedbackServiceImpl implements FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final QuestionSetRepository questionSetRepository;



    @Override
    public Feedback submitFeedback(Long userId, SubmitFeedbackRequest request) {

        // TODO: Validate request
        Map<Long, String> responseMap = request.getResponse().stream()
                .map(FeedbackResponse::getAnswers)
                .flatMap(answer -> answer.entrySet().stream())
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        Map.Entry::getValue,
                        (existing, replacement) -> replacement
                ));

        //Validate exist question-set
        QuestionSet set = questionSetRepository.findById(request.getQuestionSetId())
                .orElseThrow(() -> new RuntimeException("Question set not found"));

        //Validate exist project
        if (!set.getProjectId().equals(request.getProjectId())) {
            throw new RuntimeException("Project not found");
        }

        return Feedback.builder()
                .projectId(request.getProjectId())
                .userId(userId)
                .title(request.getTitle())
                .description(request.getDescription())
                .category(request.getCategory() != null ?
                        QuestionCategory.valueOf(String.valueOf(request.getCategory())) : null)
                .privacyLevel(request.getPrivacyLevel())
                .response(responseMap)
                .submittedAt(Instant.now())
                .build();
    }

    private Map<Long, Answer> mapResponse(List<FeedbackResponse> response) {
        return response.stream()
                .collect(Collectors.toMap(
                        FeedbackResponse::getQuestionId,))
    }
}
