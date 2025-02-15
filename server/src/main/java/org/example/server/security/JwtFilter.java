package org.example.server.security;

import io.jsonwebtoken.lang.Objects;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.example.server.entity.User;
import org.example.server.repository.UserRepository;
import org.example.server.service.IJwtService;
import java.io.IOException;
import java.util.*;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtFilter extends OncePerRequestFilter {

    private final IJwtService jwtService;
    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        List<String> headers = Collections.list(request.getHeaderNames());
        String token=null;
        if(headers.stream().anyMatch(header->header.equalsIgnoreCase("Authorization"))) {
            token = request.getHeader("Authorization");
        }
        if (token != null && (token.toUpperCase().startsWith("BEARER "))) {
            String jwt = token.substring(7);
            String username = null;
            try {
                username=jwtService.extractUsername(jwt);
            }catch (Exception e) {
                log.error(e.getMessage());
            }
            if (username != null && !Objects.isEmpty(username) && userRepository.existsByUsername(username)) {
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
}
