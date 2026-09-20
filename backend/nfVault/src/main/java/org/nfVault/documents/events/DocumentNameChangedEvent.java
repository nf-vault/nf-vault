package org.nfVault.documents.events;

import org.api.OutboxEvent;
import org.api.annotations.EventType;

@EventType("document.name-changed")
public record DocumentNameChangedEvent(
        Integer id,
        String type,
        String title
) implements OutboxEvent {
}
