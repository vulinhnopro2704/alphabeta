package org.example.server.service;

import org.example.server.entity.RefreshToken;
import org.example.server.entity.User;

import java.util.Optional;

public interface IRefreshTokenService {
    public RefreshToken createRefreshToken(String username);

    public Optional<RefreshToken> findByToken(String token);

    public RefreshToken verifyExpiration(RefreshToken token);
    public void deleteByUser(User user);
}
