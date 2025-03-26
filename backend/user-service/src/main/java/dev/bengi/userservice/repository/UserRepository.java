package dev.bengi.userservice.repository;

import dev.bengi.userservice.domain.model.User;
import dev.bengi.userservice.domain.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    @Query("SELECT DISTINCT u FROM User u LEFT JOIN FETCH u.roles WHERE u.username = :username")
    Optional<User> findByUsername(@Param("username") String username);

    @Query("SELECT DISTINCT u FROM User u LEFT JOIN FETCH u.roles WHERE u.email = :email")
    Optional<User> findByEmail(@Param("email") String email);

    @Query("SELECT u FROM User u WHERE u.username = :usernameOrEmail OR u.email = :usernameOrEmail")
    Optional<User> findByUsernameOrEmail(@Param("usernameOrEmail") String usernameOrEmail);

    @Query("SELECT CASE WHEN COUNT(u) > 0 THEN true ELSE false END FROM User u WHERE u.username = :username")
    boolean existsByUsername(@Param("username") String username);

    @Query("SELECT CASE WHEN COUNT(u) > 0 THEN true ELSE false END FROM User u WHERE u.email = :email")
    boolean existsByEmail(@Param("email") String email);
    
    @Query("SELECT u FROM User u WHERE u.department = :departmentId")
    List<User> findByDepartmentId(@Param("departmentId") String departmentId);
    
    @Query("SELECT u FROM User u WHERE :projectId MEMBER OF u.projectAuthorities")
    List<User> findByProjectId(@Param("projectId") Long projectId);

    @Query("SELECT u FROM User u WHERE :projectId MEMBER OF u.projectAuthorities")
    Set<User> findByProjectAuthorities(@Param("projectId") Long projectId);

    @Query("SELECT CASE WHEN COUNT(u) > 0 THEN true ELSE false END FROM User u WHERE u.id = :userId AND :projectId MEMBER OF u.projectAuthorities")
    boolean hasProjectAuthority(@Param("userId") Long userId, @Param("projectId") Long projectId);

    List<User> findByRolesContaining(Role role);
}
