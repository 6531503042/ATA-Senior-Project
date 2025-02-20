package dev.bengi.feedbackservice.service.impl;

import dev.bengi.feedbackservice.domain.enums.QuestionCategory;
import dev.bengi.feedbackservice.domain.enums.QuestionType;
import dev.bengi.feedbackservice.domain.enums.SentimentType;
import dev.bengi.feedbackservice.domain.model.Question;
import dev.bengi.feedbackservice.domain.model.Project;
import dev.bengi.feedbackservice.repository.FeedbackRepository;
import dev.bengi.feedbackservice.repository.FeedbackSubmissionRepository;
import dev.bengi.feedbackservice.repository.ProjectRepository;
import dev.bengi.feedbackservice.repository.QuestionRepository;
import dev.bengi.feedbackservice.service.DashboardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardServiceImpl implements DashboardService {
    private final ProjectRepository projectRepository;
    private final QuestionRepository questionRepository;
    private final FeedbackRepository feedbackRepository;
    private final FeedbackSubmissionRepository submissionRepository;

    @Override
    public Map<String, Object> getProjectDashboardMetrics() {
        Map<String, Object> metrics = new HashMap<>();
        LocalDateTime now = LocalDateTime.now();

        // Total projects
        metrics.put("totalProjects", projectRepository.count());

        // Active projects (end date > now)
        metrics.put("activeProjects", projectRepository.countByProjectEndDateAfter(now));

        // Completed projects (end date <= now)
        metrics.put("completedProjects", projectRepository.countByProjectEndDateBefore(now));

        // Total members across all projects
        metrics.put("totalMembers", projectRepository.findAll().stream()
                .flatMap(p -> p.getMemberIds().stream())
                .distinct()
                .count());

        return metrics;
    }

    @Override
    public Map<String, Object> getQuestionDashboardMetrics() {
        Map<String, Object> metrics = new HashMap<>();

        // Total questions count
        metrics.put("totalQuestions", questionRepository.count());

        // Questions by type
        Map<QuestionType, Long> questionsByType = questionRepository.findAll().stream()
                .collect(Collectors.groupingBy(
                    q -> q.getQuestionType(),
                    Collectors.counting()
                ));
        metrics.put("questionsByType", questionsByType);

        // Questions by category
        Map<QuestionCategory, Long> questionsByCategory = questionRepository.findAll().stream()
                .collect(Collectors.groupingBy(
                    q -> q.getCategory(),
                    Collectors.counting()
                ));
        metrics.put("questionsByCategory", questionsByCategory);

        return metrics;
    }

    @Override
    public Map<String, Object> getQuestionTypeMetrics() {
        Map<String, Object> metrics = new HashMap<>();
        
        for (QuestionType type : QuestionType.values()) {
            metrics.put(type.name(), questionRepository.countByQuestionType(type));
        }

        return metrics;
    }

    @Override
    public Map<String, Object> getQuestionCategoryMetrics() {
        Map<String, Object> metrics = new HashMap<>();
        
        for (QuestionCategory category : QuestionCategory.values()) {
            metrics.put(category.name(), questionRepository.countByCategory(category));
        }

        return metrics;
    }

    @Override
    public Map<String, Object> getQuestionResponseMetrics() {
        Map<String, Object> metrics = new HashMap<>();
        
        // Get response counts for each question
        questionRepository.findAll().forEach(question -> {
            long responseCount = submissionRepository.countResponsesForQuestion(question.getId());
            metrics.put("question_" + question.getId(), Map.of(
                "questionId", question.getId(),
                "text", question.getText(),
                "responseCount", responseCount
            ));
        });

        return metrics;
    }

    @Override
    public Map<String, Object> getPerformanceMetricsGraph() {
        Map<String, Object> metrics = new HashMap<>();
        Map<String, Map<String, Object>> categoryMetrics = new HashMap<>();
        
        // Calculate performance for each category
        for (QuestionCategory category : QuestionCategory.values()) {
            Map<String, Object> categoryData = new HashMap<>();
            double currentPerformance = calculateCurrentPerformance(category);
            
            // Get submission counts
            long totalQuestions = questionRepository.countByCategory(category);
            long activeQuestions = questionRepository.countActiveQuestionsByCategory(category);
            
            categoryData.put("current", currentPerformance);
            categoryData.put("totalQuestions", totalQuestions);
            categoryData.put("activeQuestions", activeQuestions);
            categoryMetrics.put(category.name(), categoryData);
        }
        
        metrics.put("categoryPerformance", categoryMetrics);
        return metrics;
    }

    @Override
    public Map<String, Object> getFeedbackDashboardMetrics() {
        Map<String, Object> metrics = new HashMap<>();

        // Total feedbacks
        long totalFeedbacks = feedbackRepository.count();
        metrics.put("totalFeedbacks", totalFeedbacks);

        // Active feedbacks
        long activeFeedbacks = feedbackRepository.countByActiveTrue();
        metrics.put("activeFeedbacks", activeFeedbacks);

        // Submission rate
        long totalSubmissions = submissionRepository.count();
        double submissionRate = totalFeedbacks > 0 ? 
            (double) totalSubmissions / totalFeedbacks * 100 : 0;
        metrics.put("submissionRate", submissionRate);

        return metrics;
    }

    @Override
    public Map<String, Object> getFeedbackSatisfactionMetrics() {
        Map<String, Object> metrics = new HashMap<>();
        
        // Calculate overall satisfaction rate
        double satisfactionRate = calculateOverallSatisfactionRate();
        metrics.put("currentSatisfactionRate", satisfactionRate);
        
        // Calculate previous year's satisfaction rate
        double previousYearRate = calculatePreviousYearSatisfactionRate();
        metrics.put("previousYearRate", previousYearRate);
        
        // Calculate year-over-year change
        double yearOverYearChange = satisfactionRate - previousYearRate;
        metrics.put("yearOverYearChange", yearOverYearChange);

        return metrics;
    }

    @Override
    public Map<String, Object> getFeedbackSentimentDistribution() {
        Map<String, Object> distribution = new HashMap<>();
        
        // Calculate sentiment distribution
        Map<SentimentType, Double> sentiments = calculateSentimentDistribution();
        
        distribution.put("positive", sentiments.getOrDefault(SentimentType.POSITIVE, 0.0));
        distribution.put("neutral", sentiments.getOrDefault(SentimentType.NEUTRAL, 0.0));
        distribution.put("negative", sentiments.getOrDefault(SentimentType.NEGATIVE, 0.0));

        return distribution;
    }

    @Override
    public Map<String, Object> getYearOverYearAnalysis() {
        Map<String, Object> analysis = new HashMap<>();
        
        // Get current year metrics
        analysis.put("currentYear", getCurrentYearMetrics());
        
        // Get previous year metrics
        analysis.put("previousYear", getPreviousYearMetrics());
        
        // Calculate growth metrics
        analysis.put("growth", calculateGrowthMetrics());

        return analysis;
    }

    // Helper methods
    private double calculateCurrentPerformance(QuestionCategory category) {
        // Get all questions for this category
        List<Question> questions = questionRepository.findByCategory(category);
        if (questions.isEmpty()) {
            return 0.0;
        }

        double totalScore = 0.0;
        long totalResponses = 0;

        for (Question question : questions) {
            // Get all responses for this question
            long responseCount = submissionRepository.countResponsesForQuestion(question.getId());
            if (responseCount > 0) {
                totalResponses += responseCount;
                Double avgScore = submissionRepository.getAverageScoreForQuestion(question.getId());
                if (avgScore != null) {
                    totalScore += avgScore * responseCount;
                }
            }
        }

        return totalResponses > 0 ? (totalScore / totalResponses) : 0.0;
    }

    private double calculateOverallSatisfactionRate() {
        // Implementation for calculating overall satisfaction
        return 0.0; // TODO: Implement actual calculation
    }

    private double calculatePreviousYearSatisfactionRate() {
        // Implementation for calculating previous year's satisfaction
        return 0.0; // TODO: Implement actual calculation
    }

    private Map<SentimentType, Double> calculateSentimentDistribution() {
        // Implementation for calculating sentiment distribution
        return new HashMap<>(); // TODO: Implement actual calculation
    }

    private Map<String, Object> getCurrentYearMetrics() {
        // Implementation for current year metrics
        return new HashMap<>(); // TODO: Implement actual calculation
    }

    private Map<String, Object> getPreviousYearMetrics() {
        // Implementation for previous year metrics
        return new HashMap<>(); // TODO: Implement actual calculation
    }

    private Map<String, Object> calculateGrowthMetrics() {
        // Implementation for growth metrics
        return new HashMap<>(); // TODO: Implement actual calculation
    }
} 