package dev.bengi.feedbackservice.security;

import dev.bengi.feedbackservice.dto.UserDto;
import lombok.experimental.UtilityClass;

@UtilityClass
public class UserContext {
    private static final ThreadLocal<UserDto> currentUser = new ThreadLocal<>();
    private static final ThreadLocal<String> currentToken = new ThreadLocal<>();

    public void setCurrentUser(UserDto user) {
        currentUser.set(user);
    }

    public UserDto getCurrentUser() {
        return currentUser.get();
    }

    public void setCurrentToken(String token) {
        currentToken.set(token);
    }

    public String getCurrentToken() {
        return currentToken.get();
    }

    public void clear() {
        currentUser.remove();
        currentToken.remove();
    }
}