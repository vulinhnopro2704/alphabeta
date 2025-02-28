package org.example.server.dto.Response;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.springframework.beans.factory.annotation.Value;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponse {
    @JsonProperty("access_token")
    private String accessToken;
    @JsonProperty("token_type")
    private String tokenType = "Bearer";
    @JsonProperty("expires_in")
    @Value("${alphabeta.jwt.expiration}")
    private int expiresIn;
}
