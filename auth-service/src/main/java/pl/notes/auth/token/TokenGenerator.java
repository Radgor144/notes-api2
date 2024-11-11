package pl.notes.auth.token;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.time.Clock;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;

@RequiredArgsConstructor
@Component
public class TokenGenerator {

    private final Key secretKey;

    private final Clock clock;

    public String generateToken(String subject) {
        final Instant currentInstant = Instant.now(clock);
        return Jwts.builder()
                .setSubject(subject)
                .setIssuedAt(Date.from(currentInstant))
                .setExpiration(calculateExpirationDate(currentInstant))
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .compact();
    }

    private static Date calculateExpirationDate(Instant currentInstant) {
        return Date.from(currentInstant.plus(15, ChronoUnit.MINUTES));
    }
}
