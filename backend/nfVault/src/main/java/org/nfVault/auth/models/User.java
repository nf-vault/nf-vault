package org.nfVault.auth.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "Users")
@Builder @NoArgsConstructor @AllArgsConstructor
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "Users_id_gen")
    @SequenceGenerator(name = "Users_id_gen", sequenceName = "Users_id_seq", allocationSize = 1)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Size(max = 60)
    @NotNull
    @Column(name = "username", nullable = false, unique = true, length = 60)
    private String username;

    @Size(max = 60)
    @NotNull
    @Column(name = "password_hash", nullable = false, length = 60)
    private String password;

    @OneToMany(mappedBy = "generatedBy", cascade = CascadeType.ALL)
    private List<InviteCode> inviteCodes;
}
