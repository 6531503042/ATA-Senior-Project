package dev.bengi.userservice.security.userPrinciple;
import dev.bengi.userservice.domain.model.User;

import lombok.*;
import lombok.experimental.Accessors;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Data
@With
@Builder
@Accessors(chain = true)
@AllArgsConstructor
@NoArgsConstructor
public class UserPrinciple implements UserDetails {
    private Long id;
    private String userName;
    private String fullName;
    private String email;
    private String password;
    private String avatar;
    private String gender;
    private Collection<? extends GrantedAuthority> roles;

    public static UserPrinciple build(User user) {
        List<SimpleGrantedAuthority> authorityList = user.getRoles()
                .stream()
                .map(role -> new SimpleGrantedAuthority(role.getName().name()))
                .toList();

        return UserPrinciple.builder()
                .id(user.getId())
                .userName(user.getUsername())
                .fullName(user.getFullname())
                .email(user.getEmail())
                .password(user.getPassword())
                .avatar(user.getAvatar())
                .gender(user.getGender())
                .roles(authorityList)
                .build();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return roles;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return userName;
    }

    public String getFullName() {
        return fullName;
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
