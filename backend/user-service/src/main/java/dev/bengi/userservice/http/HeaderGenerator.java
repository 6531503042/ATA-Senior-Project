package dev.bengi.userservice.http;

import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.reactive.function.server.ServerRequest;

@Service
@Slf4j
public class HeaderGenerator {

    public HttpHeaders getHeadersForSuccessGetMethod() {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Type", "application/json; charset=UTF-8");
        return headers;
    }

    public HttpHeaders getHeadersForEach() {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Type", "application/json; charset=UTF-8");
        return headers;
    }

    public HttpHeaders getHeadersForSuccessPostMethod(Long newResourceId) {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Type", "application/json; charset=UTF-8");
        if (newResourceId != null) {
            headers.add("Location", "/api/users/" + newResourceId);
        }
        return headers;
    }
}
