package dev.bengi.userservice.config;

import dev.bengi.userservice.domain.model.Role;
import dev.bengi.userservice.domain.model.User;
import dev.bengi.userservice.domain.enums.RoleName;
import dev.bengi.userservice.repository.RoleRepository;
import dev.bengi.userservice.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;

@Component
@RequiredArgsConstructor
@Slf4j
public class DatabaseInitializer {

   private final RoleRepository roleRepository;
   private final UserRepository userRepository;
   private final PasswordEncoder passwordEncoder;

   @PostConstruct
   @Transactional
   public void init() {
       log.info("Initializing Database with default roles");

       Role userRole;
       if (!roleRepository.existsByName(RoleName.USER)) {
           userRole = new Role();
           userRole.setName(RoleName.USER);
           roleRepository.save(userRole);
           log.info("Created USER role");
       } else {
           userRole = roleRepository.findByName(RoleName.USER).get();
       }

       Role adminRole;
       if (!roleRepository.existsByName(RoleName.ADMIN)) {
           adminRole = new Role();
           adminRole.setName(RoleName.ADMIN);
           roleRepository.save(adminRole);
           log.info("Created ADMIN role");
       } else {
           adminRole = roleRepository.findByName(RoleName.ADMIN).get();
       }

       // Create default admin user if not exists
       if (!userRepository.existsByEmail("nimittanbooutor@gmail.com")) {
           User adminUser = new User();
           adminUser.setUsername("admin");
           adminUser.setEmail("nimittanbooutor@gmail.com");
           adminUser.setPassword(passwordEncoder.encode("password123"));
           adminUser.setFullname("Admin User");
           adminUser.setGender("Male");
           adminUser.setAvatar("https://robohash.org/nimittanbooutor@gmail.com?set=set2&size=180x180");
           adminUser.setRoles(Collections.singleton(adminRole));
           userRepository.save(adminUser);
           log.info("Created default admin user");
       }
   }
}
