package org.example.server.service.impl;

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
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {
    private final AuthenticationManager authenticationManager;
    private final IJwtService jwtService;
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private final JWTTokenService jwtTokenService;

    @Override
    public LoginResponse authenticate(AuthRequest loginRequest) {
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
            var accessToken = jwtService.generatedClaim(user.getUsername(), List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name())));
            //

            //After has refresh token
            var refreshToken = jwtTokenService.createRefreshToken(user.getUsername());

            return LoginResponse.builder()
                    .accessToken(accessToken)
                    .refreshToken(refreshToken.getToken())
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
    public LoginResponse handleRefreshToken(String refreshToken) {
        if (jwtTokenService.validateToken(refreshToken)) {
            RefreshToken token = jwtTokenService.findByToken(refreshToken)
                    .orElseThrow(() -> new BadCredentialsException("Not found refresh token in DB"));

            RefreshToken verifiedToken = jwtTokenService.verifyExpiration(token);
            User user = verifiedToken.getUser();

            String newAccessToken = jwtTokenService.generateAccessToken(user, List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name())));
            RefreshToken newRefreshToken = jwtTokenService.createRefreshToken(user.getUsername());

            return LoginResponse.builder()
                    .accessToken(newAccessToken)
                    .refreshToken(newRefreshToken.getToken())
                    .build();
        } else {
            throw new BadCredentialsException("Invalid refresh token");
        }
    }
}
