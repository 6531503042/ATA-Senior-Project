package dev.bengi.feedbackservice.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.ClientRequest;
import org.springframework.web.reactive.function.client.ExchangeFilterFunction;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import reactor.core.publisher.Mono;

@Configuration
public class WebClientConfig {
    
    @Value("${services.user-service.url}")
    private String userServiceUrl;

    @Bean
    public WebClient.Builder webClientBuilder() {
        return WebClient.builder()
            .filter(ExchangeFilterFunction.ofRequestProcessor(request -> {
                ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
                if (attributes != null) {
                    String token = attributes.getRequest().getHeader("Authorization");
                    if (token != null) {
                        ClientRequest newRequest = ClientRequest.from(request)
                            .header("Authorization", token)
                            .build();
                        return Mono.just(newRequest);
                    }
                }
                return Mono.just(request);
            }));
    }

    @Bean
    public WebClient userServiceWebClient(WebClient.Builder webClientBuilder) {
        return webClientBuilder
                .baseUrl(userServiceUrl)
                .build();
    }
} 