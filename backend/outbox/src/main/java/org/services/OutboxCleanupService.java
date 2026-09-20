package org.services;

import lombok.extern.slf4j.Slf4j;
import org.repository.OutboxRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import java.time.Duration;
import java.time.Instant;

@Service
@Slf4j
class OutboxCleanupService {
    private final OutboxRepository outboxRepository;
    private final Duration retention;

    OutboxCleanupService(
            OutboxRepository outboxRepository,
            @Value("${outbox.cleanup.retention:PT2H}") String retention
    ) {
        this.outboxRepository = outboxRepository;
        this.retention = Duration.parse(retention);
    }

    @Scheduled(fixedDelayString = "${outbox.cleanup.delay:PT1H}")
    @Transactional
    void deleteOldSentEvents() {
        int deleted = outboxRepository.deleteSentBefore(Instant.now().minus(retention));
        if (deleted > 0) {
            log.info("Deleted {} sent outbox events", deleted);
        }
    }
}