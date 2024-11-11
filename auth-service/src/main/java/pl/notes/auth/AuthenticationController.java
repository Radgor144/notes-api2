package pl.notes.auth;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.notes.api.AuthenticateApi;
import pl.notes.api.SignupApi;
import pl.notes.api.ValidateApi;
import pl.notes.auth.token.TokenValidator;
import pl.notes.model.AuthenticationRequest;
import pl.notes.model.AuthenticationResponse;
import pl.notes.model.RegisterRequest;
import pl.notes.model.ValidateTokenRequest;
import pl.notes.model.ValidateTokenResponse;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthenticationController implements AuthenticateApi, SignupApi, ValidateApi {

    private final AuthenticationService authenticationService;

    private final TokenValidator tokenValidator;

    @Override
    public ResponseEntity<AuthenticationResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authenticationService.register(request));
    }

    @Override
    public ResponseEntity<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest request) {
        return ResponseEntity.ok(authenticationService.authenticate(request));
    }

    @Override
    public ResponseEntity<ValidateTokenResponse> validateToken(@RequestBody ValidateTokenRequest validateTokenRequest) {
        final String token = validateTokenRequest.getToken();
        final boolean isTokenValid = tokenValidator.isTokenValid(token);
        return ResponseEntity.ok(new ValidateTokenResponse(isTokenValid));
    }
}
