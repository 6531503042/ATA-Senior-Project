package dev.bengi.main.modules.dashboard.service;

import dev.bengi.main.modules.dashboard.dto.DashboardDtos.*;
import dev.bengi.main.modules.projects.repository.ProjectRepository;
import dev.bengi.main.modules.projects.repository.ProjectMemberRepository;
import dev.bengi.main.modules.feedback.repository.FeedbackRepository;
import dev.bengi.main.modules.submit.repository.SubmitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final ProjectRepository projectRepository;
    private final SubmitRepository submitRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final FeedbackRepository feedbackRepository;

    public Mono<DashboardStats> getStats(String currentUsername) {
        // Overview metrics
        Mono<Long> totalProjects = projectRepository.count();
        Mono<Long> totalSubmissions = submitRepository.count();
        // Approximate total members by distinct user_ids in submissions
        Mono<Long> totalMembers = Mono.just(0L); // Placeholder; optimize with a dedicated query if needed

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

        Mono<DashboardOverview> overview = Mono.zip(totalProjects, totalSubmissions, totalMembers,
                projThisMonth.defaultIfEmpty(0L), projPrevMonth.defaultIfEmpty(0L),
                submThisMonth.defaultIfEmpty(0L), submPrevMonth.defaultIfEmpty(0L))
            .map(t -> new DashboardOverview(
                    t.getT1(),
                    t.getT2(),
                    t.getT3(),
                    0.0,
                    formatGrowth(t.getT4(), t.getT5()),
                    formatGrowth(t.getT6(), t.getT7()),
                    "+0%",
                    "+0%"
            ));

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
                                p.getStatus(),
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


