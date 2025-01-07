package dev.bengi.userservice.repository;

import dev.bengi.userservice.domain.enums.RoleName;
import org.springframework.data.jpa.repository.JpaRepository;
import dev.bengi.userservice.domain.model.Role;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {

    @Query("SELECT r FROM Role r WHERE r.name = :name")
    Optional<Role> findByName(@Param("name") RoleName name);

    @Query("SELECT u.roles FROM User u WHERE u.id = :id")
    List<Role> findByUserId(Long userId);

    @Query("SELECT CASE WHEN COUNT(r) > 0 THEN true ELSE false END FROM Role r WHERE r.name = :name")
    boolean existsByName(@Param("name") RoleName name);
}
