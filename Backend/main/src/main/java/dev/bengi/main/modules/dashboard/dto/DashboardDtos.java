package dev.bengi.main.modules.dashboard.dto;

public class DashboardDtos {
	public record DashboardOverview(
			long totalProjects,
			long totalSubmissions,
			long totalMembers,
			double completionRate,
			String projectsGrowth,
			String submissionsGrowth,
			String membersGrowth,
			String completionGrowth
	) {}

	// Advanced metrics DTOs
	public record AdvancedMetrics(
			long totalActiveFeedbacks,
			long totalCompletedFeedbacks,
			long totalActiveUsers,
			double averageResponseRate,
			double averageRating,
			long uniqueSubmitters,
			String engagementRate
	) {}

	public record DepartmentMetrics(
			Long departmentId,
			String departmentName,
			long activeMembers,
			long totalSubmissions,
			double averageRating,
			String participationRate
	) {}

	public record TimeSeriesMetric(
			String period,
			long value,
			String category
	) {}

	public record ProjectItem(
			Long id,
			String title,
			String description,
			int participants,
			java.time.LocalDateTime createdAt,
			String status,
			String avatar,
			int progress
	) {}

	public record FeedbackItem(
			Long id,
			String projectTitle,
			String description,
			int participants,
			java.time.LocalDateTime createdAt,
			String status,
			String avatar,
			String sentiment,
			int score
	) {}

	public record ChartDataset(String label, int[] data, String backgroundColor, String borderColor) {}

	public record ChartData(String[] labels, ChartDataset[] datasets) {}

	public record DashboardStats(
			DashboardOverview overview,
			java.util.List<ProjectItem> recentProjects,
			java.util.List<FeedbackItem> recentFeedbacks,
			ChartData chartData
	) {}

	// Enhanced dashboard stats with advanced metrics
	public record EnhancedDashboardStats(
			DashboardOverview overview,
			AdvancedMetrics advanced,
			java.util.List<ProjectItem> recentProjects,
			java.util.List<FeedbackItem> recentFeedbacks,
			java.util.List<DepartmentMetrics> departmentMetrics,
			ChartData chartData,
			java.util.List<TimeSeriesMetric> timeSeriesData
	) {}

	// Real-time dashboard features
	public record RealTimeUpdate(
			String type, // "notification", "metric_update", "activity"
			String message,
			Object data,
			java.time.LocalDateTime timestamp,
			String severity // "info", "warning", "error", "success"
	) {}

	public record ActivityFeed(
			Long id,
			String actorName,
			String action,
			String targetType,
			String targetName,
			java.time.LocalDateTime timestamp,
			String icon,
			String color
	) {}

	public record QuickAction(
			String id,
			String title,
			String description,
			String icon,
			String url,
			String category,
			boolean enabled
	) {}

	public record DashboardWidget(
			String id,
			String title,
			String type, // "chart", "metric", "list", "table"
			Object data,
			int gridX,
			int gridY,
			int gridW,
			int gridH,
			boolean visible
	) {}
}
