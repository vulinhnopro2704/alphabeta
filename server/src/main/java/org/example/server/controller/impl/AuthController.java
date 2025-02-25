//package org.example.server.controller.impl;
//
//import lombok.AllArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.example.server.dto.Request.AuthRequest;
//import org.example.server.dto.Request.SignUpRequest;
//import org.example.server.dto.Response.ApiResponse;
//import org.example.server.service.AuthService;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//@Slf4j
//@RestController
//@RequestMapping("/api/auth")
//@AllArgsConstructor
//public class AuthController {
//    private final AuthService authService;
//
//    @PostMapping("/login")
//    public ResponseEntity<?> signIn(@RequestBody AuthRequest loginRequest) {
//        var loginResponse = authService.authenticate(loginRequest);
//        if (loginResponse.getAccessToken() == null) {
//            ApiResponse<Object> response = new ApiResponse<>(401, "Login failed", null);
//            return ResponseEntity.status(401).body(response);
//        }
//        ApiResponse<Object> response = new ApiResponse<>(200, "Login successful", loginResponse);
//        return ResponseEntity.ok(response);
//    }
//    @PostMapping("/signup")
//    public ResponseEntity<?> signUp(@RequestBody SignUpRequest signUpRequest) {
//        var response = authService.handleSignUpNewUser(signUpRequest);
//        return ResponseEntity.ok(response);
//    }
//}
