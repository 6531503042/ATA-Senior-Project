package dev.bengi.userservice.domain.payload;

import lombok.Data;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Data
@Configuration
public class TokenManager {

    public String TOKEN;
    public String REFRESH_TOKEN;
    // Store tokens
    private Map<String, String> tokenStore = new HashMap<>();
    private Map<String, String> refreshTokenStore = new HashMap<>();

    public void storeToken(String username, String token) {
        tokenStore.put(username, token);
        TOKEN = token;
    }

    public void storeRefreshToken(String username, String refreshToken) {
        refreshTokenStore.put(username, refreshToken);
        REFRESH_TOKEN = refreshToken;
    }

    public String getTokenByUsername(String username) {
        return tokenStore.get(username);
    }

    public void removeToken(String username) {
        tokenStore.remove(username);
    }

}
