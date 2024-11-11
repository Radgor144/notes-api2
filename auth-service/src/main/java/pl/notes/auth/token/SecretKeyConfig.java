package pl.notes.auth.token;

import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.security.Key;

@Configuration
@Slf4j
class SecretKeyConfig {

    private static final String GENERATING_KEY_FROM_SECRET_KEY_ERROR_MESSAGE = "Error while generating Key from secret key";

    @Bean
    Key secretKey(@Value("${jwt.secret.key}") String secretKey) {
        try {
            final byte[] keyBytes = Decoders.BASE64.decode(secretKey);
            return Keys.hmacShaKeyFor(keyBytes);
        } catch (Exception e) {
            log.error(GENERATING_KEY_FROM_SECRET_KEY_ERROR_MESSAGE, e);
            throw new RuntimeException(GENERATING_KEY_FROM_SECRET_KEY_ERROR_MESSAGE);
        }
    }
}
