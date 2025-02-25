package org.example.server.service.impl;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.example.server.entity.RefreshToken;
import org.example.server.entity.User;
import org.example.server.repository.RefreshTokenRepository;
import org.example.server.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.util.*;
import java.util.function.Function;

@Service
public class JWTTokenService {
    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @Autowired
    private UserRepository userRepository;

    @Value("${alphabeta.jwt.secret.key}")
    private String jwtSecret;

    @Value("${alphabeta.jwt.expiration}")
    private long jwtExpirationMs;

    @Value("${alphabeta.jwt.refreshExpiration}")
    private long jwtRefreshExpirationMs;

    private SecretKey signingKey;

    @PostConstruct
    private void init() {
        this.signingKey = Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    public RefreshToken createRefreshToken(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        RefreshToken oldRefreshToken = refreshTokenRepository.findByUser(user);
        if (oldRefreshToken != null) {
            refreshTokenRepository.delete(oldRefreshToken);
        }
        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUser(user);
        refreshToken.setToken(generateRefreshToken(username, List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()))));
        refreshToken.setExpiryDate(Instant.now().plusMillis(jwtRefreshExpirationMs)); // 7 ngày

        return refreshTokenRepository.save(refreshToken);
    }

    // Tạo Access Token
    public String generateAccessToken(User user, Collection<? extends GrantedAuthority> claims) {
        return Jwts.builder()
                .claim("Authorization", claims)
                .claim("role", user.getRole())
                .claim("email", user.getEmail())
                .subject(user.getUsername())
                .issuedAt(new Date())
                .issuer("AlphaBeta")
                .expiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(signingKey)
                .compact();
    }

    // Tạo Refresh Token
    public String generateRefreshToken(String username, Collection<? extends GrantedAuthority> claims) {
        return Jwts.builder()
                .claim("Authorization", claims)
                .subject(username)
                .issuedAt(new Date())
                .issuer("AlphaBeta")
                .expiration(new Date(System.currentTimeMillis() + jwtRefreshExpirationMs))
                .signWith(signingKey)
                .compact();
    }
    public Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(signingKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimResole) {
        final Claims claims = extractAllClaims(token);
        return claimResole.apply(claims);
    }

    // Lấy username từ JWT
    public String getUsernameFromToken(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // Kiểm tra JWT hợp lệ
    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(signingKey)
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (JwtException e) {
            return false;
        }
    }

    public Optional<RefreshToken> findByToken(String token) {
        Optional<RefreshToken> refreshToken = refreshTokenRepository.findByToken(token);
        return refreshToken;
    }

    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.isExpired()) {
            refreshTokenRepository.delete(token);
            throw new RuntimeException("Refresh token đã hết hạn, vui lòng đăng nhập lại!");
        }
        return token;
    }

    public void deleteByUser(User user) {
        refreshTokenRepository.deleteByUser(user);
    }
}
