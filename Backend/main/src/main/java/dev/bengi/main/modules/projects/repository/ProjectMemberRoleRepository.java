package dev.bengi.main.modules.projects.repository;

import dev.bengi.main.modules.projects.model.ProjectMemberRole;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Repository
public interface ProjectMemberRoleRepository extends R2dbcRepository<ProjectMemberRole, Long> {
    
    @Query("SELECT * FROM project_member_roles WHERE project_id = :projectId AND user_id = :userId AND is_active = true")
    Mono<ProjectMemberRole> findActiveByProjectAndUser(Long projectId, Long userId);
    
    @Query("SELECT * FROM project_member_roles WHERE project_id = :projectId AND is_active = true")
    Flux<ProjectMemberRole> findActiveByProject(Long projectId);
    
    @Query("SELECT * FROM project_member_roles WHERE user_id = :userId AND is_active = true")
    Flux<ProjectMemberRole> findActiveByUser(Long userId);
    
    @Query("SELECT * FROM project_member_roles WHERE project_id = :projectId AND role_id = :roleId AND is_active = true")
    Flux<ProjectMemberRole> findActiveByProjectAndRole(Long projectId, Long roleId);
    
    @Query("UPDATE project_member_roles SET is_active = false WHERE project_id = :projectId AND user_id = :userId")
    Mono<Void> deactivateByProjectAndUser(Long projectId, Long userId);
    
    @Query("SELECT COUNT(*) FROM project_member_roles WHERE project_id = :projectId AND role_id = :roleId AND is_active = true")
    Mono<Long> countActiveByProjectAndRole(Long projectId, Long roleId);
    
    @Query("""
        SELECT pmr.*, pr.name as role_name, u.username, u.email, u.first_name, u.last_name
        FROM project_member_roles pmr
        JOIN project_roles pr ON pmr.role_id = pr.id
        JOIN users u ON pmr.user_id = u.id
        WHERE pmr.project_id = :projectId AND pmr.is_active = true
        ORDER BY pr.name, u.username
        """)
    Flux<ProjectMemberRole> findProjectMembersWithDetails(Long projectId);
}
