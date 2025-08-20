package dev.bengi.main.modules.user.repository;

import dev.bengi.main.modules.user.model.User;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;

@Repository
public interface UserRepository extends R2dbcRepository<User, Long> {
    @Query("SELECT * FROM users WHERE username = :username")
    Mono<User> findByUsername(String username);

    @Query("SELECT * FROM users WHERE email = :email")
    Mono<User> findByEmail(String email);

    @Query("SELECT EXISTS(SELECT 1 FROM users WHERE username = :username)")
    Mono<Boolean> existsByUsername(String username);

    @Query("SELECT EXISTS(SELECT 1 FROM users WHERE email = :email)")
    Mono<Boolean> existsByEmail(String email);

    // Fetch user with roles (roles as names) via join; consumer can populate transient field
    @Query("SELECT u.* FROM users u WHERE u.username = :username")
    Mono<User> findUserCoreByUsername(String username);

    @Query("SELECT r.name FROM roles r JOIN user_roles ur ON ur.role_id = r.id JOIN users u ON ur.user_id = u.id WHERE u.username = :username")
    reactor.core.publisher.Flux<String> findRoleNamesByUsername(String username);
}
