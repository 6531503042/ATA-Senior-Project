package dev.bengi.userservice.domain.model;

import dev.bengi.userservice.domain.enums.RoleName;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table("roles")
public class Role {

    @Id
    private Long id;
    
    @Column("name")
    private String name;

    @Column("permissions")
    private Set<String> permissions;
    
    @Column("description")
    private String description;
    
    @Column("created_at")
    private LocalDateTime createdAt;
    
    @Column("updated_at")
    private LocalDateTime updatedAt;
    
//    public boolean hasPermission(String requiredPermission) {
//        if (permissions == null) return false;
//        if (permissions.contains("*")) return true;
//
//        String[] requiredParts = requiredPermission.split(":");
//        if (requiredParts.length < 2) return false;
//
//        String resource = requiredParts[0];
//        String action = requiredParts[1];
//
//        return permissions.stream().anyMatch(permission -> {
//            String[] parts = permission.split(":");
//            if (parts.length < 2) return false;
//
//            // Check for resource-level wildcard
//            if (parts[1].equals("*") && parts[0].equals(resource)) return true;
//
//            // Check for exact match
//            if (parts[0].equals(resource) && parts[1].equals(action)) {
//                // If the required permission has an ID constraint
//                if (requiredParts.length > 2) {
//                    return parts.length > 2 && parts[2].equals(requiredParts[2]);
//                }
//                return true;
//            }
//
//            return false;
//        });
//    }
}
