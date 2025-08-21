package dev.bengi.main.config;

import dev.bengi.main.modules.role.enums.roleName;
import dev.bengi.main.modules.role.model.Role;
import dev.bengi.main.modules.role.repository.RoleRepository;
import dev.bengi.main.modules.user.model.User;
import dev.bengi.main.modules.user.repository.UserRepository;
import dev.bengi.main.modules.user.repository.UserRoleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserRoleRepository userRoleRepository;

    @EventListener(ApplicationReadyEvent.class)
    public void init() {
        String adminRole = roleName.ADMIN.asString();
        String userRole = roleName.USER.asString();

        Mono<Role> ensureAdmin = roleRepository.findByName(adminRole)
                .switchIfEmpty(Mono.defer(() -> {
                    Role r = new Role();
                    r.setName(roleName.ADMIN);
                    r.setDescription("Administrator");
                    return roleRepository.save(r).doOnSuccess(x -> log.info("Seeded role ADMIN"));
                }));

        Mono<Role> ensureUser = roleRepository.findByName(userRole)
                .switchIfEmpty(Mono.defer(() -> {
                    Role r = new Role();
                    r.setName(roleName.USER);
                    r.setDescription("User");
                    return roleRepository.save(r).doOnSuccess(x -> log.info("Seeded role USER"));
                }));

        String adminUsername = "admin";
        String adminEmail = "admin@example.com";
        String adminPassword = "Passw0rd!";

        Mono<Void> ensureAdminUser = userRepository.findByUsername(adminUsername)
                .flatMap(Mono::just)
                .switchIfEmpty(Mono.defer(() -> {
                    User u = new User();
                    u.setUsername(adminUsername);
                    u.setEmail(adminEmail);
                    u.setPassword(passwordEncoder.encode(adminPassword));
                    return userRepository.save(u)
                            .doOnSuccess(x -> log.info("Seeded admin user username='{}' password='{}'", adminUsername, adminPassword));
                }))
                .flatMap(savedUser -> roleRepository.findByName(adminRole)
                        .flatMap(r -> userRoleRepository.addUserRole(savedUser.getId(), r.getId())))
                .then();

        Mono.when(ensureAdmin, ensureUser).then(ensureAdminUser).subscribe();
    }
}


