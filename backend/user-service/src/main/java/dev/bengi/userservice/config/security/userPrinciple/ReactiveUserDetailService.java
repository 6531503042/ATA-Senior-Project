package dev.bengi.userservice.config.security.userPrinciple;

import org.springframework.context.annotation.Primary;
import org.springframework.security.core.userdetails.ReactiveUserDetailsService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import dev.bengi.userservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;

@Slf4j
@Service
@Primary
@RequiredArgsConstructor
public class ReactiveUserDetailService implements ReactiveUserDetailsService {

    private final UserRepository userRepository;

    @Override
    public Mono<UserDetails> findByUsername(String username) {
        log.debug("Finding user by username or email: {}", username);
        
        // ค้นหาด้วย username ก่อน
        return userRepository.findByUsername(username)
                .switchIfEmpty(
                    // ถ้าไม่พบ ให้ค้นหาด้วย email
                    userRepository.findByEmail(username)
                        .switchIfEmpty(Mono.defer(() -> {
                            log.error("User not found with username or email: {}", username);
                            return Mono.error(new UsernameNotFoundException("User not found with username or email: " + username));
                        }))
                )
                .doOnSuccess(user -> {
                    if (user != null) {
                        log.debug("User found successfully: {}", username);
                    }
                })
                .map(user -> {
                    log.debug("Building UserPrinciple for: {}", user.getUsername());
                    return UserPrinciple.build(user);
                });
    }

    // เพิ่มเมธอดช่วยเหลือสำหรับการค้นหาด้วย email โดยเฉพาะ
    public Mono<UserDetails> findByEmail(String email) {
        log.debug("Finding user by email: {}", email);
        return userRepository.findByEmail(email)
                .switchIfEmpty(Mono.defer(() -> {
                    log.error("User not found with email: {}", email);
                    return Mono.error(new UsernameNotFoundException("User not found with email: " + email));
                }))
                .map(user -> {
                    log.debug("User found by email: {}", email);
                    return UserPrinciple.build(user);
                });
    }
} 