package dev.bengi.main.modules.dashboard.service;

import dev.bengi.main.modules.dashboard.dto.DashboardDtos.*;
import dev.bengi.main.modules.projects.repository.ProjectRepository;
import dev.bengi.main.modules.projects.repository.ProjectMemberRepository;
import dev.bengi.main.modules.feedback.repository.FeedbackRepository;
import dev.bengi.main.modules.submit.repository.SubmitRepository;
import dev.bengi.main.modules.user.repository.UserRepository;
import dev.bengi.main.modules.department.repository.DepartmentRepository;
import org.springframework.r2dbc.core.DatabaseClient;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;


import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.*;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final ProjectRepository projectRepository;
    private final SubmitRepository submitRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final FeedbackRepository feedbackRepository;
    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final DatabaseClient databaseClient;

    public Mono<DashboardStats> getStats(String currentUsername) {
        // Overview metrics - enhanced with actual data
        Mono<Long> totalProjects = projectRepository.count();
        Mono<Long> totalSubmissions = submitRepository.count();
        Mono<Long> totalMembers = projectMemberRepository.countDistinctMembers();

        // Simple growth placeholders (compute against previous month)
        YearMonth now = YearMonth.now();
        LocalDateTime mStart = now.atDay(1).atStartOfDay();
        LocalDateTime mEnd = now.plusMonths(1).atDay(1).atStartOfDay();
        LocalDateTime pmStart = now.minusMonths(1).atDay(1).atStartOfDay();
        LocalDateTime pmEnd = mStart;

        Mono<Long> projThisMonth = projectRepository.countCreatedBetween(mStart, mEnd);
        Mono<Long> projPrevMonth = projectRepository.countCreatedBetween(pmStart, pmEnd);
        Mono<Long> submThisMonth = submitRepository.countSubmittedBetween(mStart, mEnd);
        Mono<Long> submPrevMonth = submitRepository.countSubmittedBetween(pmStart, pmEnd);

        // Calculate completion rate
        Mono<Double> completionRate = Mono.zip(
                feedbackRepository.countCompletedFeedbacks(),
                feedbackRepository.count()
        ).map(t -> t.getT2() > 0 ? (double) t.getT1() / t.getT2() * 100.0 : 0.0);

        // Calculate member growth
        Mono<Long> membersThisMonth = projectMemberRepository.countNewMembersBetween(mStart, mEnd);
        Mono<Long> membersPrevMonth = projectMemberRepository.countNewMembersBetween(pmStart, pmEnd);

        // Split the zip operations to avoid parameter limit
        Mono<DashboardOverview> overview = Mono.zip(
                Mono.zip(totalProjects, totalSubmissions, totalMembers, completionRate.defaultIfEmpty(0.0)),
                Mono.zip(projThisMonth.defaultIfEmpty(0L), projPrevMonth.defaultIfEmpty(0L),
                        submThisMonth.defaultIfEmpty(0L), submPrevMonth.defaultIfEmpty(0L)),
                Mono.zip(membersThisMonth.defaultIfEmpty(0L), membersPrevMonth.defaultIfEmpty(0L))
            )
            .map(t -> {
                var basicData = t.getT1();
                var projectData = t.getT2();
                var memberData = t.getT3();
                
                return new DashboardOverview(
                        basicData.getT1(),  // totalProjects
                        basicData.getT2(),  // totalSubmissions
                        basicData.getT3(),  // totalMembers
                        basicData.getT4(),  // completionRate
                        formatGrowth(projectData.getT1(), projectData.getT2()),  // projectsGrowth
                        formatGrowth(projectData.getT3(), projectData.getT4()),  // submissionsGrowth
                        formatGrowth(memberData.getT1(), memberData.getT2()),    // membersGrowth
                        calculateCompletionGrowth(basicData.getT4())             // completionGrowth
                );
            });

        // Recent projects with participants via project_members
        Mono<List<ProjectItem>> recentProjects = projectRepository.findRecent(3)
                .flatMap(p -> projectMemberRepository.countMembersForProject(p.getId())
                        .defaultIfEmpty(0L)
                        .map(cnt -> new ProjectItem(
                                p.getId(),
                                p.getName(),
                                p.getDescription(),
                                cnt.intValue(),
                                p.getCreatedAt(),
                                p.isActive() ? "ACTIVE" : "INACTIVE",
                                "https://i.pravatar.cc/150?u=project",
                                0
                        )))
                .collectList();

        // Recent feedbacks from feedback table for metadata; submissions for recency
        Mono<List<FeedbackItem>> recentFeedbacks = feedbackRepository.findRecent(3)
                .map(f -> new FeedbackItem(
                        f.getId(),
                        "Feedback",
                        f.getDescription(),
                        0,
                        f.getCreatedAt(),
                        f.isActive() ? "pending" : "completed",
                        "https://i.pravatar.cc/150?u=feedback",
                        "neutral",
                        7
                )).collectList();

        // Chart data for last 6 months
        YearMonth base = YearMonth.now().minusMonths(5);
        Mono<int[]> projectsSeries = countsForMonths(6, base,
                (from, to) -> projectRepository.countCreatedBetween(from, to));
        Mono<int[]> submissionsSeries = countsForMonths(6, base,
                (from, to) -> submitRepository.countSubmittedBetween(from, to));

        Mono<ChartData> chartMono = Mono.zip(projectsSeries, submissionsSeries)
                .map(t -> new ChartData(
                        monthLabels(6, base),
                        new ChartDataset[]{
                                new ChartDataset("Projects", t.getT1(), "#3b82f6", "#3b82f6"),
                                new ChartDataset("Submissions", t.getT2(), "#10b981", "#10b981")
                        }
                ));

        return Mono.zip(overview, recentProjects, recentFeedbacks, chartMono)
                .map(t -> new DashboardStats(t.getT1(), t.getT2(), t.getT3(), t.getT4()));
    }

    // Advanced dashboard metrics
    public Mono<EnhancedDashboardStats> getAdvancedStats(String currentUsername) {
        // Get basic stats
        Mono<DashboardStats> basicStats = getStats(currentUsername);
        
        // Calculate advanced metrics
        Mono<AdvancedMetrics> advancedMetrics = getAdvancedMetrics();
        
        // Get department metrics
        Mono<List<DepartmentMetrics>> departmentMetrics = getDepartmentMetrics();
        
        // Get time series data for the last 12 months
        Mono<List<TimeSeriesMetric>> timeSeriesData = getTimeSeriesData();
        
        return Mono.zip(basicStats, advancedMetrics, departmentMetrics, timeSeriesData)
                .map(t -> new EnhancedDashboardStats(
                        t.getT1().overview(),
                        t.getT2(),
                        t.getT1().recentProjects(),
                        t.getT1().recentFeedbacks(),
                        t.getT3(),
                        t.getT1().chartData(),
                        t.getT4()
                ));
    }

    public Mono<AdvancedMetrics> getAdvancedMetrics() {
        YearMonth now = YearMonth.now();
        LocalDateTime monthStart = now.atDay(1).atStartOfDay();
        LocalDateTime monthEnd = now.plusMonths(1).atDay(1).atStartOfDay();
        
        Mono<Long> activeFeedbacks = feedbackRepository.countActiveFeedbacks();
        Mono<Long> completedFeedbacks = feedbackRepository.countCompletedFeedbacks();
        Mono<Long> activeUsers = userRepository.countActiveUsers();
        Mono<Double> avgResponseRate = feedbackRepository.getAverageResponseRate().defaultIfEmpty(0.0);
        Mono<Double> avgRating = submitRepository.getAverageRatingBetween(monthStart, monthEnd).defaultIfEmpty(0.0);
        Mono<Long> uniqueSubmitters = submitRepository.countUniqueSubmittersBetween(monthStart, monthEnd);
        
        return Mono.zip(activeFeedbacks, completedFeedbacks, activeUsers, avgResponseRate, avgRating, uniqueSubmitters, activeUsers)
                .map(t -> {
                    String engagementRate = calculateEngagementRate(t.getT6(), t.getT7());
                    return new AdvancedMetrics(
                            t.getT1(),
                            t.getT2(),
                            t.getT3(),
                            t.getT4(),
                            t.getT5(),
                            t.getT6(),
                            engagementRate
                    );
                });
    }

    public Mono<List<DepartmentMetrics>> getDepartmentMetrics() {
        YearMonth now = YearMonth.now();
        LocalDateTime monthStart = now.atDay(1).atStartOfDay();
        LocalDateTime monthEnd = now.plusMonths(1).atDay(1).atStartOfDay();
        
        String query = """
            SELECT 
                d.id as department_id,
                d.name as department_name,
                COUNT(DISTINCT u.id) as active_members,
                COUNT(DISTINCT s.id) as total_submissions,
                COALESCE(AVG(s.rating), 0) as average_rating
            FROM departments d
            LEFT JOIN users u ON d.id = u.department_id AND u.active = true
            LEFT JOIN submissions s ON u.username = s.user_id AND s.submitted_at >= :monthStart AND s.submitted_at < :monthEnd
            WHERE d.active = true
            GROUP BY d.id, d.name
            ORDER BY active_members DESC
            """;
        
        return databaseClient.sql(query)
                .bind("monthStart", monthStart)
                .bind("monthEnd", monthEnd)
                .map((row, meta) -> {
                    Long deptId = row.get("department_id", Long.class);
                    String deptName = row.get("department_name", String.class);
                    Long activeMembers = row.get("active_members", Long.class);
                    Long totalSubmissions = row.get("total_submissions", Long.class);
                    Double averageRating = row.get("average_rating", Double.class);
                    
                    String participationRate = calculateParticipationRate(totalSubmissions, activeMembers);
                    
                    return new DepartmentMetrics(
                            deptId,
                            deptName,
                            activeMembers != null ? activeMembers : 0L,
                            totalSubmissions != null ? totalSubmissions : 0L,
                            averageRating != null ? averageRating : 0.0,
                            participationRate
                    );
                })
                .all()
                .collectList();
    }

    public Mono<List<TimeSeriesMetric>> getTimeSeriesData() {
        YearMonth start = YearMonth.now().minusMonths(11);
        
        return Flux.range(0, 12)
                .concatMap(i -> {
                    YearMonth ym = start.plusMonths(i);
                    LocalDateTime from = ym.atDay(1).atStartOfDay();
                    LocalDateTime to = ym.plusMonths(1).atDay(1).atStartOfDay();
                    String period = ym.getMonth().name().substring(0, 3) + " " + ym.getYear();
                    
                    Mono<Long> projects = projectRepository.countCreatedBetween(from, to).defaultIfEmpty(0L);
                    Mono<Long> submissions = submitRepository.countSubmittedBetween(from, to).defaultIfEmpty(0L);
                    Mono<Long> feedbacks = feedbackRepository.countCreatedBetween(from, to).defaultIfEmpty(0L);
                    
                    return Mono.zip(projects, submissions, feedbacks)
                            .flatMapMany(t -> Flux.just(
                                    new TimeSeriesMetric(period, t.getT1(), "Projects"),
                                    new TimeSeriesMetric(period, t.getT2(), "Submissions"),
                                    new TimeSeriesMetric(period, t.getT3(), "Feedbacks")
                            ));
                })
                .collectList();
    }

    // Real-time and interactive dashboard features
    
    public Flux<ActivityFeed> getActivityFeed(int limit) {
        String query = """
            (
                SELECT 
                    'project' as source_type,
                    p.id as source_id,
                    u.first_name || ' ' || u.last_name as actor_name,
                    'created project' as action,
                    'Project' as target_type,
                    p.name as target_name,
                    p.created_at as timestamp,
                    'folder-plus' as icon,
                    'blue' as color
                FROM projects p
                LEFT JOIN users u ON p.created_by::bigint = u.id
                WHERE p.created_at >= NOW() - INTERVAL '30 days'
            )
            UNION ALL
            (
                SELECT 
                    'feedback' as source_type,
                    f.id as source_id,
                    'System' as actor_name,
                    'created feedback' as action,
                    'Feedback' as target_type,
                    f.title as target_name,
                    f.created_at as timestamp,
                    'message-circle' as icon,
                    'green' as color
                FROM feedbacks f
                WHERE f.created_at >= NOW() - INTERVAL '30 days'
            )
            UNION ALL
            (
                SELECT 
                    'submission' as source_type,
                    s.id as source_id,
                    s.user_id as actor_name,
                    'submitted feedback' as action,
                    'Submission' as target_type,
                    'Feedback Response' as target_name,
                    s.submitted_at as timestamp,
                    'send' as icon,
                    'purple' as color
                FROM submissions s
                WHERE s.submitted_at >= NOW() - INTERVAL '7 days'
            )
            ORDER BY timestamp DESC
            LIMIT :limit
            """;
        
        return databaseClient.sql(query)
                .bind("limit", limit)
                .map((row, meta) -> new ActivityFeed(
                        row.get("source_id", Long.class),
                        row.get("actor_name", String.class),
                        row.get("action", String.class),
                        row.get("target_type", String.class),
                        row.get("target_name", String.class),
                        row.get("timestamp", LocalDateTime.class),
                        row.get("icon", String.class),
                        row.get("color", String.class)
                ))
                .all();
    }
    
    public Flux<QuickAction> getQuickActions(String userRole) {
        List<QuickAction> actions = new ArrayList<>();
        
        // Admin actions
        if ("ADMIN".equals(userRole)) {
            actions.addAll(List.of(
                new QuickAction("create_project", "Create Project", "Start a new project", "plus-circle", "/projects/create", "project", true),
                new QuickAction("create_feedback", "Create Feedback", "Create new feedback form", "message-square", "/feedbacks/create", "feedback", true),
                new QuickAction("manage_users", "Manage Users", "User management", "users", "/users", "admin", true),
                new QuickAction("view_reports", "View Reports", "Analytics and reports", "bar-chart", "/reports", "analytics", true),
                new QuickAction("system_settings", "System Settings", "Configure system", "settings", "/settings", "admin", true)
            ));
        }
        
        // User actions
        actions.addAll(List.of(
            new QuickAction("my_submissions", "My Submissions", "View my feedback submissions", "file-text", "/submissions", "personal", true),
            new QuickAction("pending_feedbacks", "Pending Feedbacks", "Feedbacks awaiting my response", "clock", "/feedbacks/pending", "feedback", true),
            new QuickAction("my_projects", "My Projects", "Projects I'm involved in", "folder", "/projects/mine", "project", true)
        ));
        
        return Flux.fromIterable(actions);
    }
    
    public Flux<DashboardWidget> getCustomizableWidgets(String username) {
        List<DashboardWidget> widgets = new ArrayList<>();
        
        // Add dynamic widgets
        widgets.addAll(List.of(
            new DashboardWidget("overview_metrics", "Overview Metrics", "metric", null, 0, 0, 6, 2, true),
            new DashboardWidget("recent_activities", "Recent Activities", "list", null, 6, 0, 6, 4, true),
            new DashboardWidget("project_chart", "Project Statistics", "chart", null, 0, 2, 8, 4, true),
            new DashboardWidget("department_performance", "Department Performance", "table", null, 8, 2, 4, 4, true),
            new DashboardWidget("quick_actions", "Quick Actions", "list", null, 0, 6, 4, 2, true),
            new DashboardWidget("feedback_trends", "Feedback Trends", "chart", null, 4, 6, 8, 3, true),
            new DashboardWidget("notifications", "Notifications", "list", null, 8, 0, 4, 2, true)
        ));
        
        return Flux.fromIterable(widgets);
    }
    
    public Mono<Map<String, Object>> getRealTimeMetrics() {
        Map<String, Object> metrics = new HashMap<>();
        
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime hourAgo = now.minusHours(1);
        
        return Mono.zip(
                submitRepository.countSubmittedBetween(hourAgo, now),
                projectRepository.countCreatedBetween(hourAgo, now),
                feedbackRepository.countCreatedBetween(hourAgo, now),
                userRepository.countActiveUsersBetween(hourAgo, now)
        ).map(t -> {
            metrics.put("submissionsLastHour", t.getT1());
            metrics.put("projectsLastHour", t.getT2());
            metrics.put("feedbacksLastHour", t.getT3());
            metrics.put("activeUsersLastHour", t.getT4());
            metrics.put("timestamp", now);
            return metrics;
        });
    }
    
    public Flux<RealTimeUpdate> getRecentNotifications(String username, int limit) {
        // Simulate real-time notifications
        List<RealTimeUpdate> notifications = List.of(
            new RealTimeUpdate("notification", "New feedback submission received", Map.of("feedbackId", 123), LocalDateTime.now().minusMinutes(5), "info"),
            new RealTimeUpdate("metric_update", "Project completion rate increased", Map.of("rate", "85%"), LocalDateTime.now().minusMinutes(10), "success"),
            new RealTimeUpdate("activity", "3 new members joined Project Alpha", Map.of("projectId", 456), LocalDateTime.now().minusMinutes(15), "info"),
            new RealTimeUpdate("notification", "Feedback deadline approaching", Map.of("feedbackId", 789, "deadline", "2 hours"), LocalDateTime.now().minusMinutes(30), "warning")
        );
        
        return Flux.fromIterable(notifications.stream().limit(limit).toList());
    }
    
    public Mono<Map<String, Long>> getSystemHealthMetrics() {
        Map<String, Long> health = new HashMap<>();
        
        return Mono.zip(
                projectRepository.count(),
                feedbackRepository.countActiveFeedbacks(),
                submitRepository.count(),
                userRepository.countActiveUsers()
        ).map(t -> {
            health.put("totalProjects", t.getT1());
            health.put("activeFeedbacks", t.getT2());
            health.put("totalSubmissions", t.getT3());
            health.put("activeUsers", t.getT4());
            
            // Calculate system health score (0-100)
            long healthScore = Math.min(100, 
                (t.getT1() * 10 + t.getT2() * 20 + t.getT3() * 5 + t.getT4() * 15) / 10
            );
            health.put("healthScore", healthScore);
            
            return health;
        });
    }

    private String calculateCompletionGrowth(double completionRate) {
        // This could be enhanced to compare with previous month's completion rate
        return String.format("%.1f%%", completionRate);
    }

    private String calculateEngagementRate(long uniqueSubmitters, long activeUsers) {
        if (activeUsers == 0) return "0%";
        double rate = ((double) uniqueSubmitters / activeUsers) * 100.0;
        return String.format("%.1f%%", rate);
    }

    private String calculateParticipationRate(long submissions, long members) {
        if (members == 0) return "0%";
        double rate = ((double) submissions / members) * 100.0;
        return String.format("%.1f%%", rate);
    }

    private String formatGrowth(long current, long previous) {
        if (previous == 0) {
            return current > 0 ? "+100%" : "+0%";
        }
        double growth = ((double) (current - previous) / (double) previous) * 100.0;
        return String.format("%+.0f%%", growth);
    }

    private interface Counter {
        Mono<Long> count(LocalDateTime from, LocalDateTime to);
    }

    private Mono<int[]> countsForMonths(int months, YearMonth start, Counter counter) {
        return Flux.range(0, months)
                .concatMap(i -> {
                    YearMonth ym = start.plusMonths(i);
                    LocalDateTime from = ym.atDay(1).atStartOfDay();
                    LocalDateTime to = ym.plusMonths(1).atDay(1).atStartOfDay();
                    return counter.count(from, to).defaultIfEmpty(0L).map(Long::intValue);
                })
                .collectList()
                .map(list -> list.stream().mapToInt(Integer::intValue).toArray());
    }

    private String[] monthLabels(int months, YearMonth start) {
        String[] labels = new String[months];
        for (int i = 0; i < months; i++) {
            YearMonth ym = start.plusMonths(i);
            labels[i] = ym.getMonth().name().substring(0, 3);
        }
        return labels;
    }
}


