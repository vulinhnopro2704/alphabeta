package org.example.server.service;

import org.example.server.dto.Request.AuthRequest;
import org.example.server.dto.Request.SignUpRequest;
import org.example.server.dto.Response.ApiResponse;
import org.example.server.dto.Response.LoginResponse;

public interface AuthService {
    LoginResponse authenticate(AuthRequest loginRequest);

    ApiResponse<String> handleSignUpNewUser(SignUpRequest signUpRequest);

    LoginResponse handleRefreshToken(String refreshToken);
}
