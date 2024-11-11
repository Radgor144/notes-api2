package pl.notes.app.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import pl.auth.client.model.ValidateTokenRequest;
import pl.auth.client.model.ValidateTokenResponse;
import pl.notes.app.auth.AuthClient;

import java.io.IOException;
import java.util.Optional;

@RequiredArgsConstructor
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final AuthClient authClient;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        try {
            final String authHeader = request.getHeader("Authorization");
            final String token = authHeader.substring(7);
            if (isTokenValid(token)) {
                Authentication auth = new JWTAuthentication(token);
                SecurityContext sc = SecurityContextHolder.getContext();
                sc.setAuthentication(auth);
                filterChain.doFilter(request, response);
            } else {
                SecurityContext sc = SecurityContextHolder.getContext();
                sc.getAuthentication().setAuthenticated(false);
            }
        } catch (RuntimeException e) {
            filterChain.doFilter(request, response);
        }
    }

    private Boolean isTokenValid(String token) {
        ResponseEntity<ValidateTokenResponse> validateTokenResponseResponseEntity = authClient.validateToken(new ValidateTokenRequest(token));
        return Optional.ofNullable(validateTokenResponseResponseEntity.getBody())
                .map(ValidateTokenResponse::getIsValid)
                .orElse(false);
    }
}
