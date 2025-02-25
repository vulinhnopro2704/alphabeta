package org.example.server.controller;

import org.example.server.dto.Request.AuthRequest;
import org.example.server.dto.Request.SignUpRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;

public interface IAuthController {
    public ResponseEntity<?> signIn(@RequestBody AuthRequest loginRequest);
    public ResponseEntity<?> signUp(@RequestBody SignUpRequest signUpRequest);
}
