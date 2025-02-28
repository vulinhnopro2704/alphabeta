package org.example.server.controller.impl;


import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.server.dto.Request.AuthRequest;
import org.example.server.dto.Request.SignUpRequest;
import org.example.server.dto.Response.ApiResponse;
import org.example.server.service.AuthService;
import org.example.server.service.IJwtService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@AllArgsConstructor
public class AuthController {
    private final AuthService authService;
    private final IJwtService jwtTokenService;

    @PostMapping("/login")
    public ResponseEntity<?> logIn(@RequestBody AuthRequest loginRequest, HttpServletResponse httpServletResponse) {
        var loginResponse = authService.authenticate(loginRequest, httpServletResponse);
        if (loginResponse.getAccessToken() == null) {
            ApiResponse<Object> response = new ApiResponse<>(401, "Login failed", null);
            return ResponseEntity.status(401).body(response);
        }
        ApiResponse<Object> response = new ApiResponse<>(200, "Login successful", loginResponse);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signUp(@RequestBody SignUpRequest signUpRequest) {
        var response = authService.handleSignUpNewUser(signUpRequest);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(HttpServletRequest request, HttpServletResponse httpServletResponse) {
        String refreshToken = null;
        Cookie[] cookies = request.getCookies();

        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("refreshtoken".equalsIgnoreCase(cookie.getName().replace("_", ""))) {
                    refreshToken = cookie.getValue();
                    break;
                }
            }
        }

        if (refreshToken == null || refreshToken.isEmpty()) {
            ApiResponse<Object> response = new ApiResponse<>(401, "Refresh token not found", null);
            return ResponseEntity.status(401).body(response);
        }

        var response = authService.handleRefreshToken(refreshToken, httpServletResponse);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
        authService.handleLogout(request, response);
        return ResponseEntity.ok(new ApiResponse<>(200, "Logout successful", null));
    }

}
