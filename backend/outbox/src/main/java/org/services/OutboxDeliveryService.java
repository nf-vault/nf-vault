package org.services;

import jakarta.transaction.Transactional;
import org.models.Outbox;
import org.models.OutboxStatus;
import org.repository.OutboxRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;

import java.time.Duration;
import java.time.Instant;
import java.util.List;

@Service
class OutboxDeliveryService {
    private final OutboxRepository outboxRepository;
    private final Duration processingTimeout;

    OutboxDeliveryService(
            OutboxRepository outboxRepository,
            @Value("${outbox.publisher.processing-message-retry-timeout:PT5M}") String processingRetryTimeout
    ) {
        this.outboxRepository = outboxRepository;
        this.processingTimeout = Duration.parse(processingRetryTimeout);
    }

    @Transactional
    List<Outbox> claimBatch(int size) {
        Instant now = Instant.now();
        List<Outbox> batch = outboxRepository.getBatchForClaim(size, now.minus(processingTimeout));

        batch.forEach(event -> {
            event.setStatus(OutboxStatus.PROCESSING);
            event.setAttempts(event.getAttempts() + 1);
            event.setLastAttemptAt(now);
            outboxRepository.setStatus(event, OutboxStatus.PROCESSING);
        });

        return batch;
    }

    @Transactional
    void markSent(Integer id) {
        Outbox event = outboxRepository.getById(id);
        if (event != null) {
            outboxRepository.setStatus(event, OutboxStatus.SENT);
        }
    }

    @Transactional
    void markPending(Integer id) {
        Outbox event = outboxRepository.getById(id);
        if (event != null) {
            outboxRepository.setStatus(event, OutboxStatus.PENDING);
        }
    }
}