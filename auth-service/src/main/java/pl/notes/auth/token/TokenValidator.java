package pl.notes.auth.token;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import pl.notes.user.UserRepository;

import java.security.Key;

@Component
@Slf4j
@RequiredArgsConstructor
public class TokenValidator {

    private final Key secretKey;

    private final UserRepository userRepository;

    public boolean isTokenValid(String token) {
        try {
            final Claims jwtTokenClaims = Jwts.parserBuilder()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            final String subject = jwtTokenClaims.getSubject();
            return userRepository.existsByEmail(subject);
        } catch (Exception exception) {
            log.error("Error while validating token!", exception);
            return false;
        }
    }
}