package org.api;

import org.services.OutboxEventService;
import org.springframework.stereotype.Component;

@Component
public class OutboxEventAPI {
    private final OutboxEventService outboxEventService;

    public OutboxEventAPI(
            OutboxEventService outboxEventService
    ) {
        this.outboxEventService = outboxEventService;
    }

    public void enqueue(OutboxEvent event) {
        this.outboxEventService.enqueue(event);
    }
}
