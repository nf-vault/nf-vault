package org.nfVault.auth.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "Invite_Codes")
@Builder @NoArgsConstructor @AllArgsConstructor
@Data
public class InviteCode {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "Invite_Codes_id_gen")
    @SequenceGenerator(name = "Invite_Codes_id_gen", sequenceName = "Invite_Codes_id_seq", allocationSize = 1)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Size(max = 20)
    @NotNull
    @Column(name = "code", nullable = false, unique = true, length = 20)
    private String code;

    @NotNull
    @Column(name = "usages_left", nullable = false, length = 20)
    private Integer usagesLeft;

    @ManyToOne
    @JoinColumn(name = "generated_by")
    private User generatedBy;
}
