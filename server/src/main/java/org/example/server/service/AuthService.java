package org.example.server.service;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.example.server.dto.Request.AuthRequest;
import org.example.server.dto.Request.SignUpRequest;
import org.example.server.dto.Response.ApiResponse;
import org.example.server.dto.Response.LoginResponse;

public interface AuthService {
    LoginResponse authenticate(AuthRequest loginRequest, HttpServletResponse httpServletResponse);

    ApiResponse<String> handleSignUpNewUser(SignUpRequest signUpRequest);

    LoginResponse handleRefreshToken(String refreshToken, HttpServletResponse httpServletResponse);

    void handleLogout(HttpServletRequest request, HttpServletResponse response);
}
