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
    
    @Column("description")
    private String description;
    
    @Column("created_at")
    private LocalDateTime createdAt;
    
    @Column("updated_at")
    private LocalDateTime updatedAt;
    
    public RoleName getRoleName() {
        if (name == null) return null;
        try {
            return RoleName.valueOf(name);
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
    
    public void setRoleName(RoleName roleName) {
        this.name = roleName != null ? roleName.name() : null;
    }
}
