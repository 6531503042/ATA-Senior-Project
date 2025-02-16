package dev.bengi.userservice.http;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpHeaders;

import java.net.URI;
import java.net.URISyntaxException;

@Service
@Slf4j
public class HeaderGenerator {

    public HttpHeaders getHeadersForSuccessGetMethod() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "application/json");
        return headers;
    }

    public HttpHeaders getHeadersForEach() {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Type", "application/problem+json; charset=UTF-8");
        return headers;
    }

    public HttpHeaders getHeadersForSuccessPostMethod(HttpServletRequest request, Long newResourceId) {
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.add("Content-Type", "application/json; charset=UTF-8");
        try {
            httpHeaders.setLocation(new URI(request.getRequestURI() + "/" + newResourceId));
        } catch (URISyntaxException e) {
            log.error(e.getMessage());
        }
        return httpHeaders;
    }

}
