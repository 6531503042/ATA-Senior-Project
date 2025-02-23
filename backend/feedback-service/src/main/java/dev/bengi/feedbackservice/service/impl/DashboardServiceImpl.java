package dev.bengi.feedbackservice.service.impl;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import dev.bengi.feedbackservice.domain.enums.QuestionCategory;
import dev.bengi.feedbackservice.domain.enums.QuestionType;
import dev.bengi.feedbackservice.domain.enums.SentimentType;
import dev.bengi.feedbackservice.domain.model.FeedbackSubmission;
import dev.bengi.feedbackservice.domain.model.Question;
import dev.bengi.feedbackservice.repository.FeedbackRepository;
import dev.bengi.feedbackservice.repository.FeedbackSubmissionRepository;
import dev.bengi.feedbackservice.repository.ProjectRepository;
import dev.bengi.feedbackservice.repository.QuestionRepository;
import dev.bengi.feedbackservice.service.DashboardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

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
        try {
            Map<String, Object> metrics = new HashMap<>();
            LocalDateTime now = LocalDateTime.now();

            // Total projects
            metrics.put("totalProjects", projectRepository.count());

            // Active projects
            Long activeProjects = projectRepository.countActiveProjects();
            metrics.put("activeProjects", activeProjects != null ? activeProjects : 0L);

            // Completed projects
            Long completedProjects = projectRepository.countCompletedProjects();
            metrics.put("completedProjects", completedProjects != null ? completedProjects : 0L);

            // Total members
            long totalMembers = projectRepository.countTotalUniqueMembers();
            metrics.put("totalMembers", totalMembers);

            // Average team size
            Double avgTeamSize = projectRepository.getAverageTeamSizeForActiveProjects();
            metrics.put("averageTeamSize", avgTeamSize != null ? avgTeamSize : 0.0);

            return metrics;
        } catch (Exception e) {
            log.error("Error while fetching project dashboard metrics", e);
            throw new RuntimeException("Failed to fetch project dashboard metrics", e);
        }
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
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startOfYear = now.withDayOfYear(1).withHour(0).withMinute(0).withSecond(0);
        
        // Get all submissions from this year
        List<FeedbackSubmission> submissions = submissionRepository.findAll().stream()
                .filter(s -> s.getSubmittedAt().isAfter(startOfYear))
                .collect(Collectors.toList());
        
        if (submissions.isEmpty()) {
            return 0.0;
        }

        // Calculate satisfaction rate based on responses
        long satisfiedCount = submissions.stream()
                .filter(this::isSubmissionSatisfactory)
                .count();
        
        return (double) satisfiedCount / submissions.size() * 100;
    }

    private double calculatePreviousYearSatisfactionRate() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startOfLastYear = now.minusYears(1).withDayOfYear(1).withHour(0).withMinute(0).withSecond(0);
        LocalDateTime endOfLastYear = now.withDayOfYear(1).withHour(0).withMinute(0).withSecond(0).minusSeconds(1);
        
        // Get all submissions from last year
        List<FeedbackSubmission> submissions = submissionRepository.findAll().stream()
                .filter(s -> s.getSubmittedAt().isAfter(startOfLastYear) && s.getSubmittedAt().isBefore(endOfLastYear))
                .collect(Collectors.toList());
        
        if (submissions.isEmpty()) {
            return 0.0;
        }

        // Calculate satisfaction rate based on responses
        long satisfiedCount = submissions.stream()
                .filter(this::isSubmissionSatisfactory)
                .count();
        
        return (double) satisfiedCount / submissions.size() * 100;
    }

    private boolean isSubmissionSatisfactory(FeedbackSubmission submission) {
        // Consider a submission satisfactory if the average score is above 3.5 (on a 5-point scale)
        // or if positive responses outweigh negative ones
        double averageScore = submission.getResponses().values().stream()
                .mapToDouble(response -> {
                    try {
                        return Double.parseDouble(response);
                    } catch (NumberFormatException e) {
                        return 0.0;
                    }
                })
                .average()
                .orElse(0.0);
        
        return averageScore >= 3.5;
    }

    private Map<SentimentType, Double> calculateSentimentDistribution() {
        Map<SentimentType, Double> distribution = new HashMap<>();
        List<FeedbackSubmission> submissions = submissionRepository.findAll();
        
        if (submissions.isEmpty()) {
            distribution.put(SentimentType.POSITIVE, 0.0);
            distribution.put(SentimentType.NEUTRAL, 0.0);
            distribution.put(SentimentType.NEGATIVE, 0.0);
            return distribution;
        }

        long totalSubmissions = submissions.size();
        
        // Count submissions by sentiment
        Map<SentimentType, Long> counts = submissions.stream()
                .map(this::analyzeSentiment)
                .collect(Collectors.groupingBy(
                    sentiment -> sentiment,
                    Collectors.counting()
                ));
        
        // Convert counts to percentages
        distribution.put(SentimentType.POSITIVE, 
            (double) counts.getOrDefault(SentimentType.POSITIVE, 0L) / totalSubmissions * 100);
        distribution.put(SentimentType.NEUTRAL, 
            (double) counts.getOrDefault(SentimentType.NEUTRAL, 0L) / totalSubmissions * 100);
        distribution.put(SentimentType.NEGATIVE, 
            (double) counts.getOrDefault(SentimentType.NEGATIVE, 0L) / totalSubmissions * 100);
        
        return distribution;
    }

    private SentimentType analyzeSentiment(FeedbackSubmission submission) {
        // Simple sentiment analysis based on average scores and comments
        double averageScore = submission.getResponses().values().stream()
                .mapToDouble(response -> {
                    try {
                        return Double.parseDouble(response);
                    } catch (NumberFormatException e) {
                        return 0.0;
                    }
                })
                .average()
                .orElse(0.0);
        
        // Analyze based on average score (assuming 5-point scale)
        if (averageScore >= 4.0) {
            return SentimentType.POSITIVE;
        } else if (averageScore >= 3.0) {
            return SentimentType.NEUTRAL;
        } else {
            return SentimentType.NEGATIVE;
        }
    }

    private Map<String, Object> getCurrentYearMetrics() {
        Map<String, Object> metrics = new HashMap<>();
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startOfYear = now.withDayOfYear(1).withHour(0).withMinute(0).withSecond(0);
        
        // Get submissions from this year
        List<FeedbackSubmission> submissions = submissionRepository.findAll().stream()
                .filter(s -> s.getSubmittedAt().isAfter(startOfYear))
                .collect(Collectors.toList());
        
        metrics.put("totalSubmissions", submissions.size());
        metrics.put("averageScore", calculateAverageScore(submissions));
        metrics.put("participationRate", calculateParticipationRate(submissions));
        metrics.put("completionRate", calculateCompletionRate(submissions));
        
        return metrics;
    }

    private Map<String, Object> getPreviousYearMetrics() {
        Map<String, Object> metrics = new HashMap<>();
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startOfLastYear = now.minusYears(1).withDayOfYear(1).withHour(0).withMinute(0).withSecond(0);
        LocalDateTime endOfLastYear = now.withDayOfYear(1).withHour(0).withMinute(0).withSecond(0).minusSeconds(1);
        
        // Get submissions from last year
        List<FeedbackSubmission> submissions = submissionRepository.findAll().stream()
                .filter(s -> s.getSubmittedAt().isAfter(startOfLastYear) && s.getSubmittedAt().isBefore(endOfLastYear))
                .collect(Collectors.toList());
        
        metrics.put("totalSubmissions", submissions.size());
        metrics.put("averageScore", calculateAverageScore(submissions));
        metrics.put("participationRate", calculateParticipationRate(submissions));
        metrics.put("completionRate", calculateCompletionRate(submissions));
        
        return metrics;
    }

    private double calculateAverageScore(List<FeedbackSubmission> submissions) {
        if (submissions.isEmpty()) {
            return 0.0;
        }
        
        return submissions.stream()
                .flatMap(s -> s.getResponses().values().stream())
                .mapToDouble(response -> {
                    try {
                        return Double.parseDouble(response);
                    } catch (NumberFormatException e) {
                        return 0.0;
                    }
                })
                .average()
                .orElse(0.0);
    }

    private double calculateParticipationRate(List<FeedbackSubmission> submissions) {
        if (submissions.isEmpty()) {
            return 0.0;
        }
        
        // Get unique users who submitted feedback
        long uniqueUsers = submissions.stream()
                .map(FeedbackSubmission::getSubmittedBy)
                .filter(user -> user != null)
                .distinct()
                .count();
        
        // Get total eligible users
        long totalUsers = projectRepository.countTotalUniqueMembers();
        
        return totalUsers > 0 ? (double) uniqueUsers / totalUsers * 100 : 0.0;
    }

    private double calculateCompletionRate(List<FeedbackSubmission> submissions) {
        if (submissions.isEmpty()) {
            return 0.0;
        }
        
        // Count submissions with all required questions answered
        long completedSubmissions = submissions.stream()
                .filter(this::isSubmissionComplete)
                .count();
        
        return (double) completedSubmissions / submissions.size() * 100;
    }

    private boolean isSubmissionComplete(FeedbackSubmission submission) {
        // Get all required questions for this feedback
        List<Question> requiredQuestions = questionRepository.findAllById(submission.getFeedback().getQuestionIds())
                .stream()
                .filter(Question::isRequired)
                .collect(Collectors.toList());
        
        // Check if all required questions have non-empty responses
        return requiredQuestions.stream()
                .allMatch(q -> {
                    String response = submission.getResponses().get(q.getId());
                    return response != null && !response.trim().isEmpty();
                });
    }

    private Map<String, Object> calculateGrowthMetrics() {
        Map<String, Object> growth = new HashMap<>();
        
        Map<String, Object> currentYearMetrics = getCurrentYearMetrics();
        Map<String, Object> previousYearMetrics = getPreviousYearMetrics();
        
        // Calculate year-over-year growth for each metric
        growth.put("submissionGrowth", calculateGrowthPercentage(
            (Integer) currentYearMetrics.get("totalSubmissions"),
            (Integer) previousYearMetrics.get("totalSubmissions")));
            
        growth.put("scoreGrowth", calculateGrowthPercentage(
            (Double) currentYearMetrics.get("averageScore"),
            (Double) previousYearMetrics.get("averageScore")));
            
        growth.put("participationGrowth", calculateGrowthPercentage(
            (Double) currentYearMetrics.get("participationRate"),
            (Double) previousYearMetrics.get("participationRate")));
            
        growth.put("completionGrowth", calculateGrowthPercentage(
            (Double) currentYearMetrics.get("completionRate"),
            (Double) previousYearMetrics.get("completionRate")));
        
        return growth;
    }

    private double calculateGrowthPercentage(Number current, Number previous) {
        double currentValue = current.doubleValue();
        double previousValue = previous.doubleValue();
        
        if (previousValue == 0) {
            return currentValue > 0 ? 100.0 : 0.0;
        }
        
        return ((currentValue - previousValue) / previousValue) * 100;
    }
} 