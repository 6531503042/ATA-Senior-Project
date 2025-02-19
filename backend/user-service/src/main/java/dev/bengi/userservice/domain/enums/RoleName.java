package dev.bengi.userservice.domain.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum RoleName {
    ROLE_USER, ROLE_ADMIN;
    
    public String getRole() {
        return this.name();
    }
}
