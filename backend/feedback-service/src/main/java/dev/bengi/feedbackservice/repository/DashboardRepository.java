// package dev.bengi.feedbackservice.repository;

// import dev.bengi.feedbackservice.domain.enums.AnswerType;
// import dev.bengi.feedbackservice.domain.model.Feedback;
// import dev.bengi.feedbackservice.domain.enums.QuestionCategory;
// import org.springframework.data.jpa.repository.JpaRepository;
// import org.springframework.data.jpa.repository.Query;
// import org.springframework.data.repository.query.Param;

// import java.time.ZonedDateTime;
// import java.util.List;
// import java.util.Map;

// public interface DashboardRepository extends JpaRepository<Feedback, Long> {
//     @Query("SELECT f.category, COUNT(f) FROM Feedback f " +
//            "WHERE f.submittedAt BETWEEN :startDate AND :endDate " +
//            "GROUP BY f.category")
//     Map<QuestionCategory, Long> getCategoryDistribution(
//         @Param("startDate") ZonedDateTime startDate, 
//         @Param("endDate") ZonedDateTime endDate
//     );

//     @Query("SELECT f.projectId, COUNT(f) FROM Feedback f " +
//            "WHERE f.submittedAt BETWEEN :startDate AND :endDate " +
//            "GROUP BY f.projectId")
//     Map<Long, Long> getProjectFeedbackCount(
//         @Param("startDate") ZonedDateTime startDate, 
//         @Param("endDate") ZonedDateTime endDate
//     );

//     @Query("SELECT a.type, COUNT(a) FROM Answer a " +
//            "JOIN a.feedback f " +
//            "WHERE f.submittedAt BETWEEN :startDate AND :endDate " +
//            "GROUP BY a.type")
//     Map<AnswerType, Long> getAnswerTypeDistribution(
//         @Param("startDate") ZonedDateTime startDate, 
//         @Param("endDate") ZonedDateTime endDate
//     );
// }