package dev.bengi.feedbackservice.config;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import feign.codec.Decoder;
import feign.codec.Encoder;
import org.springframework.beans.factory.ObjectFactory;
import org.springframework.boot.autoconfigure.http.HttpMessageConverters;
import org.springframework.cloud.openfeign.support.ResponseEntityDecoder;
import org.springframework.cloud.openfeign.support.SpringDecoder;
import org.springframework.cloud.openfeign.support.SpringEncoder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;

@Configuration
public class FeignConfig {

    @Bean
    public ObjectMapper objectMapper() {
        return new ObjectMapper()
            .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)
            .registerModule(new JavaTimeModule());
    }

    @Bean
    public Decoder feignDecoder(ObjectMapper objectMapper) {
        MappingJackson2HttpMessageConverter jacksonConverter = 
            new MappingJackson2HttpMessageConverter(objectMapper);

        ObjectFactory<HttpMessageConverters> objectFactory = 
            () -> new HttpMessageConverters(jacksonConverter);

        return new ResponseEntityDecoder(new SpringDecoder(objectFactory));
    }

    @Bean
    public Encoder feignEncoder(ObjectMapper objectMapper) {
        MappingJackson2HttpMessageConverter jacksonConverter = 
            new MappingJackson2HttpMessageConverter(objectMapper);
            
        ObjectFactory<HttpMessageConverters> objectFactory = 
            () -> new HttpMessageConverters(jacksonConverter);

        return new SpringEncoder(objectFactory);
    }
} 