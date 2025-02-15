package dev.bengi.feedbackservice.service;

import dev.bengi.feedbackservice.domain.payload.request.FeedbackScoreRequest;
import dev.bengi.feedbackservice.domain.payload.response.FeedbackScoreResponse;
import dev.bengi.feedbackservice.domain.enums.QuestionCategory;

import java.util.List;
import java.util.Map;

public interface FeedbackScoreService {
    FeedbackScoreResponse createScore(FeedbackScoreRequest request);
    FeedbackScoreResponse updateScore(Long id, FeedbackScoreRequest request);
    void deleteScore(Long id);
    FeedbackScoreResponse getScore(Long id);
    List<FeedbackScoreResponse> getAllScores();
    List<FeedbackScoreResponse> getScoresBySubmission(Long submissionId);
    
    // Score Status methods
    List<FeedbackScoreResponse> getUnscoredSubmissions();
    List<FeedbackScoreResponse> getScoredSubmissions();
    Map<String, Long> getScoreStatusCounts();
    
    // Statistics methods
    Double getOverallSatisfactionScore();
    Map<QuestionCategory, Double> getCategoryScores();
    List<FeedbackScoreResponse> getRecentScores();
    Map<String, Double> getScoringMetrics();
    Map<String, Long> getPriorityDistribution();
    Map<String, Object> getDetailedStatistics();
} 