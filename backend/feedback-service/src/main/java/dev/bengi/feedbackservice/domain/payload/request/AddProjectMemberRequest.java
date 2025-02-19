package dev.bengi.feedbackservice.domain.payload.request;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AddProjectMemberRequest {
    @NotEmpty(message = "Member IDs cannot be empty")
    private List<Long> memberIds;
}
