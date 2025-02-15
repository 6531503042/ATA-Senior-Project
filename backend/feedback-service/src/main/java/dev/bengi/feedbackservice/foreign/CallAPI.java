package dev.bengi.feedbackservice.foreign;

import dev.bengi.feedbackservice.domain.payload.response.UserDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Component
public class CallAPI {

    private final WebClient.Builder webClientBuilder;

    @Autowired
    public CallAPI(WebClient.Builder webClientBuilder1) {
        this.webClientBuilder = webClientBuilder1;
    }

    public Mono<UserDto> receiveUser(Long userId, String token) {
        return webClientBuilder.baseUrl("http://localhost:8081").build()
                .get()
                .uri("/api/manager/user/" + userId)
                .header("Authorization", "Bearer " + token)
                .retrieve()
                .bodyToMono(UserDto.class);
    }
}
