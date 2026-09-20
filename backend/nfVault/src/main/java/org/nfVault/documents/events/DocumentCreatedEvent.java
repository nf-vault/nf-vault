package org.nfVault.documents.events;

import org.api.OutboxEvent;
import org.api.annotations.EventType;

@EventType("document.created")
public record DocumentCreatedEvent(
        Integer id,
        String type,
        String title
) implements OutboxEvent {
}