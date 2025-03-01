package dev.bengi.feedbackservice.service;

import java.util.Map;

public interface DashboardService {
    // Project Dashboard
    Map<String, Object> getProjectDashboardMetrics();
    
    // Question Dashboard
    Map<String, Object> getQuestionDashboardMetrics();
    Map<String, Object> getQuestionTypeMetrics();
    Map<String, Object> getQuestionCategoryMetrics();
    Map<String, Object> getQuestionResponseMetrics();
    Map<String, Object> getPerformanceMetricsGraph();
    
    // Feedback Dashboard
    Map<String, Object> getFeedbackDashboardMetrics();
    Map<String, Object> getFeedbackSatisfactionMetrics();
    Map<String, Object> getFeedbackSentimentDistribution();
    Map<String, Object> getYearOverYearAnalysis();
} 