package dev.bengi.feedbackservice.service.impl;

import dev.bengi.feedbackservice.domain.model.FeedbackScore;
import dev.bengi.feedbackservice.domain.model.FeedbackSubmission;
import dev.bengi.feedbackservice.domain.model.Question;
import dev.bengi.feedbackservice.domain.enums.QuestionCategory;
import dev.bengi.feedbackservice.domain.enums.QuestionType;
import dev.bengi.feedbackservice.domain.payload.request.FeedbackScoreRequest;
import dev.bengi.feedbackservice.domain.payload.response.AnswerOptionResponse;
import dev.bengi.feedbackservice.domain.payload.response.FeedbackScoreResponse;
import dev.bengi.feedbackservice.domain.payload.response.QuestionResponse;
import dev.bengi.feedbackservice.repository.FeedbackScoreRepository;
import dev.bengi.feedbackservice.repository.FeedbackSubmissionRepository;
import dev.bengi.feedbackservice.repository.QuestionRepository;
import dev.bengi.feedbackservice.service.FeedbackScoreService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.DoubleSummaryStatistics;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class FeedbackScoreServiceImpl implements FeedbackScoreService {
    private final FeedbackScoreRepository scoreRepository;
    private final FeedbackSubmissionRepository submissionRepository;
    private final QuestionRepository questionRepository;

    @Override
    public FeedbackScoreResponse createScore(FeedbackScoreRequest request) {
        log.debug("Creating new feedback score for submission ID: {}", request.getSubmissionId());
        
        FeedbackSubmission submission = submissionRepository.findById(request.getSubmissionId())
                .orElseThrow(() -> new IllegalArgumentException("Submission not found"));

        // Get questions for the submission
        List<Question> questions = questionRepository.findAllById(submission.getFeedback().getQuestionIds());
        Map<Long, Question> questionMap = questions.stream()
                .collect(Collectors.toMap(Question::getId, q -> q));

        // Calculate scores based on question types
        Map<Long, Double> questionScores = calculateQuestionScores(request.getQuestionScores(), questionMap, submission.getResponses());
        Map<Long, Double> sentimentScores = calculateSentimentScores(submission.getResponses(), questionMap);
        Map<QuestionCategory, Double> categoryScores = calculateCategoryScores(questionScores, questionMap);
        Double totalScore = calculateTotalScore(questionScores, sentimentScores);

        // Create and populate the score entity
        FeedbackScore score = new FeedbackScore();
        score.setSubmission(submission);
        score.setQuestionScores(questionScores);
        score.setSentimentScores(sentimentScores);
        score.setCategoryScores(categoryScores);
        score.setTotalScore(totalScore);
        score.setSatisfactionScore(request.getSatisfactionScore());
        score.setPriorityScore(request.getPriorityScore());
        score.setAdminComments(request.getAdminComments());
        score.setScoredBy(getCurrentUserId());
        score.setScoredAt(LocalDateTime.now());

        // Save the score
        FeedbackScore savedScore = scoreRepository.save(score);
        
        // Mark the submission as reviewed and scored
        submission.setReviewed(true);
        submission.setScored(true);
        submissionRepository.save(submission);

        return mapToScoreResponse(savedScore);
    }

    @Override
    public FeedbackScoreResponse updateScore(Long id, FeedbackScoreRequest request) {
        log.debug("Updating feedback score ID: {}", id);
        
        FeedbackScore existingScore = scoreRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Score not found"));

        // Update score fields
        existingScore.setQuestionScores(request.getQuestionScores());
        existingScore.setSatisfactionScore(request.getSatisfactionScore());
        existingScore.setPriorityScore(request.getPriorityScore());
        existingScore.setAdminComments(request.getAdminComments());
        existingScore.setScoredAt(LocalDateTime.now());

        return mapToScoreResponse(scoreRepository.save(existingScore));
    }

    @Override
    public void deleteScore(Long id) {
        scoreRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public FeedbackScoreResponse getScore(Long id) {
        return mapToScoreResponse(scoreRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Score not found")));
    }

    @Override
    @Transactional(readOnly = true)
    public List<FeedbackScoreResponse> getAllScores() {
        return scoreRepository.findAll().stream()
                .map(this::mapToScoreResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<FeedbackScoreResponse> getScoresBySubmission(Long submissionId) {
        return scoreRepository.findBySubmissionId(submissionId).stream()
                .map(this::mapToScoreResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Double getOverallSatisfactionScore() {
        return scoreRepository.getAverageSatisfactionScore();
    }

    @Override
    @Transactional(readOnly = true)
    public Map<QuestionCategory, Double> getCategoryScores() {
        List<Object[]> results = scoreRepository.getCategoryAverageScores();
        Map<QuestionCategory, Double> scores = new HashMap<>();
        for (Object[] result : results) {
            QuestionCategory category = (QuestionCategory) result[0];
            Double score = (Double) result[1];
            scores.put(category, score);
        }
        return scores;
    }

    @Override
    @Transactional(readOnly = true)
    public List<FeedbackScoreResponse> getRecentScores() {
        return scoreRepository.findRecentScores().stream()
                .map(this::mapToScoreResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Double> getScoringMetrics() {
        Map<String, Double> metrics = new HashMap<>();
        metrics.put("averageSatisfaction", getOverallSatisfactionScore());
        return metrics;
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Long> getPriorityDistribution() {
        Map<String, Long> distribution = new HashMap<>();
        List<FeedbackScore> scores = scoreRepository.findAll();
        
        Map<Integer, Long> priorityCounts = scores.stream()
                .collect(Collectors.groupingBy(
                    score -> score.getPriorityScore().intValue(),
                    Collectors.counting()
                ));
        
        priorityCounts.forEach((priority, count) -> 
            distribution.put("priority_" + priority, count));
        
        return distribution;
    }

    @Override
    @Transactional(readOnly = true)
    public List<FeedbackScoreResponse> getUnscoredSubmissions() {
        return submissionRepository.findAll().stream()
                .filter(submission -> !submission.isScored())
                .map(this::mapSubmissionToScoreResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<FeedbackScoreResponse> getScoredSubmissions() {
        return submissionRepository.findAll().stream()
                .filter(FeedbackSubmission::isScored)
                .map(this::mapSubmissionToScoreResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Long> getScoreStatusCounts() {
        Map<String, Long> counts = new HashMap<>();
        long totalSubmissions = submissionRepository.count();
        long scoredSubmissions = submissionRepository.findAll().stream()
                .filter(FeedbackSubmission::isScored)
                .count();
        
        counts.put("totalSubmissions", totalSubmissions);
        counts.put("scoredSubmissions", scoredSubmissions);
        counts.put("unscoredSubmissions", totalSubmissions - scoredSubmissions);
        counts.put("scoringCompletionRate", scoredSubmissions);
        
        return counts;
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getDetailedStatistics() {
        Map<String, Object> statistics = new HashMap<>();
        
        // Score distribution
        Map<String, Object> scoreDistribution = new HashMap<>();
        DoubleSummaryStatistics satisfactionStats = scoreRepository.findAll().stream()
                .mapToDouble(FeedbackScore::getSatisfactionScore)
                .summaryStatistics();
        
        scoreDistribution.put("satisfaction", Map.of(
            "average", satisfactionStats.getAverage(),
            "min", satisfactionStats.getMin(),
            "max", satisfactionStats.getMax()
        ));
        
        // Priority distribution
        Map<String, Long> priorityDistribution = getPriorityDistribution();
        scoreDistribution.put("priority", priorityDistribution);
        
        // Category scores
        Map<QuestionCategory, Double> categoryScores = getCategoryScores();
        
        // Time metrics
        Map<String, Object> timeMetrics = new HashMap<>();
        timeMetrics.put("averageScoringTime", "2.5 days"); // This should be calculated based on actual data
        
        // Add all statistics
        statistics.put("scoreDistribution", scoreDistribution);
        statistics.put("categoryScores", categoryScores);
        statistics.put("timeMetrics", timeMetrics);
        statistics.put("scoringStatus", getScoreStatusCounts());
        
        return statistics;
    }

    private Map<Long, Double> calculateQuestionScores(
            Map<Long, Double> providedScores,
            Map<Long, Question> questionMap,
            Map<Long, String> responses) {
        
        Map<Long, Double> calculatedScores = new HashMap<>();
        
        for (Map.Entry<Long, String> response : responses.entrySet()) {
            Long questionId = response.getKey();
            String answer = response.getValue();
            Question question = questionMap.get(questionId);
            
            if (question == null) continue;
            
            Double score = switch (question.getQuestionType()) {
                case MULTIPLE_CHOICE, SINGLE_CHOICE -> {
                    Double providedScore = providedScores.get(questionId);
                    yield providedScore != null ? providedScore : 0.0;
                }
                case RATING -> {
                    try {
                        yield Double.parseDouble(answer);
                    } catch (NumberFormatException e) {
                        yield 0.0;
                    }
                }
                case TEXT_BASED -> {
                    Double providedScore = providedScores.get(questionId);
                    yield providedScore != null ? providedScore : 0.0;
                }
                case SENTIMENT -> {
                    // Sentiment is handled separately
                    yield 0.0;
                }
            };
            
            calculatedScores.put(questionId, score);
        }
        
        return calculatedScores;
    }

    private Map<Long, Double> calculateSentimentScores(
            Map<Long, String> responses,
            Map<Long, Question> questionMap) {
        
        Map<Long, Double> sentimentScores = new HashMap<>();
        
        for (Map.Entry<Long, String> response : responses.entrySet()) {
            Long questionId = response.getKey();
            String answer = response.getValue();
            Question question = questionMap.get(questionId);
            
            if (question != null && question.getQuestionType() == QuestionType.SENTIMENT) {
                // Here you would integrate with your sentiment analysis service
                // For now, we'll use a placeholder score
                double sentimentScore = 0.0; // Replace with actual sentiment analysis
                sentimentScores.put(questionId, sentimentScore);
            }
        }
        
        return sentimentScores;
    }

    private Map<QuestionCategory, Double> calculateCategoryScores(
            Map<Long, Double> questionScores,
            Map<Long, Question> questionMap) {
        
        Map<QuestionCategory, List<Double>> categoryScoresList = new HashMap<>();
        
        // Group scores by category
        for (Map.Entry<Long, Double> score : questionScores.entrySet()) {
            Question question = questionMap.get(score.getKey());
            if (question != null) {
                categoryScoresList.computeIfAbsent(question.getCategory(), k -> new ArrayList<>())
                        .add(score.getValue());
            }
        }
        
        // Calculate average score for each category
        return categoryScoresList.entrySet().stream()
                .collect(Collectors.toMap(
                    Map.Entry::getKey,
                    entry -> entry.getValue().stream()
                            .mapToDouble(Double::doubleValue)
                            .average()
                            .orElse(0.0)
                ));
    }

    private Double calculateTotalScore(
            Map<Long, Double> questionScores,
            Map<Long, Double> sentimentScores) {
        
        double totalQuestionScore = questionScores.values().stream()
                .mapToDouble(Double::doubleValue)
                .sum();
        
        double totalSentimentScore = sentimentScores.values().stream()
                .mapToDouble(Double::doubleValue)
                .sum();
        
        int totalQuestions = questionScores.size() + sentimentScores.size();
        if (totalQuestions == 0) return 0.0;
        
        return (totalQuestionScore + totalSentimentScore) / totalQuestions;
    }

    private FeedbackScoreResponse mapToScoreResponse(FeedbackScore score) {
        FeedbackSubmission submission = score.getSubmission();
        
        // Get questions and map them to responses
        List<Question> questions = questionRepository.findAllById(submission.getFeedback().getQuestionIds());
        List<QuestionResponse> questionResponses = questions.stream()
                .map(q -> QuestionResponse.builder()
                        .id(q.getId())
                        .text(q.getText())
                        .description(q.getDescription())
                        .required(q.isRequired())
                        .type(q.getQuestionType())
                        .category(q.getCategory())
                        .answers(q.getChoices().stream()
                                .<AnswerOptionResponse>map(choice -> AnswerOptionResponse.builder()
                                        .text(choice)
                                        .build())
                                .collect(Collectors.toList()))
                        .validationRules(q.getValidationRules())
                        .createdAt(q.getCreatedAt().atZone(ZoneId.systemDefault()))
                        .updatedAt(q.getUpdatedAt() != null ? q.getUpdatedAt().atZone(ZoneId.systemDefault()) : null)
                        .build())
                .collect(Collectors.toList());

        return FeedbackScoreResponse.builder()
                .id(score.getId())
                .submissionId(submission.getId())
                .questionScores(score.getQuestionScores())
                .sentimentScores(score.getSentimentScores())
                .categoryScores(score.getCategoryScores())
                .totalScore(score.getTotalScore())
                .satisfactionScore(score.getSatisfactionScore())
                .priorityScore(score.getPriorityScore())
                .adminComments(score.getAdminComments())
                .scoredBy(score.getScoredBy())
                .scoredAt(score.getScoredAt().atZone(ZoneId.systemDefault()))
                .createdAt(score.getCreatedAt().atZone(ZoneId.systemDefault()))
                .updatedAt(score.getUpdatedAt().atZone(ZoneId.systemDefault()))
                .feedbackTitle(submission.getFeedback().getTitle())
                .submittedBy(submission.getSubmittedBy())
                .questions(questionResponses)
                .responses(submission.getResponses())
                .scored(true)
                .build();
    }

    private FeedbackScoreResponse mapSubmissionToScoreResponse(FeedbackSubmission submission) {
        // Get questions and map them to responses
        List<Question> questions = questionRepository.findAllById(submission.getFeedback().getQuestionIds());
        List<QuestionResponse> questionResponses = questions.stream()
                .map(q -> QuestionResponse.builder()
                        .id(q.getId())
                        .text(q.getText())
                        .description(q.getDescription())
                        .required(q.isRequired())
                        .type(q.getQuestionType())
                        .category(q.getCategory())
                        .answers(q.getChoices().stream()
                                .<AnswerOptionResponse>map(choice -> AnswerOptionResponse.builder()
                                        .text(choice)
                                        .build())
                                .collect(Collectors.toList()))
                        .validationRules(q.getValidationRules())
                        .createdAt(q.getCreatedAt().atZone(ZoneId.systemDefault()))
                        .updatedAt(q.getUpdatedAt() != null ? q.getUpdatedAt().atZone(ZoneId.systemDefault()) : null)
                        .build())
                .collect(Collectors.toList());

        return FeedbackScoreResponse.builder()
                .id(null)
                .submissionId(submission.getId())
                .feedbackTitle(submission.getFeedback().getTitle())
                .submittedBy(submission.getSubmittedBy())
                .questions(questionResponses)
                .responses(submission.getResponses())
                .scored(submission.isScored())
                .createdAt(submission.getCreatedAt().atZone(ZoneId.systemDefault()))
                .updatedAt(submission.getUpdatedAt().atZone(ZoneId.systemDefault()))
                .scoredAt(null)
                .build();
    }

    private String getCurrentUserId() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }
} 