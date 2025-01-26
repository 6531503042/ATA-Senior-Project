package dev.bengi.userservice.config;

import dev.bengi.userservice.domain.model.User;
import dev.bengi.userservice.domain.payload.request.RegisterRequest;
import dev.bengi.userservice.repository.UserRepository;
import dev.bengi.userservice.security.userPrinciple.UserPrinciple;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.boot.autoconfigure.kafka.KafkaProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import reactor.kafka.sender.KafkaSender;
import reactor.kafka.sender.SenderOptions;

import java.util.HashMap;
import java.util.Map;

@Configuration
@RequiredArgsConstructor
public class ApplicationConfig {
    
    private final UserRepository userRepository;

    @Bean
    public UserDetailsService userDetailsService() {
        return username -> userRepository.findByUserNameOrEmail(username)
                .map(UserPrinciple::build)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username/email: " + username));
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService());
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public ModelMapper modelMapper() {
        ModelMapper modelMapper = new ModelMapper();
        modelMapper.getConfiguration()
                .setSkipNullEnabled(true)
                .setFieldMatchingEnabled(true)
                .setFieldAccessLevel(org.modelmapper.config.Configuration.AccessLevel.PRIVATE);
        
        // Add custom mapping for fullName to fullname
        modelMapper.createTypeMap(RegisterRequest.class, User.class)
                .addMappings(mapper -> mapper.map(RegisterRequest::getFullName, User::setFullname));
        
        return modelMapper;
    }

    @Bean
    public KafkaSender<String, String> kafkaSender(KafkaProperties properties) {
        Map<String, Object> props = new HashMap<>();
        props.put("bootstrap.servers", properties.getBootstrapServers());
        props.put("key.serializer", "org.apache.kafka.common.serialization.StringSerializer");
        props.put("value.serializer", "org.apache.kafka.common.serialization.StringSerializer");
        return KafkaSender.create(SenderOptions.create(props));
    }
}
