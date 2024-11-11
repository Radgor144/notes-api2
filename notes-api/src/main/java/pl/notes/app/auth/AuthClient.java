package pl.notes.app.auth;

import org.springframework.cloud.openfeign.FeignClient;
import pl.auth.client.api.AuthApi;

@FeignClient(value = "authClient", url = "localhost:8081/api/auth/")
public interface AuthClient extends AuthApi {

}
