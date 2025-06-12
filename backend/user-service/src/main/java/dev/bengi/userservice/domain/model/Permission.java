package dev.bengi.userservice.domain.model;

import java.time.LocalDateTime;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;
import dev.bengi.userservice.domain.enums.Action;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table("permissions")
public class Permission {

    @Id
    private Long id;

    @Column("resource")
    private String resource;

    @Column("action")
    private Action action;

    @Column("conditions")
    private String conditions; // JSON string for additional conditions

    @Column("created_at")
    private LocalDateTime createdAt;

    @Column("updated_at")
    private LocalDateTime updatedAt;

//    public String toPermissionString() {
//        if (action == Action.ALL) {
//            return "*";
//        }
//        return resource + ":" + action.getValue() + (conditions != null ? ":" + conditions : "");
//    }
//
//    public static Permission fromString(String permission) {
//        String[] parts = permission.split(":");
//        return Permission.builder()
//                .resource(parts[0])
//                .action(parts.length > 1 ? Action.valueOf(parts[1].toUpperCase()) : Action.ALL)
//                .conditions(parts.length > 2 ? parts[2] : null)
//                .build();
//    }
} 