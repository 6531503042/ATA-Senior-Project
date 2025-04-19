package dev.bengi.userservice.config.security.userPrinciple;
import dev.bengi.userservice.domain.model.User;
import dev.bengi.userservice.domain.enums.Gender;

import lombok.*;
import lombok.experimental.Accessors;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Data
@With
@Builder
@Accessors(chain = true)
@AllArgsConstructor
@NoArgsConstructor
public class UserPrinciple implements UserDetails {
    private Long id;
    private String username;
    @Getter
    private String fullName;
    private String email;
    @JsonIgnore
    private String password;
    private String avatar;
    private Gender gender;
    private Collection<? extends GrantedAuthority> authorities;

    public static UserPrinciple build(User user) {
        List<GrantedAuthority> authorities = user.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority(role.getName()))
                .collect(Collectors.toList());

        return UserPrinciple.builder()
                .id(user.getId())
                .username(user.getUsername())
                .fullName(user.getFullname())
                .email(user.getEmail())
                .password(user.getPassword())
                .avatar(user.getAvatar())
                .gender(user.getGender())
                .authorities(authorities)
                .build();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
