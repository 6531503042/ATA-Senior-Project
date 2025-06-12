package dev.bengi.userservice.domain.enums;

import lombok.Getter;

@Getter
public enum Action {
    READ("read"),
    CREATE("create"),
    UPDATE("update"),
    DELETE("delete"),
    ALL("*");

    private final String value;

    Action(String value) {
        this.value = value;
    }

}