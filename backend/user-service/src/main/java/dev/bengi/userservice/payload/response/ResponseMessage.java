package dev.bengi.userservice.payload.response;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class ResponseMessage {

    @Size(min = 10, max = 500)
    private String message;
}
