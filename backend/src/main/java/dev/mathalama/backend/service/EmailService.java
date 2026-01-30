package dev.mathalama.backend.service;

import com.resend.Resend;
import com.resend.services.emails.model.CreateEmailOptions;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final Resend resend;

    @Async
    public void sendVerificationEmail(String to, String verificationLink) {
        String htmlContent = """
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
                <h2 style="color: #333;">Добро пожаловать в University Reviews!</h2>
                <p>Спасибо за регистрацию. Пожалуйста, подтвердите вашу почту, чтобы начать пользоваться сервисом.</p>
                <div style="margin: 30px 0;">
                    <a href="%s" style="display: inline-block; padding: 12px 25px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">Подтвердить Email</a>
                </div>
                <p style="color: #666; font-size: 14px;">
                    У вас есть <b>24 часа</b>, чтобы подтвердить аккаунт. 
                    По истечении этого времени ваша заявка на регистрацию будет автоматически удалена из системы в целях безопасности, и вам придется зарегистрироваться повторно.
                </p>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
            </div>
            """.formatted(verificationLink, verificationLink);

        CreateEmailOptions params = CreateEmailOptions.builder()
                .from("University Reviews <support@mathalama.dev>")
                .to(to)
                .subject("Подтверждение регистрации")
                .html(htmlContent)
                .build();

        try {
            resend.emails().send(params);
            log.info("Verification email sent to {}", to);
        } catch (Exception e) {
            log.error("Failed to send email to {}", to, e);
            throw new RuntimeException("Failed to send verification email");
        }
    }

    @Async
    public void sendPasswordResetEmail(String to, String resetLink) {
        String htmlContent = """
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
                <h2 style="color: #333;">Password Reset Request</h2>
                <p>We received a request to reset your password. If this was you, please click the button below to set a new password.</p>
                <div style="margin: 30px 0;">
                    <a href="%s" style="display: inline-block; padding: 12px 25px; background-color: #dc3545; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
                </div>
                <p style="color: #666; font-size: 14px;">
                    This link expires in 15 minutes.
                </p>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="font-size: 12px; color: #999;">If you didn't request this change, you can safely ignore this email.</p>
            </div>
            """.formatted(resetLink);

        CreateEmailOptions params = CreateEmailOptions.builder()
                .from("University Reviews <support@mathalama.dev>")
                .to(to)
                .subject("Сброс пароля")
                .html(htmlContent)
                .build();

        try {
            resend.emails().send(params);
            log.info("Password reset email sent to {}", to);
        } catch (Exception e) {
            log.error("Failed to send reset email to {}", to, e);
            // We usually don't throw here to avoid leaking info about email existence, but logging is key
        }
    }
}
