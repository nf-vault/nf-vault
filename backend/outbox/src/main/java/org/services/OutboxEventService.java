package org.services;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import org.api.OutboxEvent;
import org.api.annotations.EventType;
import org.models.Outbox;
import org.models.OutboxStatus;
import org.repository.OutboxRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Map;

@Service
public class OutboxEventService {
    private final OutboxRepository outboxRepository;
    private final ObjectMapper objectMapper;

    OutboxEventService(OutboxRepository outboxRepository, ObjectMapper objectMapper) {
        this.outboxRepository = outboxRepository;
        this.objectMapper = objectMapper;
    }

    @Transactional
    public void enqueue(OutboxEvent event) {
        EventType eventType = event.getClass().getAnnotation(EventType.class);
        if (eventType == null) {
            throw new IllegalArgumentException(
                    "Outbox event must be annotated with @EventType: "
                            + event.getClass().getName()
            );
        }

        Map<String, Object> payload = objectMapper.convertValue(
                event,
                new TypeReference<>(){}
        );

        outboxRepository.save(
                Outbox.builder()
                        .eventType(eventType.value())
                        .createdAt(Instant.now())
                        .attempts(0)
                        .payload(payload)
                        .status(OutboxStatus.PENDING)
                        .build()
        );
    }
}