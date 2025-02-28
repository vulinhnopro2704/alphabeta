package org.example.server.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.example.server.entity.User;
import org.example.server.repository.UserRepository;
import org.example.server.service.IJwtService;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.util.Collections;
import java.util.List;

@Component
public class JwtFilter extends OncePerRequestFilter {

    private final IJwtService jwtTokenService;
    private final UserRepository userRepository;

    public JwtFilter(IJwtService jwtTokenService, UserRepository userRepository) {
        this.jwtTokenService = jwtTokenService;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String token = extractToken(request);
        if (token != null && jwtTokenService.validateToken(token)) {
            String username = null;
            try {
                username = jwtTokenService.getUsernameFromToken(token);
            }
            catch (Exception e) {
                logger.error(e.getMessage());
            }

            if (username != null && !username.trim().isEmpty() && userRepository.existsByUsername(username)) {
                User currentUser = userRepository.findByUsername(username).get();
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(username, currentUser,
                                List.of(new SimpleGrantedAuthority("ROLE_" + currentUser.getRole().name())));
                authentication.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }
        filterChain.doFilter(request, response);
    }

    private String extractToken(HttpServletRequest request) {
        List<String> headers = Collections.list(request.getHeaderNames());
        String token=null;
        if(headers.stream().anyMatch(header->header.equalsIgnoreCase("Authorization"))) {
            token = request.getHeader("Authorization");
        }
        if (token != null && (token.toUpperCase().startsWith("BEARER "))) {
            return token.substring(7);
        }
        return null;
    }
}
