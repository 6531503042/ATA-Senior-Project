package dev.bengi.main.modules.user.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Table("users")
public class user {

    @Id
    private Long id;

    private String name;

    private LocalDateTime createdAt;

    private LocalDateTime updateAt;
}
