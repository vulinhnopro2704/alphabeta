package org.example.server.entity;

import jakarta.persistence.*;
import lombok.*;
import org.example.server.enums.Role;
import java.time.LocalDate;
@Entity
@Table(name = "`User`")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "`Id`")
    private Long id;
    @Column(name = "`Username`")
    private String username;
    @Column(name = "`Password`")
    private String password;
    @Column(name = "`FullName`")
    private String fullName;
    @Column(name = "`Email`")
    private String email;
    @Column(name = "`Telephone`")
    private String telephone;
    @Column(name = "`AvatarUrl`")
    private String avatarUrl;
    @Column(name = "`DateOfBirth`")
    private LocalDate dateOfBirth;
    @Column(name = "`Role`")
    @Enumerated(EnumType.STRING)
    private Role role;
}
