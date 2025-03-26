package dev.bengi.userservice.security.userPrinciple;

import dev.bengi.userservice.domain.model.User;
import dev.bengi.userservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserDetailService implements UserDetailsService {

    private final UserRepository repository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String userName) throws UsernameNotFoundException {
        User user = repository.findByUsernameOrEmail(userName)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username or email: " + userName));
        return UserPrinciple.build(user);
    }

    @Transactional
    public UserDetails loadUserByEmail(String email) {
        User user = repository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
        return UserPrinciple.build(user);
    }
}
