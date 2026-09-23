package org.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;
import java.util.Map;

@Entity
@Table(name = "Outbox")
@Builder @NoArgsConstructor @AllArgsConstructor
@Data
public class Outbox {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "Outbox_id_gen")
    @SequenceGenerator(name = "Outbox_id_gen", sequenceName = "Outbox_id_seq", allocationSize = 1)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Column(name = "event_type", nullable = false, length = Integer.MAX_VALUE)
    private String eventType;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "last_attempt_at")
    private Instant lastAttemptAt;

    @ColumnDefault("0")
    @Column(name = "attempts", nullable = false)
    private Integer attempts;

    @Column(name = "payload", nullable = false)
    @JdbcTypeCode(SqlTypes.JSON)
    private Map<String, Object> payload;

    @ColumnDefault("'PENDING'")
    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "status", nullable = false)
    private OutboxStatus status;
}
