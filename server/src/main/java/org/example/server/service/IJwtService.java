package org.example.server.service;

import io.jsonwebtoken.Claims;
import org.example.server.entity.RefreshToken;
import org.example.server.entity.User;
import org.springframework.security.core.GrantedAuthority;
import java.util.*;
import java.util.function.Function;

public interface IJwtService {
    public RefreshToken createRefreshToken(String username);

    // Tạo Access Token
    public String generateAccessToken(User user, Collection<? extends GrantedAuthority> claims);
    // Tạo Refresh Token
    public String generateRefreshToken(String username, Collection<? extends GrantedAuthority> claims);
    public Claims extractAllClaims(String token);
    public <T> T extractClaim(String token, Function<Claims, T> claimResole);
    // Lấy username từ JWT
    public String getUsernameFromToken(String token);
    // Kiểm tra JWT hợp lệ
    public boolean validateToken(String token);

    public Optional<RefreshToken> findByToken(String token);
    public RefreshToken verifyExpiration(RefreshToken token);
    public void deleteByUser(User user);
    void deleteByToken(String token);
}
