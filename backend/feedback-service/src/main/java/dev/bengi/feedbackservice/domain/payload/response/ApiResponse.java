package dev.bengi.feedbackservice.domain.payload.response;

import jakarta.persistence.PrePersist;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.ZoneId;
import java.time.ZonedDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse<T> {

    private String status;
    private String msg;
    private T date;
    private ZonedDateTime timestamp;

    @PrePersist
    public void onCreate(){
        timestamp = ZonedDateTime.now(ZoneId.of("Asia/Bangkok"));
    }

    public static <T> ApiResponse<T> error(String msg) {
        return ApiResponse.<T>builder()
                .status("error")
                .msg(msg)
                .timestamp(ZonedDateTime.now(ZoneId.of("Asia/Bangkok")))
                .build();
    }

    public static <T> ApiResponse<ProjectResponse> success(T data) {
        return (ApiResponse<ProjectResponse>) ApiResponse.<T>builder()
                .status("success")
                .date(data)
                .timestamp(ZonedDateTime.now(ZoneId.of("Asia/Bangkok")))
                .build();
    }

    public ApiResponse<T> withData(T data) {
        this.date = data;
        return this;
    }



}
