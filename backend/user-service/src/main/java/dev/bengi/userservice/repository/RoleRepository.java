package dev.bengi.userservice.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import dev.bengi.userservice.domain.enums.RoleName;
import dev.bengi.userservice.domain.model.Role;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {

    @Query("SELECT r FROM Role r WHERE r.name = :name")
    Optional<Role> findByName(@Param("name") RoleName name);

    @Query("SELECT u.roles FROM User u WHERE u.id = :userId")
    List<Role> findByUserId(@Param("userId") Long userId);

    @Query("SELECT CASE WHEN COUNT(r) > 0 THEN true ELSE false END FROM Role r WHERE r.name = :name")
    boolean existsByName(@Param("name") RoleName name);
}
