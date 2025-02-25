package org.example.server.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "`RefreshToken`")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RefreshToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "`Id`")
    private Long id;

    @Column(nullable = false, unique = true, name = "`Token`")
    private String token;

    @OneToOne
    @JoinColumn(name = "`UserId`", referencedColumnName = "`Id`")
    private User user;

    @Column(nullable = false, name = "`ExpiryDate`")
    private Instant expiryDate;

    public boolean isExpired() {
        return expiryDate.isBefore(Instant.now());
    }
}
