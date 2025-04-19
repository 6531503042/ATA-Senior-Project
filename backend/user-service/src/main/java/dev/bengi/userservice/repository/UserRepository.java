package dev.bengi.userservice.repository;

import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;

import dev.bengi.userservice.domain.model.User;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Repository
public interface UserRepository extends R2dbcRepository<User, Long> {
    
    @Query("SELECT * FROM users WHERE username = :username")
    Mono<User> findByUsername(String username);

    @Query("SELECT * FROM users WHERE email = :email")
    Mono<User> findByEmail(String email);

    @Query("SELECT * FROM users WHERE username = :usernameOrEmail OR email = :usernameOrEmail")
    Mono<User> findByUsernameOrEmail(String usernameOrEmail);

    @Query("SELECT EXISTS(SELECT 1 FROM users WHERE username = :username)")
    Mono<Boolean> existsByUsername(String username);

    @Query("SELECT EXISTS(SELECT 1 FROM users WHERE email = :email)")
    Mono<Boolean> existsByEmail(String email);
    
    // For fetching users with all collections/relations
    @Query("SELECT * FROM users")
    Flux<User> findAllWithCollections();
    
    /**
     * Find user by username or email with roles.
     * This query attempts to eagerly fetch the roles for proper authentication.
     */
    @Query("SELECT u.*, r.id as role_id, r.name as role_name, r.description as role_description " +
           "FROM users u " +
           "LEFT JOIN user_roles ur ON u.id = ur.user_id " +
           "LEFT JOIN roles r ON ur.role_id = r.id " +
           "WHERE u.username = :usernameOrEmail OR u.email = :usernameOrEmail")
    Flux<User> findByUsernameOrEmailWithRoles(String usernameOrEmail);
}
