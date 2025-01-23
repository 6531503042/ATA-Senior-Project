//package dev.bengi.feedbackservice.service;
//
//import dev.bengi.feedbackservice.dto.AdminDashboardResponse;
//import dev.bengi.feedbackservice.repository.DashboardRepository;
//import dev.bengi.feedbackservice.repository.FeedbackRepository;
//import dev.bengi.feedbackservice.repository.AnswerRepository;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//
//import java.time.ZonedDateTime;
//import java.time.temporal.ChronoUnit;
//
//@Service
//@RequiredArgsConstructor
//public class DashboardService {
//    private final DashboardRepository dashboardRepository;
//    private final FeedbackRepository feedbackRepository;
//    private final AnswerRepository answerRepository;
//
//    public AdminDashboardResponse generateAdminDashboard() {
//        ZonedDateTime now = ZonedDateTime.now();
//        ZonedDateTime startOfMonth = now.truncatedTo(ChronoUnit.DAYS).withDayOfMonth(1);
//
//        // Sentiment Analysis
//        AdminDashboardResponse.SentimentAnalysis sentimentAnalysis = generateSentimentAnalysis(startOfMonth, now);
//
//        // Feedback Overview
//        AdminDashboardResponse.FeedbackOverview feedbackOverview = generateFeedbackOverview(startOfMonth, now);
//
//        // Question Set Performance
//        List<AdminDashboardResponse.QuestionSetPerformance> questionSetPerformances =
//            generateQuestionSetPerformances(startOfMonth, now);
//
//        // Recent Activities
//        List<AdminDashboardResponse.RecentActivity> recentActivities =
//            generateRecentActivities();
//
//        return AdminDashboardResponse.builder()
//            .sentimentAnalysis(sentimentAnalysis)
//            .feedbackOverview(feedbackOverview)
//            .questionSetPerformances(questionSetPerformances)
//            .recentActivities(recentActivities)
//            .build();
//    }
//
//    private AdminDashboardResponse.SentimentAnalysis generateSentimentAnalysis(
//        ZonedDateTime startDate, ZonedDateTime endDate) {
//        // Implement sentiment score calculation based on answers and feedback
//        Map<String, Long> sentimentDistribution = calculateSentimentDistribution(startDate, endDate);
//        Map<Long, Double> projectSentimentScores = calculateProjectSentimentScores(startDate, endDate);
//
//        return AdminDashboardResponse.SentimentAnalysis.builder()
//            .sentimentDistribution(sentimentDistribution)
//            .projectSentimentScores(projectSentimentScores)
//            .overallSentimentScore(calculateOverallSentimentScore())
//            .build();
//    }
//
//    // Implement other helper methods for generating dashboard components
//}