package dev.bengi.main.modules.submit.model;

import dev.bengi.main.modules.submit.enums.PrivacyLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.annotation.Transient;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table("submissions")
public class Submit {
    @Id
    private Long id;
    private Long feedbackId;
    private String userId;
    private boolean anonymous;
    private boolean reviewed;
    private PrivacyLevel privacyLevel;
    private String overallComments;
    @CreatedDate
    private LocalDateTime submittedAt;
    @LastModifiedDate
    private LocalDateTime updatedAt;

    @Transient
    private Map<Long, String> responses = new HashMap<>();
}


