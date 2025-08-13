package dev.bengi.userservice.exception.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse {
    private boolean success;
    private String message;
    private String error;
    private Object data;

    public ApiResponse(boolean success, String message, String error) {
        this.success = success;
        this.message = message;
        this.error = error;
    }

    public static ApiResponse success(String message, Object data) {
        return new ApiResponse(true, message, null, data);
    }

    public static ApiResponse error(String message, String error) {
        return new ApiResponse(false, message, error, null);
    }
} 