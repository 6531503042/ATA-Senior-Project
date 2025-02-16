// package dev.bengi.userservice.service.impl;

// import dev.bengi.userservice.exception.EmailServiceException;
// import dev.bengi.userservice.service.EmailService;
// import jakarta.mail.MessagingException;
// import jakarta.mail.internet.MimeMessage;
// import lombok.RequiredArgsConstructor;
// import lombok.extern.slf4j.Slf4j;
// import org.springframework.beans.factory.annotation.Value;
// import org.springframework.mail.MailException;
// import org.springframework.mail.javamail.JavaMailSender;
// import org.springframework.mail.javamail.MimeMessageHelper;
// import org.springframework.scheduling.annotation.Async;
// import org.springframework.stereotype.Service;
// import org.springframework.util.StringUtils;

// @Slf4j
// @Service
// @RequiredArgsConstructor
// public class EmailServiceImpl implements EmailService {

//     private final JavaMailSender mailSender;

//     @Value("${spring.mail.username}")
//     private String fromEmail;

//     @Value("${app.frontend-url}")
//     private String frontendUrl;

//     @Override
//     @Async("emailExecutor")
//     public void sendPasswordResetEmail(String to, String resetToken) {
//         if (!StringUtils.hasText(to) || !StringUtils.hasText(resetToken)) {
//             log.error("Invalid email address or reset token provided");
//             throw new EmailServiceException("Invalid email address or reset token");
//         }

//         try {
//             MimeMessage message = mailSender.createMimeMessage();
//             MimeMessageHelper helper = new MimeMessageHelper(message, "UTF-8");

//             // Build reset URL
//             String resetUrl = String.format("%s/reset-password?token=%s", frontendUrl, resetToken);

//             // HTML email content
//             String htmlContent = String.format("""
//                     <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
//                         <h2>Password Reset Request</h2>
//                         <p>Hello!</p>
//                         <p>You have requested to reset your password. Click the link below to set a new password:</p>
//                         <p><a href="%s" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
//                         <p>If you didn't request this password reset, please ignore this email or contact support if you have concerns.</p>
//                         <p>This password reset link will expire in 15 minutes for security reasons.</p>
//                         <div style="margin-top: 20px; font-size: 12px; color: #666;">
//                             <p>Best regards,<br>Your Application Team</p>
//                             <p>Note: This is an automated message, please do not reply to this email.</p>
//                         </div>
//                     </div>
//                     """, resetUrl);

//             // Set email properties
//             helper.setFrom(fromEmail);
//             helper.setTo(to);
//             helper.setSubject("Password Reset Request");
//             helper.setText(htmlContent, true);

//             // Send the email
//             mailSender.send(message);

//             log.info("Password reset email sent successfully to: {}", to);
//         } catch (MessagingException e) {
//             log.error("Failed to create password reset email for {}: {}", to, e.getMessage());
//             throw new EmailServiceException("Failed to create password reset email", e);
//         } catch (MailException e) {
//             log.error("Failed to send password reset email to {}: {}", to, e.getMessage());
//             throw new EmailServiceException("Failed to send password reset email", e);
//         }
//     }
// }
