package dev.bengi.userservice.domain.payload.response;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResponseMessage {

    @Size(min = 10, max = 500)
    private String message;
}
