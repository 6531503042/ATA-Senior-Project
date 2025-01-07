package dev.bengi.userservice.service;


public interface EmailService {

    void sendPasswordResetEmail(String to, String resetToken);

} 


