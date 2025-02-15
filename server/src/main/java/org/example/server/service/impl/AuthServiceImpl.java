package org.example.server.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.server.dto.Request.AuthRequest;
import org.example.server.dto.Request.SignUpRequest;
import org.example.server.dto.Response.ApiResponse;
import org.example.server.dto.Response.LoginResponse;
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
            var accessToken = jwtService.generatedClaim(user.getUsername(), List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name())));
            return LoginResponse.builder()
                    .accessToken(accessToken)
                    .build();
        } else {
            throw new BadCredentialsException("Authentication failed: Invalid credentials");
        }
    }
    @Override
    public ApiResponse<String> handleSignUpNewUser(SignUpRequest signUpRequest) {
        List<User> existingUsers = userRepository.findAllByEmail(signUpRequest.getEmail());
        if(userRepository.existsByUsername(signUpRequest.getUsername()))
            throw new AccountExistByEmailException("Username is already in use.");
        // Hash the password
        String hashedPassword = passwordEncoder.encode(signUpRequest.getPassword());
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        User user = User.builder()
                .username(signUpRequest.getUsername())
                .password(hashedPassword)
                .fullName(signUpRequest.getFullname())
                .email(signUpRequest.getEmail())
                .dateOfBirth((signUpRequest.getDateofbirth() != null && !signUpRequest.getDateofbirth().isEmpty()) ? LocalDate.parse(signUpRequest.getDateofbirth(), formatter) : null)
                .role(Role.USER)
                .build();
        user = userRepository.save(user);
        return new ApiResponse<>(200, "User registered successfully", null);
    }
}
