package dev.bengi.main.modules.user.model;

public enum roleName {
    USER, ADMIN, SUPER_ADMIN;

    public String asString() {
        return name();
    }
}