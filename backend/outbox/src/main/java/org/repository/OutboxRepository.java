package org.repository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.models.Outbox;
import org.models.OutboxStatus;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public class OutboxRepository {
    @PersistenceContext
    private EntityManager entityManager;

    public List<Outbox> getBatchForClaim(int size, Instant staleBefore) {
        return entityManager
                .createQuery("""
                    SELECT o FROM Outbox o
                        WHERE o.status = :pendingStatus
                           OR (o.status = :processingStatus AND o.lastAttemptAt < :staleBefore)
                        ORDER BY o.createdAt
                    """, Outbox.class)
                .setParameter("pendingStatus", OutboxStatus.PENDING)
                .setParameter("processingStatus", OutboxStatus.PROCESSING)
                .setParameter("staleBefore", staleBefore)
                .setLockMode(jakarta.persistence.LockModeType.PESSIMISTIC_WRITE)
                .setMaxResults(size)
                .getResultList();
    }

    public void save(Outbox outbox) {
        entityManager.persist(outbox);
    }

    public void setStatus(Outbox outbox, OutboxStatus status) {
        outbox.setStatus(status);
        entityManager.merge(outbox);
    }

    public Outbox getById(Integer id) {
        return entityManager.find(Outbox.class, id);
    }

    public int deleteSentBefore(Instant cutoff) {
        return entityManager.createQuery("""
                DELETE FROM Outbox o
                WHERE o.status = :status
                  AND o.lastAttemptAt < :cutoff
                """)
                .setParameter("status", OutboxStatus.SENT)
                .setParameter("cutoff", cutoff)
                .executeUpdate();
    }
}