//package dev.bengi.feedbackservice.controller.employee;
//
//import dev.bengi.feedbackservice.domain.model.Feedback;
//import dev.bengi.feedbackservice.domain.payload.request.SubmitFeedbackRequest;
//import dev.bengi.feedbackservice.service.FeedbackService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//@RestController
//@RequestMapping("api/v1/employee/submit")
//@RequiredArgsConstructor
//public class SubmitController {
//
//    private final FeedbackService feedbackService;
//
//
//    @PostMapping("/submit")
//    public ResponseEntity<Feedback> submitFeedback(
//            @RequestBody SubmitFeedbackRequest request
//    ) {
//        var feedbackResponse = feedbackService.submitFeedback(request.getUserId(), request);
//        return ResponseEntity.ok(feedbackResponse);
//    }
//}
