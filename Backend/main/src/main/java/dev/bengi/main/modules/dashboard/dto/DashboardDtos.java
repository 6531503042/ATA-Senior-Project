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
}
