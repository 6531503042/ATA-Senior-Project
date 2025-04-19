package dev.bengi.userservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class UserServiceApplication {

	public static void main(String[] args) {
		// Set Eureka system properties
		System.setProperty("eureka.client.serviceUrl.defaultZone", "http://localhost:8087/eureka/");
		System.setProperty("eureka.client.eureka-server-port", "8087");
		
		SpringApplication.run(UserServiceApplication.class, args);
	}

}
