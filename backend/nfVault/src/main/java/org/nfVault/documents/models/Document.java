package org.nfVault.documents.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Entity
@Table(name = "Documents")
@Builder @NoArgsConstructor @AllArgsConstructor
@Data
public class Document {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "Documents_id_gen")
    @SequenceGenerator(name = "Documents_id_gen", sequenceName = "Documents_id_seq", allocationSize = 1)
    private Integer id;

    @NotNull
    @Column(name = "name")
    private String name;

    @Column(name = "preview_path")
    private String preview_path;

    @NotNull
    @Column(name = "type")
    private String type;

    @NotNull
    @Column(name = "content")
    private String content;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private Document parent;
}
