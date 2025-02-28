package org.example.server.service.impl;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.server.dto.Request.AuthRequest;
import org.example.server.dto.Request.SignUpRequest;
import org.example.server.dto.Response.ApiResponse;
import org.example.server.dto.Response.LoginResponse;
import org.example.server.entity.RefreshToken;
import org.example.server.entity.User;
import org.example.server.enums.Role;
import org.example.server.exception.AccountExistByEmailException;
import org.example.server.repository.UserRepository;
import org.example.server.service.AuthService;
import org.example.server.service.IJwtService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private final IJwtService jwtTokenService;

    @Override
    public LoginResponse authenticate(AuthRequest loginRequest, HttpServletResponse httpServletResponse) {
        Authentication authentication;
        try {
            authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));
        } catch (BadCredentialsException e) {
            throw new BadCredentialsException("Invalid username or password");
        }
        if (authentication.isAuthenticated()) {
            User user = userRepository.findByUsername(loginRequest.getUsername()).orElseThrow(() -> new BadCredentialsException("Authentication failed: Invalid credentials"));
            //Before (no refresh token)
            var accessToken = jwtTokenService.generateAccessToken(user, List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name())));
            //

            //After has refresh token
            var refreshToken = jwtTokenService.createRefreshToken(user.getUsername());

            // Set fresh token in HttpOnly Cookies
            ResponseCookie cookie = createRefreshCookie(refreshToken.getToken(), refreshToken.getExpiryDate());
            httpServletResponse.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());


            return LoginResponse.builder()
                    .accessToken(accessToken)
                    .expiresIn((int) (refreshToken.getExpiryDate().toEpochMilli() - System.currentTimeMillis()))
                    .tokenType("Bearer")
                    .build();
            //
        } else {
            throw new BadCredentialsException("Authentication failed: Invalid credentials");
        }
    }
    @Override
    public ApiResponse<String> handleSignUpNewUser(SignUpRequest signUpRequest) {
        if(userRepository.existsByUsername(signUpRequest.getUsername()))
            throw new AccountExistByEmailException("Username is already in use.");
        // Hash the password
        String hashedPassword = passwordEncoder.encode(signUpRequest.getPassword());
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        User user = User.builder()
                .username(signUpRequest.getUsername())
                .password(hashedPassword)
                .fullName(signUpRequest.getFullName())
                .email(signUpRequest.getEmail())
                .dateOfBirth((signUpRequest.getDateOfBirth() != null && !signUpRequest.getDateOfBirth().isEmpty()) ? LocalDate.parse(signUpRequest.getDateOfBirth(), formatter) : null)
                .role(Role.USER)
                .build();
        user = userRepository.save(user);
        return new ApiResponse<>(200, "User registered successfully", null);
    }


    // After add refresh token
    @Override
    public LoginResponse handleRefreshToken(String refreshToken, HttpServletResponse httpServletResponse) {
        if (jwtTokenService.validateToken(refreshToken)) {
            RefreshToken token = jwtTokenService.findByToken(refreshToken)
                    .orElseThrow(() -> new BadCredentialsException("Not found refresh token in DB"));

            RefreshToken verifiedToken = jwtTokenService.verifyExpiration(token);
            User user = verifiedToken.getUser();

            String newAccessToken = jwtTokenService.generateAccessToken(user, List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name())));
            RefreshToken newRefreshToken = jwtTokenService.createRefreshToken(user.getUsername());

            // Update refresh token in DB
            String newRefreshTokenValue = newRefreshToken.getToken();

            ResponseCookie cookie = createRefreshCookie(newRefreshTokenValue, newRefreshToken.getExpiryDate());
            httpServletResponse.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

            return LoginResponse.builder()
                    .accessToken(newAccessToken)
                    .build();
        } else {
            throw new BadCredentialsException("Invalid refresh token");
        }
    }

    @Override
    public void handleLogout(HttpServletRequest request, HttpServletResponse response) {
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

        if (refreshToken != null && !refreshToken.isEmpty()) {
            Optional<RefreshToken> refresh = jwtTokenService.findByToken(refreshToken);
            if (refresh.isPresent()) {
                jwtTokenService.deleteByToken(refreshToken);
                response.addHeader(HttpHeaders.SET_COOKIE, ResponseCookie.from("refreshToken", "")
                        .httpOnly(true)
                        .secure(true)
                        .path("/")
                        .maxAge(0)
                        .sameSite("None")
                        .build().toString());
            }
            else {
                throw new BadCredentialsException("Invalid refresh token, Not Found in Database");
            }
        } else {
            throw new BadCredentialsException("Refresh token not found");
        }
    }

    private ResponseCookie createRefreshCookie(String token, Instant expiry) {
        long seconds = (expiry.toEpochMilli() - System.currentTimeMillis()) / 1000;
        return ResponseCookie.from("refreshToken", token)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(seconds)
                .sameSite("None")
                .build();
    }
}
