package dev.mathalama.backend.validation;

import org.springframework.stereotype.Component;

import java.util.Set;

@Component
public class EmailDomainValidator {

    private static final Set<String> ALLOWED_DOMAINS = Set.of(
            // Global
            "gmail.com", "yahoo.com", "hotmail.com", "outlook.com", 
            "icloud.com", "protonmail.com", "proton.me",
            
            // CIS (Russia, Kazakhstan, etc.)
            "mail.ru", "yandex.ru", "yandex.com", "ya.ru", 
            "rambler.ru", "bk.ru", "inbox.ru", "list.ru", "internet.ru",
            "ukr.net", "i.ua" // Popular in Ukraine
    );

    public boolean isValid(String email) {
        if (email == null || !email.contains("@")) {
            return false;
        }
        
        String domain = email.substring(email.lastIndexOf("@") + 1).toLowerCase();
        return ALLOWED_DOMAINS.contains(domain);
    }
    
    public String getAllowedDomainsString() {
        return String.join(", ", ALLOWED_DOMAINS);
    }
}
