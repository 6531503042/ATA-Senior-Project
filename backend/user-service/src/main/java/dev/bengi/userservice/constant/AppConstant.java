package dev.bengi.userservice.constant;

import lombok.NoArgsConstructor;

@NoArgsConstructor(access = lombok.AccessLevel.PRIVATE)
public class AppConstant {
    public static final String LOCAL_DATE_FORMAT = "dd-MM-yyyy";
    public static final String LOCAL_DATE_TIME_FORMAT = "dd-MM-yyyy__HH:mm:ss:SSSSSS";
    public static final String ZONED_DATE_TIME_FORMAT = "dd-MM-yyyy__HH:mm:ss:SSSSSS";
    public static final String INSTANT_FORMAT = "dd-MM-yyyy__HH:mm:ss:SSSSSS";

    public abstract static class DiscoveredDomainApi {

        public static final String API_GATEWAY_HOST = "http://localhost:8080";

        // USER-SERVICE
        public static final String USER_SERVICE_HOST = "http://USER-SERVICE/user-service";
        public static final String USER_SERVICE_API_URL = "http://USER-SERVICE/user-service/api/users";

        // Feedback-SERVICE
        public static final String FEEDBACK_SERVICE_HOST = "http://FEEDBACK-SERVICE/feedback-service";
        public static final String FEEDBACK_SERVICE_API_URL = "http://FEEDBACK-SERVICE/feedback-service/api/feedbacks";
    }
}