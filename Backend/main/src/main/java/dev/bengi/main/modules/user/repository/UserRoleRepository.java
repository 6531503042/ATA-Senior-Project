package dev.bengi.main.modules.user.repository;

import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;

@Repository
public interface UserRoleRepository extends R2dbcRepository<UserRoleRepository.Row, Long> {

    @Query("INSERT INTO user_roles(user_id, role_id) VALUES (:userId, :roleId) ON CONFLICT DO NOTHING")
    Mono<Void> addUserRole(Long userId, Long roleId);

    class Row { public Long userId; public Long roleId; }
}


